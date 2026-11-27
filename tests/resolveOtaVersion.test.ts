import { describe, expect, it } from 'vitest';
import {
  bumpPatchSemver,
  compareSemver,
  resolveNextOtaVersion,
} from '../scripts/resolve-ota-version.mjs';

describe('resolve-ota-version helper', () => {
  it('compares and bumps semver patch versions accurately', () => {
    expect(compareSemver('1.2.1', '1.2.0')).toBe(1);
    expect(compareSemver('1.2.0', '1.2.0')).toBe(0);
    expect(compareSemver('1.1.9', '1.2.0')).toBe(-1);
    expect(bumpPatchSemver('1.2.0')).toBe('1.2.1');
    expect(bumpPatchSemver('1.2.9')).toBe('1.2.10');
    expect(bumpPatchSemver('1.3.0-beta.1')).toBe('1.3.0');
  });

  it('uses configured version on initial publish when no live manifest or base version exists', () => {
    const resolved = resolveNextOtaVersion({
      versionJson: {
        appVersion: '1.2.0',
        buildNumber: 2,
        minNativeVersion: '1.2.0',
        channel: 'production',
        releaseNotes: 'Initial OTA',
      },
      baseVersionJson: null,
      liveManifest: null,
      channel: 'production',
    });

    expect(resolved.appVersion).toBe('1.2.0');
    expect(resolved.buildNumber).toBe(2);
    expect(resolved.autoBumped).toBe(false);
    expect(resolved.channel).toBe('production');
  });

  it('auto-bumps patch and buildNumber when version.json was not incremented above live manifest or base commit', () => {
    const resolved = resolveNextOtaVersion({
      versionJson: {
        appVersion: '1.2.0',
        buildNumber: 2,
        minNativeVersion: '1.2.0',
        channel: 'production',
      },
      baseVersionJson: {
        appVersion: '1.2.0',
        buildNumber: 2,
      },
      liveManifest: {
        version: '1.2.3',
        buildNumber: 7,
      },
      channel: 'production',
    });

    expect(resolved.appVersion).toBe('1.2.4');
    expect(resolved.buildNumber).toBe(8);
    expect(resolved.autoBumped).toBe(true);
    expect(resolved.minNativeVersion).toBe('1.2.0');
  });

  it('honors a manual minor/major bump above the live manifest and selects explicit channel', () => {
    const resolved = resolveNextOtaVersion({
      versionJson: {
        appVersion: '1.3.0',
        buildNumber: 12,
        minNativeVersion: '1.2.0',
        maxNativeVersion: '1.4.0',
        channel: 'production',
      },
      baseVersionJson: {
        appVersion: '1.2.5',
        buildNumber: 9,
      },
      liveManifest: {
        version: '1.2.6',
        buildNumber: 10,
      },
      channel: 'testing',
    });

    expect(resolved.appVersion).toBe('1.3.0');
    expect(resolved.buildNumber).toBe(12);
    expect(resolved.autoBumped).toBe(false);
    expect(resolved.channel).toBe('testing');
    expect(resolved.maxNativeVersion).toBe('1.4.0');
  });

  it('throws on invalid minNativeVersion/maxNativeVersion ordering or version lower than minNativeVersion', () => {
    expect(() =>
      resolveNextOtaVersion({
        versionJson: {
          appVersion: '1.2.0',
          buildNumber: 2,
          minNativeVersion: '1.3.0',
        },
      })
    ).toThrow(/cannot be lower than minNativeVersion/);

    expect(() =>
      resolveNextOtaVersion({
        versionJson: {
          appVersion: '1.3.0',
          buildNumber: 3,
          minNativeVersion: '1.3.0',
          maxNativeVersion: '1.2.0',
        },
      })
    ).toThrow(/maxNativeVersion .* cannot be lower than minNativeVersion/);
  });
});
