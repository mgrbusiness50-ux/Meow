import { Capacitor } from '@capacitor/core';
import { App as CapApp } from '@capacitor/app';
import { CapacitorUpdater } from '@capgo/capacitor-updater';
import {
  APP_VERSION_INFO,
  UpdateChannel,
  getUpdatesBaseUrl,
} from '../config/appVersion.ts';

export interface OtaManifest {
  version: string;
  buildNumber: number;
  bundleUrl: string;
  checksum?: string;
  minNativeVersion?: string;
  maxNativeVersion?: string;
  channel?: UpdateChannel;
  releaseNotes?: string;
  mandatory?: boolean;
  publishedAt?: string;
}

export interface ApkReleaseManifest {
  latestVersion: string;
  latestBuildNumber: number;
  minSupportedVersion?: string;
  apkUrl: string;
  sha256?: string;
  releaseNotes?: string;
  mandatory?: boolean;
  publishedAt?: string;
}

export interface UpdateCheckResult {
  configured: boolean;
  status:
    | 'unconfigured'
    | 'checking'
    | 'up_to_date'
    | 'ota_available'
    | 'apk_required'
    | 'error';
  currentNativeVersion: string;
  currentBuildNumber: number;
  currentBundleVersion: string;
  otaUpdate: OtaManifest | null;
  apkUpdate: (ApkReleaseManifest & { isMandatory: boolean }) | null;
  errorMessage?: string;
}

export interface OtaApplyResult {
  success: boolean;
  appliedImmediately: boolean;
  stagedForNextLaunch?: boolean;
  version?: string;
  errorMessage?: string;
}

let updaterInitialized = false;

export function parseSemverParts(raw: string): {
  major: number;
  minor: number;
  patch: number;
  prerelease: string;
} {
  const cleaned = String(raw || '')
    .trim()
    .replace(/^v/i, '');
  const [corePart, prePart = ''] = cleaned.split('-', 2);
  const segs = corePart.split('.');
  const toNum = (v: string | undefined): number => {
    const n = Number.parseInt((v || '0').replace(/[^\d]/g, ''), 10);
    return Number.isFinite(n) && n >= 0 ? n : 0;
  };
  return {
    major: toNum(segs[0]),
    minor: toNum(segs[1]),
    patch: toNum(segs[2]),
    prerelease: prePart.trim(),
  };
}

export function compareSemver(a: string, b: string): number {
  const pa = parseSemverParts(a);
  const pb = parseSemverParts(b);
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

function isSafeDownloadUrl(rawUrl: unknown): boolean {
  if (typeof rawUrl !== 'string') return false;
  const trimmed = rawUrl.trim();
  if (!trimmed) return false;
  try {
    const parsed = new URL(trimmed);
    const proto = parsed.protocol.toLowerCase();
    if (proto === 'https:') return true;
    const isDev =
      typeof import.meta !== 'undefined' && Boolean(import.meta.env?.DEV);
    return isDev && proto === 'http:';
  } catch {
    return false;
  }
}

export function isOtaManifestApplicable(
  manifest: OtaManifest | null | undefined,
  currentNativeVersion: string = APP_VERSION_INFO.appVersion,
  currentBundleVersion: string = APP_VERSION_INFO.appVersion,
  channel: UpdateChannel = APP_VERSION_INFO.channel
): manifest is OtaManifest {
  if (!manifest || !manifest.version || !manifest.bundleUrl) return false;
  if (!isSafeDownloadUrl(manifest.bundleUrl)) return false;

  if (manifest.channel && manifest.channel !== channel) {
    return false;
  }

  if (
    manifest.minNativeVersion &&
    compareSemver(currentNativeVersion, manifest.minNativeVersion) < 0
  ) {
    return false;
  }

  if (
    manifest.maxNativeVersion &&
    compareSemver(currentNativeVersion, manifest.maxNativeVersion) > 0
  ) {
    return false;
  }

  return compareSemver(manifest.version, currentBundleVersion) > 0;
}

export function evaluateApkRelease(
  manifest: ApkReleaseManifest | null | undefined,
  currentNativeVersion: string = APP_VERSION_INFO.appVersion,
  currentBuildNumber: number = APP_VERSION_INFO.buildNumber
): (ApkReleaseManifest & { isMandatory: boolean }) | null {
  if (!manifest || !manifest.latestVersion || !manifest.apkUrl) return null;
  if (!isSafeDownloadUrl(manifest.apkUrl)) return null;

  const cmp = compareSemver(manifest.latestVersion, currentNativeVersion);
  const isNewer =
    cmp > 0 ||
    (cmp === 0 && Number(manifest.latestBuildNumber || 0) > currentBuildNumber);

  if (!isNewer) return null;

  const belowMinimum = Boolean(
    manifest.minSupportedVersion &&
      compareSemver(currentNativeVersion, manifest.minSupportedVersion) < 0
  );

  return {
    ...manifest,
    isMandatory: Boolean(manifest.mandatory) || belowMinimum,
  };
}

export async function initUpdateService(): Promise<void> {
  if (updaterInitialized) return;
  updaterInitialized = true;
  if (!Capacitor.isNativePlatform()) return;

  try {
    await CapacitorUpdater.notifyAppReady();
  } catch (err) {
    console.warn('CapacitorUpdater.notifyAppReady skipped:', err);
  }
}

export async function getNativeAppVersionInfo(): Promise<{
  version: string;
  buildNumber: number;
}> {
  if (!Capacitor.isNativePlatform()) {
    return {
      version: APP_VERSION_INFO.appVersion,
      buildNumber: APP_VERSION_INFO.buildNumber,
    };
  }
  try {
    const info = await CapApp.getInfo();
    const version = String(info?.version || '').trim() || APP_VERSION_INFO.appVersion;
    const parsedBuild = Number.parseInt(String(info?.build || ''), 10);
    const buildNumber =
      Number.isFinite(parsedBuild) && parsedBuild > 0
        ? parsedBuild
        : APP_VERSION_INFO.buildNumber;
    return { version, buildNumber };
  } catch {
    return {
      version: APP_VERSION_INFO.appVersion,
      buildNumber: APP_VERSION_INFO.buildNumber,
    };
  }
}

export async function getInstalledBundleVersion(): Promise<string> {
  if (!Capacitor.isNativePlatform()) {
    return APP_VERSION_INFO.bundleVersion;
  }
  try {
    const info = await CapacitorUpdater.current();
    const ver = info?.bundle?.version;
    if (ver && ver !== 'builtin') {
      return ver;
    }
  } catch (err) {
    console.warn('Could not read CapacitorUpdater current bundle:', err);
  }
  return APP_VERSION_INFO.bundleVersion;
}

type ManifestFetchResult<T> =
  | { outcome: 'ok'; data: T }
  | { outcome: 'not_found'; data: null }
  | { outcome: 'error'; data: null };

async function fetchJsonWithTimeoutDetailed<T>(
  url: string,
  timeoutMs = 8000
): Promise<ManifestFetchResult<T>> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const res = await fetch(url, {
      method: 'GET',
      cache: 'no-store',
      signal: controller.signal,
    });
    if (res.status === 404) {
      return { outcome: 'not_found', data: null };
    }
    if (!res.ok) {
      return { outcome: 'error', data: null };
    }
    return { outcome: 'ok', data: (await res.json()) as T };
  } catch {
    return { outcome: 'error', data: null };
  } finally {
    clearTimeout(timer);
  }
}

async function fetchOtaManifestDetailed(
  baseUrl: string,
  channel: UpdateChannel = APP_VERSION_INFO.channel
): Promise<ManifestFetchResult<OtaManifest>> {
  if (!baseUrl) return { outcome: 'not_found', data: null };
  if (channel === 'testing') {
    const testingManifest = await fetchJsonWithTimeoutDetailed<OtaManifest>(
      `${baseUrl}/ota-manifest-testing.json`
    );
    if (testingManifest.outcome === 'ok') return testingManifest;
    const prodFallback = await fetchJsonWithTimeoutDetailed<OtaManifest>(
      `${baseUrl}/ota-manifest.json`
    );
    if (prodFallback.outcome === 'ok' || testingManifest.outcome === 'not_found') {
      return prodFallback;
    }
    return testingManifest;
  }
  return fetchJsonWithTimeoutDetailed<OtaManifest>(`${baseUrl}/ota-manifest.json`);
}

export async function fetchOtaManifest(
  baseUrl: string,
  channel: UpdateChannel = APP_VERSION_INFO.channel
): Promise<OtaManifest | null> {
  const res = await fetchOtaManifestDetailed(baseUrl, channel);
  return res.data;
}

export async function fetchApkReleaseManifest(
  baseUrl: string
): Promise<ApkReleaseManifest | null> {
  if (!baseUrl) return null;
  const res = await fetchJsonWithTimeoutDetailed<ApkReleaseManifest>(
    `${baseUrl}/apk-release.json`
  );
  return res.data;
}

export async function checkForUpdates(opts?: {
  baseUrl?: string;
  channel?: UpdateChannel;
  currentNativeVersion?: string;
  currentBuildNumber?: number;
  currentBundleVersion?: string;
}): Promise<UpdateCheckResult> {
  const baseUrl = (opts?.baseUrl ?? getUpdatesBaseUrl()).replace(/\/+$/, '');
  const channel = opts?.channel ?? APP_VERSION_INFO.channel;
  const nativeInfo =
    opts?.currentNativeVersion && opts?.currentBuildNumber !== undefined
      ? {
          version: opts.currentNativeVersion,
          buildNumber: opts.currentBuildNumber,
        }
      : await getNativeAppVersionInfo();
  const currentNativeVersion =
    opts?.currentNativeVersion ?? nativeInfo.version;
  const currentBuildNumber =
    opts?.currentBuildNumber ?? nativeInfo.buildNumber;
  const currentBundleVersion =
    opts?.currentBundleVersion ?? (await getInstalledBundleVersion());

  if (!baseUrl) {
    return {
      configured: false,
      status: 'unconfigured',
      currentNativeVersion,
      currentBuildNumber,
      currentBundleVersion,
      otaUpdate: null,
      apkUpdate: null,
    };
  }

  try {
    const [apkRes, otaRes] = await Promise.all([
      fetchJsonWithTimeoutDetailed<ApkReleaseManifest>(`${baseUrl}/apk-release.json`),
      fetchOtaManifestDetailed(baseUrl, channel),
    ]);

    const apkManifest = apkRes.data;
    const otaManifest = otaRes.data;

    const apkUpdate = evaluateApkRelease(
      apkManifest,
      currentNativeVersion,
      currentBuildNumber
    );

    const otaUpdate = isOtaManifestApplicable(
      otaManifest,
      currentNativeVersion,
      currentBundleVersion,
      channel
    )
      ? otaManifest
      : null;

    if (apkUpdate && (!otaUpdate || apkUpdate.isMandatory)) {
      return {
        configured: true,
        status: 'apk_required',
        currentNativeVersion,
        currentBuildNumber,
        currentBundleVersion,
        otaUpdate,
        apkUpdate,
      };
    }

    if (otaUpdate) {
      return {
        configured: true,
        status: 'ota_available',
        currentNativeVersion,
        currentBuildNumber,
        currentBundleVersion,
        otaUpdate,
        apkUpdate,
      };
    }

    // Only treat as connection failure if neither manifest succeeded AND at least one had a real network/5xx failure
    if (
      !apkManifest &&
      !otaManifest &&
      (apkRes.outcome === 'error' || otaRes.outcome === 'error') &&
      apkRes.outcome !== 'not_found' &&
      otaRes.outcome !== 'not_found'
    ) {
      return {
        configured: true,
        status: 'error',
        currentNativeVersion,
        currentBuildNumber,
        currentBundleVersion,
        otaUpdate: null,
        apkUpdate: null,
        errorMessage: 'مش قادرين نوصل لسيرفر التحديثات دلوقتي.',
      };
    }

    return {
      configured: true,
      status: 'up_to_date',
      currentNativeVersion,
      currentBuildNumber,
      currentBundleVersion,
      otaUpdate: null,
      apkUpdate: null,
    };
  } catch (err) {
    return {
      configured: true,
      status: 'error',
      currentNativeVersion,
      currentBuildNumber,
      currentBundleVersion,
      otaUpdate: null,
      apkUpdate: null,
      errorMessage:
        err instanceof Error
          ? err.message
          : 'حصلت مشكلة وقت التشييك على التحديثات.',
    };
  }
}

export async function applyOtaUpdate(
  manifest: OtaManifest
): Promise<OtaApplyResult> {
  if (!isSafeDownloadUrl(manifest.bundleUrl)) {
    return {
      success: false,
      appliedImmediately: false,
      errorMessage: 'رابط حزمة التحديث غير صالح أو غير آمن.',
    };
  }

  if (!Capacitor.isNativePlatform()) {
    return {
      success: false,
      appliedImmediately: false,
      errorMessage: 'التحديث الهوائي الفوري متاح داخل تطبيق Android المثبت.',
    };
  }

  try {
    const bundle = await CapacitorUpdater.download({
      url: manifest.bundleUrl,
      version: manifest.version,
      ...(manifest.checksum ? { checksum: manifest.checksum } : {}),
    });

    const staged = await CapacitorUpdater.next({ id: bundle.id });
    return {
      success: true,
      appliedImmediately: false,
      stagedForNextLaunch: true,
      version: staged?.version || bundle.version || manifest.version,
    };
  } catch (err) {
    return {
      success: false,
      appliedImmediately: false,
      errorMessage:
        err instanceof Error
          ? err.message
          : 'تعذر تحميل وتجهيز التحديث. يمكنك المحاولة لاحقًا.',
    };
  }
}

export async function reloadAppToApplyStagedUpdate(): Promise<{
  success: boolean;
  errorMessage?: string;
}> {
  if (!Capacitor.isNativePlatform()) {
    return {
      success: false,
      errorMessage: 'إعادة التشغيل لتطبيق التحديث متاحة داخل تطبيق Android المثبت.',
    };
  }

  try {
    await CapacitorUpdater.reload();
    return { success: true };
  } catch (err) {
    return {
      success: false,
      errorMessage:
        err instanceof Error
          ? err.message
          : 'تعذر إعادة تشغيل التطبيق لتفعيل التحديث.',
    };
  }
}
