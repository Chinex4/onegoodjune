import { createImageUrlBuilder } from "@sanity/image-url";
import { sanityConfigured, sanityDataset, sanityProjectId } from "./env";
import type { EditorialImage } from "./types";
export function imageUrl(image?: EditorialImage, width = 1200, quality?: number) {
  if (!image?.asset?._ref || !sanityConfigured) return null;
  const builder = createImageUrlBuilder({
    projectId: sanityProjectId,
    dataset: sanityDataset,
  })
    .image(image)
    .width(width)
    .fit("max")
    .auto("format");
  return (quality ? builder.quality(quality) : builder).url();
}

// Asset refs carry the pixel size, e.g. image-abc-1800x1200-jpg.
export function imageSize(image?: EditorialImage) {
  const match = image?.asset?._ref?.match(/-(\d+)x(\d+)-/);
  if (!match) return null;
  const { top = 0, bottom = 0, left = 0, right = 0 } = image?.crop ?? {};
  return {
    width: Math.round(Number(match[1]) * (1 - left - right)),
    height: Math.round(Number(match[2]) * (1 - top - bottom)),
  };
}
