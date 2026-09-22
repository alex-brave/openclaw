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
  it("insets only the trailing mark by the pill radius", () => {
    const row = ruleBody(".sidebar-recent-session.sidebar-recent-session--team");
    expect(row).toContain("padding: 0");
    expect(row).not.toContain("padding-inline-end");
    const endcap = ruleBody(
      ".sidebar-recent-session--team .sidebar-recent-session__details-endcap",
    );
    const cleared = endcap.lastIndexOf("margin: 0");
    const inset = endcap.lastIndexOf("margin-inline-end: var(--radius-md)");
    expect(inset, "trailing inset must follow the zero margin shorthand").toBeGreaterThan(cleared);
  });

  it("keeps the hover action reserve on the link, not a second row inset", () => {
    const hover = ruleBody(
      ".sidebar-recent-session--team:is(:hover, :focus-within) > .sidebar-recent-session__link",
    );
    expect(hover).toContain("padding-right: var(--session-row-actions-reserve)");
    expect(hover).not.toContain("padding-inline-end");
  });
});
