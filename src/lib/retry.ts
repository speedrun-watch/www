import type { AxiosError } from "axios";

export interface RetryOptions {
  /** Max retries after the first attempt (default 3 → up to 4 tries). */
  retries?: number;
  /** Backoff before retry `attempt` (0-indexed), in ms. */
  backoffMs?: (attempt: number) => number;
  /** Injectable delay (tests pass a no-op). */
  sleep?: (ms: number) => Promise<void>;
  /** Whether a given error is worth retrying (default: transient only). */
  shouldRetry?: (error: unknown) => boolean;
}

const defaultSleep = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms));

/**
 * Transient = worth retrying: 429 (Discord / our own rate limit) and 503 (our
 * API's "permission verification is temporarily rate-limited" signal). A stable
 * 4xx such as 403/404 is a real answer and is never retried.
 */
export function isTransientError(error: unknown): boolean {
  const status = (error as AxiosError | undefined)?.response?.status;
  return status === 429 || status === 503;
}

/**
 * Run `fn`, retrying transient failures with capped exponential backoff. This is
 * what makes the dashboard self-heal through a brief Discord rate-limit instead
 * of surfacing an error the user has to escape by reloading the page.
 */
export async function withRetry<T>(fn: () => Promise<T>, options: RetryOptions = {}): Promise<T> {
  const {
    retries = 3,
    backoffMs = (attempt) => Math.min(400 * 2 ** attempt, 2000),
    sleep = defaultSleep,
    shouldRetry = isTransientError,
  } = options;

  let attempt = 0;
  // eslint-disable-next-line no-constant-condition
  for (;;) {
    try {
      return await fn();
    } catch (error) {
      if (attempt < retries && shouldRetry(error)) {
        await sleep(backoffMs(attempt));
        attempt += 1;
        continue;
      }
      throw error;
    }
  }
}
