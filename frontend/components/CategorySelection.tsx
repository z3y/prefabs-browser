import { Popover, PopoverButton, PopoverPanel } from "@headlessui/react"
import { useRouter, useSearchParams } from "next/navigation"
import React, { useEffect, useState } from "react"

const CategorySelection = () => {
  const searchParams = useSearchParams()

  const router = useRouter()
  const [category, setCategory] = useState("udon")

  const previousCategory = searchParams.get("category")
  useEffect(() => {
    setCategory(previousCategory || "udon")
  }, [previousCategory])

  const handleCategory = (category: string) => {
    const searchParams = new URLSearchParams(window.location.search)
    searchParams.set("category", category)
    const newPath = `${window.location.pathname}?${searchParams.toString()}`
    router.push(newPath)
  }

  const buttons = ["udon", "shaders", "avatar", "editor scripts", "prefabs"]

  return (
    <div className="hover:bg-blue-700 bg-blue-600 outline-none py-1.5 px-3 rounded-xl items-center flex justify-center transition-colors duration-150">
      <Popover className="relative">
        <PopoverButton>
          <p className="font-bold capitalize">{category}</p>
        </PopoverButton>
        <PopoverPanel
          anchor="bottom"
          className="flex flex-col bg-zinc-900 bg-opacity-80 backdrop-blur-md mt-5 p-2 rounded-xl z-20 border border-zinc-800"
        >
          {buttons.map((x, index) => (
            <button
              className="hover:bg-zinc-800 p-2 rounded-md capitalize"
              onClick={() => handleCategory(x)}
            >
              {x}
            </button>
          ))}
        </PopoverPanel>
      </Popover>
    </div>
  )
}

export default CategorySelection
