// Cloudflare Pages Functions compatibility
// This file ensures nodejs_compat is enabled

export default {
  async fetch(request, env, ctx) {
    // This is handled by Next.js on Pages
    return new Response('Next.js Pages Function', {
      headers: { 'Content-Type': 'text/plain' }
    });
  }
};

