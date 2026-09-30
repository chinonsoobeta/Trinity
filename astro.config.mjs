import { defineConfig } from 'astro/config';

// Link previews need absolute URLs. Vercel sets VERCEL_PROJECT_PRODUCTION_URL on
// every build: the production domain (a custom one if added), without the
// scheme — so this follows a future custom domain with no edit here. The
// fallback is today's production address, for local builds or if the variable
// is ever missing.
const productionHost = process.env.VERCEL_PROJECT_PRODUCTION_URL || 'datrinitypersonalsite.vercel.app';

export default defineConfig({
  site: `https://${productionHost}`,
  devToolbar: { enabled: false },
});
