import type { NextConfig } from 'next';

const isGithubPages = process.env.GITHUB_PAGES === 'true';
const repoName = process.env.GITHUB_REPOSITORY ? process.env.GITHUB_REPOSITORY.split('/')[1] : '';
const isUserPage = repoName.endsWith('.github.io');

let basePath = '';
if (isGithubPages) {
  if (process.env.BASE_PATH !== undefined && process.env.BASE_PATH !== '') {
    basePath = process.env.BASE_PATH;
  } else if (repoName && !isUserPage) {
    basePath = `/${repoName}`;
  }
}

const nextConfig: NextConfig = {
  output: isGithubPages ? 'export' : undefined,
  basePath: basePath || undefined,
  assetPrefix: basePath ? `${basePath}/` : undefined,
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
