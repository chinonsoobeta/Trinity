import { defineConfig } from 'astro/config';

// Link previews need absolute URLs. www is the canonical host; the bare
// chinonsoobeta.dev redirects to it.
export default defineConfig({
  site: 'https://www.chinonsoobeta.dev',
  devToolbar: { enabled: false },
});
