// @fuyeor/reference-generator/src/paths.ts
import { resolve } from 'node:path';

export const CONTENT_ROOT = resolve(import.meta.dirname, '../../../content');

export const FRONTEND_DIST = resolve(
  import.meta.dirname,
  '../../../app/front-end/dist',
);

export type {
  ModuleIndexItem,
  NavNode,
} from '../../../app/front-end/src/document/type';
