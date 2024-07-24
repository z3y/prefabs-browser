import { Popover, PopoverButton, PopoverPanel } from "@headlessui/react"
import { useRouter, useSearchParams } from "next/navigation"
import React, { useEffect, useState } from "react"

const CategorySelection = () => {
  const searchParams = useSearchParams()

  const router = useRouter()

  const categories = [
    { name: "udon", color: "bg-purple-600" },
    { name: "shaders", color: "bg-pink-600" },
    { name: "avatar", color: "bg-emerald-600" },
    { name: "editor", color: "bg-orange-600" },
    { name: "prefabs", color: "bg-blue-600" },
  ]

  const [category, setCategory] = useState(0)

  const previousCategory = searchParams.get("category")
  useEffect(() => {
    const previousIndex = categories.findIndex(
      (x) => x.name == previousCategory
    )
    setCategory(previousIndex < 0 ? 0 : previousIndex)
  }, [previousCategory])

  const handleCategory = (category: string) => {
    const searchParams = new URLSearchParams(window.location.search)
    searchParams.set("category", category)
    const newPath = `${window.location.pathname}?${searchParams.toString()}`
    router.push(newPath)
  }

  return (
    <div
      className={`${categories[category].color} bg- outline-none py-1.5 px-3 rounded-xl items-center flex justify-center transition-colors duration-300 w-24`}
    >
      <Popover className="relative">
        <PopoverButton>
          <p className="font-bold capitalize">{categories[category].name}</p>
        </PopoverButton>
        <PopoverPanel
          anchor="bottom"
          className="flex flex-col bg-zinc-900 bg-opacity-80 backdrop-blur-md mt-5 p-2 rounded-xl z-20 border border-zinc-800"
        >
          {categories.map((x, index) => (
            <button
              key={index}
              className="hover:bg-zinc-800 p-2 rounded-md capitalize"
              onClick={() => handleCategory(x.name)}
            >
              {x.name}
            </button>
          ))}
        </PopoverPanel>
      </Popover>
    </div>
  )
}

export default CategorySelection
