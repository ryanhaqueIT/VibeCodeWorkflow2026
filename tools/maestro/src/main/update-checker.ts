/**
 * Update checker for Maestro
 * Fetches release information from GitHub API to check for updates
 */

// GitHub repository information
const GITHUB_OWNER = 'pedramamini';
const GITHUB_REPO = 'Maestro';
const RELEASES_URL = `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/releases`;

export interface ReleaseAsset {
  name: string;
  browser_download_url: string;
  size: number;
  content_type: string;
}

export interface Release {
  tag_name: string;
  name: string;
  body: string;
  html_url: string;
  published_at: string;
  prerelease: boolean;
  draft: boolean;
  assets: ReleaseAsset[];
}

export interface UpdateCheckResult {
  currentVersion: string;
  latestVersion: string;
  updateAvailable: boolean;
  versionsBehind: number;
  releases: Release[];
  releasesUrl: string;
  assetsReady: boolean;
  error?: string;
}

/**
 * Check if a release has assets available for the current platform
 */
function hasAssetsForPlatform(release: Release): boolean {
  if (!release.assets || release.assets.length === 0) {
    return false;
  }

  const platform = process.platform;
  const assetNames = release.assets.map(a => a.name.toLowerCase());

  switch (platform) {
    case 'darwin':
      // macOS: look for .dmg or .zip (arm64 or x64)
      return assetNames.some(name =>
        name.endsWith('.dmg') ||
        (name.endsWith('.zip') && (name.includes('mac') || name.includes('darwin')))
      );
    case 'win32':
      // Windows: look for .exe or .msi
      return assetNames.some(name =>
        name.endsWith('.exe') || name.endsWith('.msi')
      );
    case 'linux':
      // Linux: look for .AppImage, .deb, .rpm, or .tar.gz
      return assetNames.some(name =>
        name.endsWith('.appimage') ||
        name.endsWith('.deb') ||
        name.endsWith('.rpm') ||
        (name.endsWith('.tar.gz') && name.includes('linux'))
      );
    default:
      // Unknown platform, assume assets are ready if any exist
      return release.assets.length > 0;
  }
}

/**
 * Parse version string to comparable array
 * e.g., "0.7.0" -> [0, 7, 0]
 */
function parseVersion(version: string): number[] {
  // Remove 'v' prefix if present
  const cleaned = version.replace(/^v/, '');
  return cleaned.split('.').map(n => parseInt(n, 10) || 0);
}

/**
 * Compare two versions
 * Returns: 1 if a > b, -1 if a < b, 0 if equal
 */
function compareVersions(a: string, b: string): number {
  const partsA = parseVersion(a);
  const partsB = parseVersion(b);

  const maxLength = Math.max(partsA.length, partsB.length);

  for (let i = 0; i < maxLength; i++) {
    const numA = partsA[i] || 0;
    const numB = partsB[i] || 0;

    if (numA > numB) return 1;
    if (numA < numB) return -1;
  }

  return 0;
}

/**
 * Fetch all releases from GitHub API
 */
async function fetchReleases(): Promise<Release[]> {
  const response = await fetch(RELEASES_URL, {
    headers: {
      'Accept': 'application/vnd.github.v3+json',
      'User-Agent': 'Maestro-Update-Checker',
    },
  });

  if (!response.ok) {
    throw new Error(`GitHub API error: ${response.status} ${response.statusText}`);
  }

  const releases = (await response.json()) as Release[];

  // Filter out drafts, prereleases, and tags with prerelease suffixes (-rc, -beta, -alpha)
  const prereleasePattern = /-(rc|beta|alpha|dev|canary)/i;
  return releases
    .filter(r => !r.draft && !r.prerelease && !prereleasePattern.test(r.tag_name))
    .sort((a, b) => compareVersions(b.tag_name, a.tag_name));
}

/**
 * Count how many versions behind the current version is
 */
function countVersionsBehind(currentVersion: string, releases: Release[]): number {
  let count = 0;
  for (const release of releases) {
    if (compareVersions(release.tag_name, currentVersion) > 0) {
      count++;
    } else {
      break;
    }
  }
  return count;
}

/**
 * Get releases that are newer than the current version
 */
function getNewerReleases(currentVersion: string, releases: Release[]): Release[] {
  return releases.filter(r => compareVersions(r.tag_name, currentVersion) > 0);
}

/**
 * Check for updates
 */
export async function checkForUpdates(currentVersion: string): Promise<UpdateCheckResult> {
  const releasesUrl = `https://github.com/${GITHUB_OWNER}/${GITHUB_REPO}/releases`;

  try {
    const allReleases = await fetchReleases();

    if (allReleases.length === 0) {
      return {
        currentVersion,
        latestVersion: currentVersion,
        updateAvailable: false,
        versionsBehind: 0,
        releases: [],
        releasesUrl,
        assetsReady: false,
      };
    }

    const latestVersion = allReleases[0].tag_name.replace(/^v/, '');
    const newerReleases = getNewerReleases(currentVersion, allReleases);
    const versionsBehind = countVersionsBehind(currentVersion, allReleases);
    const updateAvailable = versionsBehind > 0;

    // Check if the latest release has assets ready for this platform
    const assetsReady = allReleases.length > 0 && hasAssetsForPlatform(allReleases[0]);

    return {
      currentVersion,
      latestVersion,
      updateAvailable,
      versionsBehind,
      releases: newerReleases,
      releasesUrl,
      assetsReady,
    };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return {
      currentVersion,
      latestVersion: currentVersion,
      updateAvailable: false,
      versionsBehind: 0,
      releases: [],
      releasesUrl,
      assetsReady: false,
      error: errorMessage,
    };
  }
}
