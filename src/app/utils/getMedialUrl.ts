export function getMediaUrl(media: string | { url: string } | undefined): string {
  if (!media) return "";
  if (typeof media === "string") return media;
  if (typeof media === "object" && "url" in media) return media.url;
  return "";
}
