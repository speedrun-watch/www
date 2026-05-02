import { Fragment, type ReactNode } from "react";

const FLAG_REGEX = /[\u{1F1E6}-\u{1F1FF}][\u{1F1E6}-\u{1F1FF}]/gu;
const TWEMOJI_BASE = "https://cdn.jsdelivr.net/gh/jdecked/twemoji@15.1.0/assets/svg";

function toCodepoints(emoji: string): string {
  const cps: string[] = [];
  for (const ch of emoji) cps.push(ch.codePointAt(0)!.toString(16));
  return cps.join("-");
}

export function Twemoji({ text }: { text: string }): ReactNode {
  const parts: ReactNode[] = [];
  let lastIndex = 0;
  let key = 0;
  for (const match of text.matchAll(FLAG_REGEX)) {
    const idx = match.index!;
    if (idx > lastIndex) parts.push(<Fragment key={key++}>{text.slice(lastIndex, idx)}</Fragment>);
    parts.push(
      <img
        key={key++}
        src={`${TWEMOJI_BASE}/${toCodepoints(match[0])}.svg`}
        alt={match[0]}
        draggable={false}
        className="inline h-[1em] w-auto align-[-0.125em]"
      />
    );
    lastIndex = idx + match[0].length;
  }
  if (lastIndex < text.length) parts.push(<Fragment key={key++}>{text.slice(lastIndex)}</Fragment>);
  return <>{parts}</>;
}
