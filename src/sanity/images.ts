import { createImageUrlBuilder } from "@sanity/image-url";
import { sanityConfigured, sanityDataset, sanityProjectId } from "./env";
import type { EditorialImage } from "./types";
export function imageUrl(image?: EditorialImage, width = 1200) {
  if (!image?.asset?._ref || !sanityConfigured) return null;
  return createImageUrlBuilder({
    projectId: sanityProjectId,
    dataset: sanityDataset,
  })
    .image(image)
    .width(width)
    .fit("max")
    .auto("format")
    .url();
}
