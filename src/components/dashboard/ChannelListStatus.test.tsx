// @vitest-environment jsdom
import { describe, it, expect, vi, afterEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ChannelListStatus from "./ChannelListStatus";

afterEach(cleanup);

describe("ChannelListStatus", () => {
  it("shows a loading state (no Try-again) while fetching", () => {
    render(<ChannelListStatus isFetchingChannels channelFetchStatus={null} onRetry={() => {}} />);
    expect(screen.getByText(/Loading channels/i)).toBeTruthy();
    expect(screen.queryByRole("button", { name: /try again/i })).toBeNull();
  });

  it("explains a rate-limit for 503 and 429", () => {
    for (const status of [503, 429]) {
      render(<ChannelListStatus isFetchingChannels={false} channelFetchStatus={status} onRetry={() => {}} />);
      expect(screen.getByText(/briefly rate-limiting/i)).toBeTruthy();
      cleanup();
    }
  });

  it("explains a missing permission for 403", () => {
    render(<ChannelListStatus isFetchingChannels={false} channelFetchStatus={403} onRetry={() => {}} />);
    expect(screen.getByText(/Manage Channels permission/i)).toBeTruthy();
  });

  it("falls back to the bot-install hint for other/unknown statuses", () => {
    render(<ChannelListStatus isFetchingChannels={false} channelFetchStatus={null} onRetry={() => {}} />);
    expect(screen.getByText(/bot still installed/i)).toBeTruthy();
  });

  it("invokes onRetry when Try again is clicked", async () => {
    const onRetry = vi.fn();
    render(<ChannelListStatus isFetchingChannels={false} channelFetchStatus={500} onRetry={onRetry} />);
    await userEvent.click(screen.getByRole("button", { name: /try again/i }));
    expect(onRetry).toHaveBeenCalledTimes(1);
  });
});
