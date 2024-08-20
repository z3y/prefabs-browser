import { useState } from "react"
import PrefabData from "./Prefab"
import PrefabListingFull from "./PrefabListingFull"

const CreatePrefab = () => {
  const [name, setName] = useState("")
  const [link, setLink] = useState("")
  const [description, setDescription] = useState("")
  const [category, setCategory] = useState("")

  const handleSubmit = () => {
    console.log("creating" + name + link + description + category)
  }

  const prefab: PrefabData = {
    id: "test",
    name: name,
    creator: "You",
    category: category,
    timestamp: "Today",
    link: link,
    description: description,
  }

  return (
    <div className="flex flex-col p-4 max-w-[1300px] mx-auto">
      <div className="flex flex-col p-2 ">
        <p>Name</p>
        <input
          className="enabled:bg-opacity-0 enabled:bg-black h-10"
          type="text"
          name="name"
          onChange={(e) => setName(e.target.value)}
        />
      </div>
      <div className="flex flex-col p-2 ">
        <p>Link</p>
        <input
          className="enabled:bg-opacity-0 enabled:bg-black h-10"
          type="text"
          name="link"
          onChange={(e) => setLink(e.target.value)}
        />
      </div>
      <div className="flex flex-col p-2">
        <p>Category</p>
        <input
          className="enabled:bg-opacity-0 enabled:bg-black h-10"
          type="text"
          name="category"
          onChange={(e) => setCategory(e.target.value)}
        />
      </div>
      <div className="flex flex-col p-2">
        <p>Description</p>
        <input
          className="enabled:bg-opacity-0 enabled:bg-black h-24 text-wrap"
          type="text"
          name="description"
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>
      <p>Thumbnail</p>

      <div className="border-t  border-zinc-800">
        <PrefabListingFull {...prefab} />
      </div>

      <div className="h-16"></div>

      <button
        onClick={handleSubmit}
        className="font-semibold hover:bg-zinc-900 border-zinc-800 border h-16 w-32 self-center"
      >
        <p>Submit</p>
      </button>
    </div>
  )
}

export default CreatePrefab
