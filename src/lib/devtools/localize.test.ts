import { describe, expect, it } from "vitest";
import { localizeDevtoolsLabel, localizeDevtoolsTree } from "./localize";

describe("next devtools localization", () => {
  it("translates the known overlay labels into Chinese", () => {
    expect(localizeDevtoolsLabel("Route")).toBe("路由");
    expect(localizeDevtoolsLabel("Static")).toBe("静态");
    expect(localizeDevtoolsLabel("Try Turbopack")).toBe("试用 Turbopack");
    expect(localizeDevtoolsLabel("Preferences")).toBe("偏好设置");
  });

  it("rewrites text-only leaf nodes in a devtools subtree", () => {
    document.body.innerHTML = `
      <div>
        <span>Route</span>
        <span>Static</span>
        <button><span>Try Turbopack</span></button>
        <button><span>Preferences</span></button>
      </div>
    `;

    const root = document.body.firstElementChild as HTMLDivElement;

    expect(localizeDevtoolsTree(root)).toBe(4);
    expect(root.textContent).toContain("路由");
    expect(root.textContent).toContain("静态");
    expect(root.textContent).toContain("试用 Turbopack");
    expect(root.textContent).toContain("偏好设置");
  });
});
