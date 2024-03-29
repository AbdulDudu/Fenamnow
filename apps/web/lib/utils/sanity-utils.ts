import imageUrlBuilder from "@sanity/image-url";
import { client } from "@web/sanity/lib/client";

export const builder = imageUrlBuilder(client);

export function urlFor(source: any) {
  return builder.image(source);
}
