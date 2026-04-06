import { useEffect } from "react";
import { absoluteUrl } from "../utils/site";

const DEFAULT_DESCRIPTION =
  "Heritage Sparrow offers handcrafted products rooted in Indian tradition with modern design.";
const DEFAULT_IMAGE = "/heitageSparrow.png";

function upsertMeta(selector, create) {
  let tag = document.head.querySelector(selector);
  if (!tag) {
    tag = create();
    document.head.appendChild(tag);
  }
  return tag;
}

export default function SEO({
  title = "HERITAGE SPARROW",
  description = DEFAULT_DESCRIPTION,
  canonicalPath = "/",
  image = DEFAULT_IMAGE,
  type = "website",
  jsonLd = null,
}) {
  useEffect(() => {
    document.title = title;

    upsertMeta('meta[name="description"]', () => {
      const meta = document.createElement("meta");
      meta.setAttribute("name", "description");
      return meta;
    }).setAttribute("content", description);

    const canonical = upsertMeta('link[rel="canonical"]', () => {
      const link = document.createElement("link");
      link.setAttribute("rel", "canonical");
      return link;
    });
    canonical.setAttribute("href", absoluteUrl(canonicalPath));

    const ogValues = {
      "og:title": title,
      "og:description": description,
      "og:type": type,
      "og:url": absoluteUrl(canonicalPath),
      "og:image": image.startsWith("http") ? image : absoluteUrl(image),
      "og:site_name": "Heritage Sparrow",
    };

    Object.entries(ogValues).forEach(([property, content]) => {
      upsertMeta(`meta[property="${property}"]`, () => {
        const meta = document.createElement("meta");
        meta.setAttribute("property", property);
        return meta;
      }).setAttribute("content", content);
    });

    const twitterValues = {
      "twitter:card": "summary_large_image",
      "twitter:title": title,
      "twitter:description": description,
      "twitter:image": image.startsWith("http") ? image : absoluteUrl(image),
    };

    Object.entries(twitterValues).forEach(([name, content]) => {
      upsertMeta(`meta[name="${name}"]`, () => {
        const meta = document.createElement("meta");
        meta.setAttribute("name", name);
        return meta;
      }).setAttribute("content", content);
    });
  }, [title, description, canonicalPath, image, type]);

  useEffect(() => {
    const existing = document.getElementById("hs-jsonld");
    if (existing) existing.remove();
    if (!jsonLd) return undefined;

    const script = document.createElement("script");
    script.id = "hs-jsonld";
    script.type = "application/ld+json";
    script.text = JSON.stringify(jsonLd);
    document.head.appendChild(script);

    return () => {
      const tag = document.getElementById("hs-jsonld");
      if (tag) tag.remove();
    };
  }, [jsonLd]);

  return null;
}
