import { describe, it, expect, vi } from "vitest";
import { withRetry, isTransientError } from "./retry";

const httpError = (status: number) => ({ response: { status } });

describe("isTransientError", () => {
  it("treats 429 and 503 as transient", () => {
    expect(isTransientError(httpError(429))).toBe(true);
    expect(isTransientError(httpError(503))).toBe(true);
  });
  it("treats stable 4xx and unknown errors as non-transient", () => {
    expect(isTransientError(httpError(403))).toBe(false);
    expect(isTransientError(httpError(404))).toBe(false);
    expect(isTransientError(new Error("network"))).toBe(false);
    expect(isTransientError(undefined)).toBe(false);
  });
});

describe("withRetry", () => {
  const sleep = () => Promise.resolve();

  it("resolves on the first attempt without sleeping", async () => {
    const fn = vi.fn().mockResolvedValue("ok");
    const sleepSpy = vi.fn(sleep);
    await expect(withRetry(fn, { sleep: sleepSpy })).resolves.toBe("ok");
    expect(fn).toHaveBeenCalledTimes(1);
    expect(sleepSpy).not.toHaveBeenCalled();
  });

  it("retries a 429 then resolves", async () => {
    const fn = vi.fn().mockRejectedValueOnce(httpError(429)).mockResolvedValue("ok");
    await expect(withRetry(fn, { sleep })).resolves.toBe("ok");
    expect(fn).toHaveBeenCalledTimes(2);
  });

  it("retries a 503 then resolves", async () => {
    const fn = vi.fn().mockRejectedValueOnce(httpError(503)).mockResolvedValue("ok");
    await expect(withRetry(fn, { sleep })).resolves.toBe("ok");
    expect(fn).toHaveBeenCalledTimes(2);
  });

  it("gives up after the retry budget and rejects with the last error", async () => {
    const fn = vi.fn().mockRejectedValue(httpError(429));
    await expect(withRetry(fn, { retries: 2, sleep })).rejects.toMatchObject({
      response: { status: 429 },
    });
    expect(fn).toHaveBeenCalledTimes(3); // initial + 2 retries
  });

  it("never retries a stable 404", async () => {
    const fn = vi.fn().mockRejectedValue(httpError(404));
    await expect(withRetry(fn, { sleep })).rejects.toMatchObject({ response: { status: 404 } });
    expect(fn).toHaveBeenCalledTimes(1);
  });

  it("uses capped exponential backoff by default", async () => {
    const fn = vi
      .fn()
      .mockRejectedValueOnce(httpError(429))
      .mockRejectedValueOnce(httpError(429))
      .mockResolvedValue("ok");
    const waited: number[] = [];
    await withRetry(fn, { sleep: (ms) => (waited.push(ms), Promise.resolve()) });
    expect(waited).toEqual([400, 800]); // 400 * 2^0, 400 * 2^1
  });
});
