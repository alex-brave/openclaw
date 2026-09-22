// Roster session rows paint a selection pill with border-radius: var(--radius-md).
// padding: 0 on the team row puts the trailing status mark on that curve.
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

const rosterCss = fs.readFileSync(
  path.join(path.dirname(fileURLToPath(import.meta.url)), "sidebar-agent-roster.css"),
  "utf8",
);

function ruleBody(selector: string): string {
  const start = rosterCss.indexOf(`${selector} {`);
  expect(start, selector).toBeGreaterThanOrEqual(0);
  const open = rosterCss.indexOf("{", start);
  const close = rosterCss.indexOf("}", open);
  return rosterCss.slice(open + 1, close);
}

describe("team session row trailing inset", () => {
  it("insets the roster row by the pill radius so the status mark clears the corner", () => {
    const body = ruleBody(".sidebar-recent-session.sidebar-recent-session--team");
    const cleared = body.lastIndexOf("padding: 0");
    const inset = body.lastIndexOf("padding-inline-end: var(--radius-md)");
    expect(inset, "trailing inset must follow the zero padding shorthand").toBeGreaterThan(cleared);
  });

  it("keeps the hover action reserve on the link, not a second row inset", () => {
    const hover = ruleBody(
      ".sidebar-recent-session--team:is(:hover, :focus-within) > .sidebar-recent-session__link",
    );
    expect(hover).toContain("padding-right: var(--session-row-actions-reserve)");
    expect(hover).not.toContain("padding-inline-end");
  });
});
