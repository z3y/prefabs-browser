const repo = "prefabs-browser"

export default function customLoader({
  src,
  width,
  quality,
}: {
  src: string
  width: number
  quality?: number
}) {
  if (src.startsWith("http")) {
    return src
  }
  return `/${repo}/${src}`
}
