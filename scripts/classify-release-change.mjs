import { execSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

const APK_REQUIRED_PATTERNS = [
  /^android\//,
  /^ios\//,
  /^capacitor\.config\.(ts|js|json|mjs)$/,
  /^\.github\/workflows\/android-/,
];

const OTA_ELIGIBLE_PATTERNS = [
  /^src\//,
  /^index\.html$/,
  /^version\.json$/,
  /^vite\.config\.(ts|js|mjs)$/,
  /^public\/(?!updates\/)/,
];

/**
 * Classifies changed repository paths into:
 * - "apk_required": native Android/Capacitor config or native dependencies changed
 * - "ota_eligible": purely JS/TS/CSS/HTML/asset updates safe for Capacitor OTA bundle
 * - "no_app_changes": docs/tests/CI-only changes that do not require shipping an app bundle
 */
export function classifyChangedFiles(
  changedFiles,
  options = {}
) {
  const normalized = (changedFiles || [])
    .map((f) => String(f || '').trim().replace(/^\.\//, ''))
    .filter(Boolean);

  const apkTriggers = [];
  const otaFiles = [];

  for (const file of normalized) {
    if (file === 'package.json') {
      if (options.nativePackageChanged !== false) {
        apkTriggers.push(file);
      } else {
        otaFiles.push(file);
      }
      continue;
    }

    if (APK_REQUIRED_PATTERNS.some((re) => re.test(file))) {
      apkTriggers.push(file);
      continue;
    }

    if (OTA_ELIGIBLE_PATTERNS.some((re) => re.test(file))) {
      otaFiles.push(file);
    }
  }

  if (apkTriggers.length > 0) {
    return {
      classification: 'apk_required',
      shouldDeployOta: false,
      reason: `Native or Capacitor configuration changed (${apkTriggers.join(', ')}). A full signed APK release build is required.`,
      apkTriggers,
      otaFiles,
    };
  }

  if (otaFiles.length > 0) {
    return {
      classification: 'ota_eligible',
      shouldDeployOta: true,
      reason: `Only web bundle files changed (${otaFiles.length} file(s)). Safe to ship via OTA bundle.`,
      apkTriggers,
      otaFiles,
    };
  }

  return {
    classification: 'no_app_changes',
    shouldDeployOta: false,
    reason: 'No app runtime or native files changed.',
    apkTriggers,
    otaFiles,
  };
}

function getChangedFilesFromGit(baseRef, headRef) {
  try {
    const out = execSync(`git diff --name-only ${baseRef} ${headRef}`, {
      encoding: 'utf8',
    });
    return out
      .split('\n')
      .map((s) => s.trim())
      .filter(Boolean);
  } catch {
    return [];
  }
}

function didNativeDependenciesChange(baseRef, headRef) {
  try {
    const diff = execSync(`git diff -U0 ${baseRef} ${headRef} -- package.json`, {
      encoding: 'utf8',
    });
    if (!diff.trim()) return false;
    return /"@?capacitor|@capgo\/|cordova/i.test(diff);
  } catch {
    return true;
  }
}

function runCli() {
  const args = process.argv.slice(2);
  const baseIdx = args.indexOf('--base');
  const headIdx = args.indexOf('--head');
  const filesIdx = args.indexOf('--files');
  const githubOutput = process.env.GITHUB_OUTPUT;

  let changedFiles = [];
  let nativePackageChanged = true;

  if (filesIdx !== -1 && args[filesIdx + 1]) {
    changedFiles = args[filesIdx + 1].split(',').map((s) => s.trim()).filter(Boolean);
  } else {
    const baseRef = (baseIdx !== -1 && args[baseIdx + 1]) || 'HEAD~1';
    const headRef = (headIdx !== -1 && args[headIdx + 1]) || 'HEAD';
    changedFiles = getChangedFilesFromGit(baseRef, headRef);
    nativePackageChanged = didNativeDependenciesChange(baseRef, headRef);
  }

  const result = classifyChangedFiles(changedFiles, { nativePackageChanged });

  if (githubOutput) {
    fs.appendFileSync(
      githubOutput,
      `classification=${result.classification}\nshould_deploy_ota=${result.shouldDeployOta}\nreason=${result.reason}\n`
    );
  }

  console.log(JSON.stringify(result, null, 2));
}

if (
  process.argv[1] &&
  import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href
) {
  runCli();
}
