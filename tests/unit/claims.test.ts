import { describe, expect, it } from 'vitest';
import { readFile } from 'node:fs/promises';

interface ClaimEntry {
  id: string;
  claim: string;
  where: string;
  test: string;
  sandbox: string;
}

describe('claim registry contract', () => {
  it('registers every claim tag exactly once with an executable sandbox command', async () => {
    const claims = JSON.parse(await readFile('.factory/claims.json', 'utf8')) as ClaimEntry[];
    expect(claims.length).toBeGreaterThan(0);
    expect(new Set(claims.map(({ id }) => id)).size).toBe(claims.length);

    const testSource = [
      await readFile('tests/e2e/site.spec.ts', 'utf8'),
      await readFile('tests/e2e/extension.spec.ts', 'utf8'),
      await readFile('tests/unit/capture.test.ts', 'utf8')
    ].join('\n');
    const registeredTags = new Set(claims.map(({ id }) => `@claim:${id}`));
    const sourceTags = testSource.match(/@claim:[a-z0-9-]+/g) || [];

    for (const claim of claims) {
      const tag = `@claim:${claim.id}`;
      expect(claim.claim.trim(), `${claim.id} claim`).not.toBe('');
      expect(claim.where.trim(), `${claim.id} locations`).not.toBe('');
      expect(claim.sandbox.trim(), `${claim.id} sandbox`).not.toBe('');
      expect(claim.test, `${claim.id} command`).toContain(tag);
      expect(claim.test, `${claim.id} command`).toMatch(/^npm run test:(?:unit|e2e) -- /);
      expect(sourceTags.filter((candidate) => candidate === tag), `${claim.id} source tag`).toHaveLength(1);
    }

    expect(sourceTags.filter((tag) => !registeredTags.has(tag)), 'unregistered source tags').toEqual([]);
  });
});
