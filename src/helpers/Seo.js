import { cdnPath } from '@/helpers/Cdn';

/*
Formats the first Storyblok SEO config into a map which can be merged into the head config.
Only populated fields are returned.

Currently duplicates title, description, image across all mediums (e.g. twitter, facebook, site)

seo_options {
    title,
    component,
    default_canonical,
    meta_image,
    meta_nofollow,
    meta_noindex,
    page_description,
    page_keywords,
    page_title,
}

TODO: Handle default_canonical
*/
export function metaFromStory(story, options) {
  const {
    content: { config },
  } = story;

  const seo = config?.find((item) => item.component === 'seo_options');

  // No seo config found
  if (!seo) {
    return {};
  }

  const head = {};
  const meta = [];
  const robots = [];

  Object.keys(seo).forEach((key) => {
    if (seo[key] === '') {
      return;
    }

    const name = key.substr(5);
    let value = seo[key];

    // Use the template title from the head config
    if (name === 'title') {
      value = options.titleTemplate.replace(/%s/, value);
    }

    // title, description, keywords
    if (key.startsWith('page_')) {
      // Use original value for top level items, since they'll be templated
      head[name] = seo[key];

      meta.push({
        hid: name,
        name,
        content: value,
      });

      meta.push({
        hid: `twitter:${name}`,
        name: `twitter:${name}`,
        content: value,
      });

      meta.push({
        hid: `og:${name}`,
        name: `og:${name}`,
        content: value,
      });
    }

    // image, nofollow, noindex
    else if (key.startsWith('meta_')) {
      if (['nofollow', 'noindex'].includes(name)) {
        if (value) {
          robots.push(name);
        }
      } else if (name === 'image') {
        const image = value;

        if (image.filename === '') {
          return;
        }

        meta.push({
          hid: 'og:image',
          property: 'og:image',
          content: cdnPath(image, false).toUrl(),
        });

        meta.push({
          hid: 'og:image:secure_url',
          property: 'og:image:secure_url',
          content: cdnPath(image, false).toUrl(),
        });

        meta.push({
          hid: 'twitter:image',
          name: 'twitter:image',
          content: cdnPath(image, false).toUrl(),
        });

        if (image.alt) {
          meta.push({
            hid: 'og:image:alt',
            property: 'og:image:alt',
            content: image.alt,
          });
        }
      }
    }
  });

  if (robots.length) {
    meta.push({
      hid: 'robots',
      name: 'robots',
      content: robots.join(', '),
    });
  }

  head.meta = meta;

  return head;
}
