// @/utils/module-directory.spec.ts
import { describe, expect, it } from 'vitest';
import { buildModuleDirectorySections } from './module-directory';

describe('buildModuleDirectorySections', () => {
  it('keeps root pages in the fixed overview section', () => {
    const sections = buildModuleDirectorySections(
      [
        { slug: 'overview', title: 'Chemistry API Overview' },
        {
          slug: 'integration',
          title: 'Integration Guide',
          navigation: [
            { slug: 'embed', title: 'Direct Embed' },
            {
              slug: 'javascript',
              title: 'JavaScript Integration',
              navigation: [{ slug: 'native', title: 'Native JavaScript' }],
            },
          ],
        },
      ],
      'Overview',
    );

    expect(sections).toEqual([
      {
        id: 'overview',
        title: 'Overview',
        nodes: [{ slug: 'overview', title: 'Chemistry API Overview' }],
      },
      {
        id: 'integration',
        title: 'Integration Guide',
        nodes: [
          { slug: 'embed', title: 'Direct Embed' },
          {
            slug: 'javascript',
            title: 'JavaScript Integration',
            navigation: [{ slug: 'native', title: 'Native JavaScript' }],
          },
        ],
      },
    ]);
  });
});
