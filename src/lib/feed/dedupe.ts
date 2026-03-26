export function buildDedupeKey(sourceSlug: string, canonicalUrl: string) {
  return `${sourceSlug.trim().toLowerCase()}::${canonicalUrl.trim().toLowerCase()}`;
}

export function dedupeFeedKey(sourceSlug: string, canonicalUrl: string) {
  return buildDedupeKey(sourceSlug, canonicalUrl);
}
