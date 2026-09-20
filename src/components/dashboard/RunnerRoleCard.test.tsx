// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, cleanup, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";

// withRetry is unit-tested separately; here make it a pass-through so error
// paths surface immediately (no real backoff delays in a component test).
vi.mock("@/lib/retry", () => ({ withRetry: (fn: () => unknown) => fn() }));
vi.mock("@/lib/discord", () => ({ getDiscordBotInviteUrl: () => "https://invite" }));
vi.mock("@/lib/api", () => ({ default: { get: vi.fn(), patch: vi.fn(), post: vi.fn() } }));

import api from "@/lib/api";
import RunnerRoleCard from "./RunnerRoleCard";

const mockApi = api as unknown as { get: ReturnType<typeof vi.fn>; patch: ReturnType<typeof vi.fn>; post: ReturnType<typeof vi.fn> };

// A guild whose Runner role is already configured, so `enabled` is true and the
// roles section (where load errors surface) is rendered.
const settingsOk = { data: { runnerRoleId: "role1", runnerRoleErrorAt: null } };

const renderCard = () =>
  render(
    <MemoryRouter>
      <RunnerRoleCard selectedGuildId="g1" />
    </MemoryRouter>,
  );

beforeEach(() => vi.clearAllMocks());
afterEach(cleanup);

describe("RunnerRoleCard roles-load error UI", () => {
  it("shows the rate-limit message and a Try-again button when roles 503", async () => {
    mockApi.get.mockImplementation((url: string) => {
      if (url.includes("/settings")) return Promise.resolve(settingsOk);
      return Promise.reject({ response: { status: 503 } }); // /roles
    });
    renderCard();
    expect(await screen.findByText(/briefly rate-limiting/i)).toBeTruthy();
    expect(screen.getByRole("button", { name: /try again/i })).toBeTruthy();
  });

  it("shows the bot/server hint for a non-transient roles failure", async () => {
    mockApi.get.mockImplementation((url: string) => {
      if (url.includes("/settings")) return Promise.resolve(settingsOk);
      return Promise.reject({ response: { status: 500 } }); // not 429/503 → generic copy
    });
    renderCard();
    expect(await screen.findByText(/bot is still in the server/i)).toBeTruthy();
  });

  it("re-fetches settings + roles when Try again is clicked", async () => {
    mockApi.get.mockImplementation((url: string) => {
      if (url.includes("/settings")) return Promise.resolve(settingsOk);
      return Promise.reject({ response: { status: 503 } });
    });
    renderCard();
    await screen.findByRole("button", { name: /try again/i });
    expect(mockApi.get).toHaveBeenCalledTimes(2); // settings + roles on mount

    await userEvent.click(screen.getByRole("button", { name: /try again/i }));
    await waitFor(() => expect(mockApi.get).toHaveBeenCalledTimes(4)); // + settings + roles
  });
});
