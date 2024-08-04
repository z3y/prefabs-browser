import PrefabData from "./Prefab"

interface TagDescription {
  name: string
  link: string
}

function Tag(desc: TagDescription) {
  return (
    <div className="w-fit">
      <a href={"?category=" + desc.name} className="">
        <button className=" bg-zinc-950 capitalize hover:bg-blue-600 transition duration-100 bg-opacity-50 text-zinc-200 text-sm p-1 rounded border border-zinc-600 border-opacity-50">
          <p className="pl-1 pr-1">{desc.name}</p>
        </button>
      </a>
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

  return (
    <div
      id={prefab.id}
      className="bg-zinc-950 hover:bg-zinc-900 flex-row flex border-b border-x border-zinc-800"
    >
      <div className="p-4 relative min-w-56 min-h-56 max-w-56 max-h-56">
        <div className="bg-zinc-800 rounded-md">
          <img
            src={imageScr}
            alt="Thumbnail"
            className="object-contain rounded-md"
          />

          <div className="absolute bottom-6 right-6 backdrop-blur-sm bg-zinc-950 bg-opacity-50 text-zinc-200 text-sm p-1 rounded  border-zinc-600 border-opacity-50">
            <p className="pl-1 pr-1">{prefab.creator}</p>
          </div>
        </div>
      </div>

      <div className="grow flex flex-col">
        <div className="relative flex-row flex p-4 pl-2">
          <div className="">
            <p className="font-semibold text-2xl text-center">{prefab.name}</p>
          </div>

          <div className="absolute flex-row flex gap-1 right-4">
            <Tag name={prefab.category} link={"test"} />
          </div>
        </div>

        <div className="relative grow">
          <p className="p-2 pt-0 text-sm text-zinc-300">{prefab.description}</p>
        </div>

        <div className="flex flex-row-reverse p-4 gap-2 relative">
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

          <div className="absolute left-2 bottom-6">
            <p className="text-xs text-zinc-300">{dateDisplay}</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PrefabListingFull
