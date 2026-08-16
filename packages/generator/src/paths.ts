// @fuyeor/reference-generator/src/paths.ts
import path from 'node:path';

export const CONTENT_ROOT = path.resolve(
  import.meta.dirname,
  '../../../content',
);

export const FRONTEND_DIST = path.resolve(
  import.meta.dirname,
  '../../../apps/front-end/dist',
);
