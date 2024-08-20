/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export",
  images: {
    unoptimized: true,
  },
}

// https://www.viget.com/articles/host-build-and-deploy-next-js-projects-on-github-pages/
const isGithubActions = process.env.GITHUB_ACTIONS || false
if (isGithubActions) {
  const repo = process.env.GITHUB_REPOSITORY.replace(/.*?\//, "")

  nextConfig.assetPrefix = `/${repo}`
  nextConfig.basePath = `/${repo}`
}

export default nextConfig
