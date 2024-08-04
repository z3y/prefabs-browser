import { useRouter } from "next/navigation"
import PrefabData from "./Prefab"

interface TagDescription {
  name: string
  link: string
}

function Tag(desc: TagDescription) {
  const router = useRouter()

  return (
    <div className="w-fit">
      <button
        onClick={() => router.push(`/?category=${desc.name}`)}
        className=" bg-zinc-950 capitalize hover:bg-blue-600 transition duration-100 bg-opacity-50 text-zinc-200 text-sm p-1 rounded border border-zinc-600 border-opacity-50"
      >
        <p className="pl-1 pr-1">{desc.name}</p>
      </button>
    </div>
  )
}

function PrefabListingFull(prefab: PrefabData) {
  const imageScr =
    prefab.thumbnail == null ? "/missing-thumbnail.png" : prefab.thumbnail

  const now = Date.now()
  const date = Date.parse(prefab.added)
  const delta = (now - date) / 1000
  let dateDisplay = prefab.added.split("T")[0]
  if (delta < 60 * 60 * 24) {
    dateDisplay = "Today"
  } else if (delta < 60 * 60 * 24 * 2) {
    dateDisplay = "Yesterday"
  }

  let linkIcon = ""
  if (prefab.link.includes("github.com/")) {
    linkIcon = "/github.png"
  } else if (prefab.link.includes("github.io/")) {
    linkIcon = "/github.png"
  } else if (prefab.link.includes("booth.pm/")) {
    linkIcon = "/booth.png"
  } else if (prefab.link.includes("gitlab.com/")) {
    linkIcon = "/gitlab.webp"
  } else if (prefab.link.includes("drive.google.com/")) {
    linkIcon = "/drive.svg"
  } else if (prefab.link.includes("gumroad.com/")) {
    linkIcon = "/gumroad.svg"
  } else if (prefab.link.includes("gum.co/")) {
    linkIcon = "/gumroad.svg"
  } else {
    linkIcon = "/globe.svg"
  }

  const router = useRouter()

  return (
    <div
      id={prefab.id}
      className="bg-zinc-950 hover:bg-zinc-900 flex-row flex border-b border-x border-zinc-800"
    >
      <div className="p-4 relative min-w-64 min-h-64 max-w-64 max-h-64">
        <div className="bg-zinc-800 rounded-md">
          <img
            src={imageScr}
            alt="Thumbnail"
            className="object-contain rounded-md"
          />

          <button
            onClick={() =>
              router.push(`${window.location.pathname}?name=${prefab.creator}`)
            }
            className="absolute bottom-6 right-6 backdrop-blur-sm bg-zinc-950 bg-opacity-50 text-zinc-200 text-sm p-1 rounded  border-zinc-600 border-opacity-50"
          >
            <p className="pl-1 pr-1">{prefab.creator}</p>
          </button>
        </div>
      </div>

      <div className="grow flex flex-col">
        <div className="relative flex-row flex p-4 pl-2 gap-3">
          {linkIcon && (
            <img
              src={linkIcon}
              alt="Icon"
              className="h-6 rounded-md self-center"
            />
          )}
          <div className="flex">
            <p className="font-semibold text-2xl text-center">{prefab.name}</p>
          </div>

          <div className="absolute flex-row flex gap-1 right-4">
            <Tag name={prefab.category} link={"test"} />
          </div>
        </div>

        <div className="relative grow">
          <p className="pl-2 pr-4 pt-0 text-sm text-zinc-300 text-balance">
            {prefab.description}
          </p>
        </div>

        <div className="flex flex-row-reverse m-4 gap-2 justify-between">
          <div className="font-semibold">
            <a
              href={prefab.link}
              target="_blank"
              rel="noopener noreferrer"
              className="w-16"
            >
              <button className=" bg-zinc-950 hover:bg-blue-600 transition duration-100 bg-opacity-50 text-zinc-200 text-sm p-2 rounded border border-zinc-600 border-opacity-50">
                <p className="pl-1 pr-1">Link &#x1F517;</p>
              </button>
            </a>
          </div>

          <div className=" -ml-2 self-center">
            <p className="text-xs text-zinc-300">{dateDisplay}</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PrefabListingFull
