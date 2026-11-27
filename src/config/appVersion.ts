import versionMeta from '../../version.json';

export type UpdateChannel = 'production' | 'testing';

export interface AppVersionMetadata {
  appVersion: string;
  buildNumber: number;
  bundleVersion: string;
  bundleBuildNumber: number;
  minNativeVersion: string;
  channel: UpdateChannel;
  releaseNotes: string;
}

const rawChannel =
  typeof import.meta !== 'undefined' && import.meta.env?.VITE_APP_CHANNEL
    ? String(import.meta.env.VITE_APP_CHANNEL).trim().toLowerCase()
    : versionMeta.channel;

const rawBundleVersion =
  typeof import.meta !== 'undefined' && import.meta.env?.VITE_BUNDLE_VERSION
    ? String(import.meta.env.VITE_BUNDLE_VERSION).trim().replace(/^v/i, '')
    : '';

const rawBundleBuildNumber =
  typeof import.meta !== 'undefined' && import.meta.env?.VITE_BUNDLE_BUILD_NUMBER
    ? Number.parseInt(String(import.meta.env.VITE_BUNDLE_BUILD_NUMBER).trim(), 10)
    : Number.NaN;

export const APP_VERSION_INFO: AppVersionMetadata = {
  appVersion: versionMeta.appVersion,
  buildNumber: Number(versionMeta.buildNumber) || 1,
  bundleVersion: rawBundleVersion || versionMeta.appVersion,
  bundleBuildNumber:
    Number.isFinite(rawBundleBuildNumber) && rawBundleBuildNumber > 0
      ? rawBundleBuildNumber
      : Number(versionMeta.buildNumber) || 1,
  minNativeVersion: versionMeta.minNativeVersion || versionMeta.appVersion,
  channel: rawChannel === 'testing' ? 'testing' : 'production',
  releaseNotes: versionMeta.releaseNotes || '',
};

export const APP_STORE_ID = 'com.meow.app';

export function getUpdatesBaseUrl(): string {
  const envUrl =
    typeof import.meta !== 'undefined' && import.meta.env?.VITE_UPDATES_BASE_URL
      ? String(import.meta.env.VITE_UPDATES_BASE_URL).trim()
      : '';
  if (!envUrl) return '';
  try {
    const parsed = new URL(envUrl);
    if (parsed.protocol !== 'https:' && parsed.protocol !== 'http:') {
      return '';
    }
    return parsed.toString().replace(/\/+$/, '');
  } catch {
    return '';
  }
}
