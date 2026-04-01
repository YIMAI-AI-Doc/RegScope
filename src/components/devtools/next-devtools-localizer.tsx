"use client";

import { useEffect } from "react";
import { localizeDevtoolsTree } from "@/lib/devtools/localize";

const NEXTJS_PORTAL_SELECTOR = "nextjs-portal";

export function NextDevtoolsLocalizer() {
  useEffect(() => {
    if (process.env.NODE_ENV !== "development") {
      return;
    }

    const observedRoots = new WeakSet<ShadowRoot>();
    const rootObservers: MutationObserver[] = [];

    const attachLocalizer = (shadowRoot: ShadowRoot) => {
      if (observedRoots.has(shadowRoot)) {
        return;
      }

      observedRoots.add(shadowRoot);
      localizeDevtoolsTree(shadowRoot);

      const shadowObserver = new MutationObserver(() => {
        localizeDevtoolsTree(shadowRoot);
      });

      shadowObserver.observe(shadowRoot, {
        characterData: true,
        childList: true,
        subtree: true,
      });

      rootObservers.push(shadowObserver);
    };

    const scanPortals = () => {
      document.querySelectorAll<HTMLElement>(NEXTJS_PORTAL_SELECTOR).forEach((portal) => {
        if (portal.shadowRoot) {
          attachLocalizer(portal.shadowRoot);
        }
      });
    };

    scanPortals();

    const bodyObserver = new MutationObserver(() => {
      scanPortals();
    });

    bodyObserver.observe(document.body, {
      childList: true,
      subtree: true,
    });

    return () => {
      bodyObserver.disconnect();
      rootObservers.forEach((observer) => observer.disconnect());
    };
  }, []);

  return null;
}
