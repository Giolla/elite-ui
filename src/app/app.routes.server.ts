import { RenderMode, ServerRoute } from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [
  {
    // Data is loaded client-side from ShipStore, so this route can't be
    // prerendered — render it in the browser.
    path: 'selected-space-ship/:id',
    renderMode: RenderMode.Client,
  },
  {
    path: '**',
    renderMode: RenderMode.Prerender,
  },
];
