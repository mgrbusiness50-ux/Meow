import { execSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

const SEMVER_RE = /^v?\d+\.\d+\.\d+(?:-[0-9A-Za-z.-]+)?$/;

export function parseSemver(raw) {
  const cleaned = String(raw || '').trim().replace(/^v/i, '');
  const [core, pre = ''] = cleaned.split('-', 2);
  const segs = core.split('.');
  const toNum = (val) => {
    const n = Number.parseInt(String(val || '0').replace(/[^\d]/g, ''), 10);
    return Number.isFinite(n) && n >= 0 ? n : 0;
  };
  return {
    major: toNum(segs[0]),
    minor: toNum(segs[1]),
    patch: toNum(segs[2]),
    prerelease: pre.trim(),
  };
}

export function compareSemver(a, b) {
  const pa = parseSemver(a);
  const pb = parseSemver(b);
  if (pa.major !== pb.major) return pa.major > pb.major ? 1 : -1;
  if (pa.minor !== pb.minor) return pa.minor > pb.minor ? 1 : -1;
  if (pa.patch !== pb.patch) return pa.patch > pb.patch ? 1 : -1;
  if (!pa.prerelease && pb.prerelease) return 1;
  if (pa.prerelease && !pb.prerelease) return -1;
  if (pa.prerelease !== pb.prerelease) {
    return pa.prerelease > pb.prerelease ? 1 : -1;
  }
  return 0;
}

export function bumpPatchSemver(raw) {
  const p = parseSemver(raw);
  if (p.prerelease) {
    return `${p.major}.${p.minor}.${p.patch}`;
  }
  return `${p.major}.${p.minor}.${p.patch + 1}`;
}

export function resolveNextOtaVersion({
  versionJson,
  baseVersionJson = null,
  liveManifest = null,
  channel = 'production',
}) {
  if (!versionJson || !SEMVER_RE.test(String(versionJson.appVersion || ''))) {
    throw new Error(`Invalid appVersion in version.json: ${versionJson?.appVersion}`);
  }

  const configuredVersion = String(versionJson.appVersion).trim().replace(/^v/i, '');
  const configuredBuild = Math.max(1, Number(versionJson.buildNumber) || 1);
  const minNativeVersion = String(versionJson.minNativeVersion || configuredVersion)
    .trim()
    .replace(/^v/i, '');

  if (!SEMVER_RE.test(minNativeVersion)) {
    throw new Error(`Invalid minNativeVersion in version.json: ${minNativeVersion}`);
  }

  const maxNativeVersion = versionJson.maxNativeVersion
    ? String(versionJson.maxNativeVersion).trim().replace(/^v/i, '')
    : '';
  if (maxNativeVersion) {
    if (!SEMVER_RE.test(maxNativeVersion)) {
      throw new Error(`Invalid maxNativeVersion in version.json: ${maxNativeVersion}`);
    }
    if (compareSemver(maxNativeVersion, minNativeVersion) < 0) {
      throw new Error(
        `maxNativeVersion (${maxNativeVersion}) cannot be lower than minNativeVersion (${minNativeVersion}).`
      );
    }
  }

  const liveVersion =
    liveManifest?.version && SEMVER_RE.test(String(liveManifest.version))
      ? String(liveManifest.version).trim().replace(/^v/i, '')
      : null;
  const liveBuild = liveManifest?.buildNumber ? Number(liveManifest.buildNumber) || 0 : 0;

  const baseVersion =
    baseVersionJson?.appVersion && SEMVER_RE.test(String(baseVersionJson.appVersion))
      ? String(baseVersionJson.appVersion).trim().replace(/^v/i, '')
      : null;
  const baseBuild = baseVersionJson?.buildNumber ? Number(baseVersionJson.buildNumber) || 0 : 0;

  // Determine the highest already-shipped/previous version
  let highestExisting = null;
  for (const candidate of [liveVersion, baseVersion]) {
    if (!candidate) continue;
    if (!highestExisting || compareSemver(candidate, highestExisting) > 0) {
      highestExisting = candidate;
    }
  }

  const highestBuild = Math.max(liveBuild, baseBuild);

  let nextVersion = configuredVersion;
  let autoBumped = false;

  if (highestExisting && compareSemver(configuredVersion, highestExisting) <= 0) {
    nextVersion = bumpPatchSemver(highestExisting);
    autoBumped = true;
  }

  if (compareSemver(nextVersion, minNativeVersion) < 0) {
    throw new Error(
      `Resolved OTA version (${nextVersion}) cannot be lower than minNativeVersion (${minNativeVersion}).`
    );
  }

  const nextBuildNumber =
    !autoBumped && configuredBuild > highestBuild
      ? configuredBuild
      : Math.max(configuredBuild, highestBuild) + 1;

  const resolvedChannel =
    channel === 'testing'
      ? 'testing'
      : channel === 'production'
        ? 'production'
        : versionJson.channel === 'testing'
          ? 'testing'
          : 'production';

  return {
    appVersion: nextVersion,
    buildNumber: nextBuildNumber,
    minNativeVersion,
    maxNativeVersion,
    channel: resolvedChannel,
    releaseNotes: String(versionJson.releaseNotes || ''),
    autoBumped,
    liveVersion,
    baseVersion,
  };
}

function readGitVersionJson(ref) {
  if (!ref || /^0+$/.test(ref)) return null;
  try {
    const raw = execSync(`git show ${ref}:version.json`, {
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'ignore'],
    });
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

async function fetchLiveManifest(updatesUrl, channel) {
  if (!updatesUrl) return null;
  const manifestName =
    channel === 'testing' ? 'ota-manifest-testing.json' : 'ota-manifest.json';
  const url = `${updatesUrl.replace(/\/+$/, '')}/${manifestName}?t=${Date.now()}`;
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 8000);
  try {
    const res = await fetch(url, { signal: controller.signal });
    if (res.status === 404 || !res.ok) return null;
    return await res.json();
  } catch {
    return null;
  } finally {
    clearTimeout(timer);
  }
}

async function runCli() {
  const args = process.argv.slice(2);
  const readArg = (flag) => {
    const idx = args.indexOf(flag);
    return idx !== -1 && args[idx + 1] ? args[idx + 1] : '';
  };

  const versionJson = JSON.parse(fs.readFileSync('version.json', 'utf8'));
  const channel = readArg('--channel') || versionJson.channel || 'production';
  const updatesUrl = readArg('--updates-url');
  const baseRef = readArg('--base-ref') || 'HEAD~1';

  const baseVersionJson = readGitVersionJson(baseRef);
  const liveManifest = await fetchLiveManifest(updatesUrl, channel);

  const resolved = resolveNextOtaVersion({
    versionJson,
    baseVersionJson,
    liveManifest,
    channel,
  });

  const githubOutput = process.env.GITHUB_OUTPUT;
  if (githubOutput) {
    const lines = [
      `app_version=${resolved.appVersion}`,
      `build_number=${resolved.buildNumber}`,
      `min_native_version=${resolved.minNativeVersion}`,
      `max_native_version=${resolved.maxNativeVersion}`,
      `channel=${resolved.channel}`,
      `auto_bumped=${resolved.autoBumped}`,
      `allow_publish=true`,
    ];
    fs.appendFileSync(githubOutput, `${lines.join('\n')}\n`);
  }

  console.log(JSON.stringify(resolved, null, 2));
}

if (
  process.argv[1] &&
  import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href
) {
  await runCli();
}
