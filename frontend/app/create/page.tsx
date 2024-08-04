"use client"

import { useState } from "react"

export default function Home() {
  const [name, setName] = useState("")
  const [link, setLink] = useState("")
  const [description, setDescription] = useState("")
  const [category, setCategory] = useState("")

  const handleSubmit = () => {
    console.log("creating" + name + link + description + category)
  }

  return (
    <div className="w-1/2 overflow-auto py-16 mx-auto flex flex-col gap-4">
      <div className="flex flex-col bg-zinc-800 p-2 rounded-xl">
        <p>Name</p>
        <input
          className="enabled:bg-opacity-0 enabled:bg-black h-10"
          type="text"
          name="name"
          onChange={(e) => setName(e.target.value)}
        />
      </div>
      <div className="flex flex-col bg-zinc-800 p-2 rounded-xl">
        <p>Link</p>
        <input
          className="enabled:bg-opacity-0 enabled:bg-black h-10"
          type="text"
          name="link"
          onChange={(e) => setLink(e.target.value)}
        />
      </div>
      <div className="flex flex-col bg-zinc-800 p-2 rounded-xl">
        <p>Category</p>
        <input
          className="enabled:bg-opacity-0 enabled:bg-black h-10"
          type="text"
          name="category"
          onChange={(e) => setCategory(e.target.value)}
        />
      </div>
      <div className="flex flex-col bg-zinc-800 p-2 rounded-xl">
        <p>Description</p>
        <input
          className="enabled:bg-opacity-0 enabled:bg-black h-24 text-wrap"
          type="text"
          name="description"
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>
      <p>Thumbnail</p>

      <button
        onClick={handleSubmit}
        className="bg-zinc-800 rounded-xl h-16 w-32 self-center"
      >
        <p>Submit</p>
      </button>
    </div>
  )
}
