// @ts-check
import { defineConfig } from 'astro/config';

// https://astro.build/config
export default defineConfig({
  site: 'https://www.hopkinshauntedattraction.com',
  trailingSlash: 'always',
  build: {
    format: 'directory',
    inlineStylesheets: 'auto',
  },
  image: {
    // Generates srcset/sizes automatically for <Image>/<Picture> with a layout.
    layout: 'constrained',
    responsiveStyles: true,
  },
  compressHTML: true,
});
