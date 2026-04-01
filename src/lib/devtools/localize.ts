const DEVTOOLS_TRANSLATIONS: Record<string, string> = {
  Route: "路由",
  Static: "静态",
  Dynamic: "动态",
  "Static Route": "静态路由",
  "Dynamic Route": "动态路由",
  "Route Info": "路由信息",
  "Try Turbopack": "试用 Turbopack",
  Preferences: "偏好设置",
  "Learn More": "了解更多",
};

export function localizeDevtoolsLabel(label: string): string {
  const normalized = label.trim();

  return DEVTOOLS_TRANSLATIONS[normalized] ?? label;
}

export function localizeDevtoolsTree(root: ParentNode): number {
  let updatedCount = 0;

  root.querySelectorAll("*").forEach((element) => {
    if (element.childElementCount > 0 || element.childNodes.length !== 1) {
      return;
    }

    const textNode = element.firstChild;
    if (!textNode || textNode.nodeType !== Node.TEXT_NODE) {
      return;
    }

    const translated = localizeDevtoolsLabel(textNode.textContent ?? "");
    if (translated === textNode.textContent) {
      return;
    }

    textNode.textContent = translated;
    updatedCount += 1;
  });

  return updatedCount;
}
