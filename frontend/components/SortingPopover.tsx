import { Popover, PopoverButton, PopoverPanel } from "@headlessui/react"
import React, { useState } from "react"
import Image from "next/image"
import { useRouter, useSearchParams } from "next/navigation"

const SortingPopover = () => {
  const router = useRouter()

  const handleSorting = (sorting: string) => {
    const searchParams = new URLSearchParams(window.location.search)
    searchParams.set("sorting", sorting)
    const newPath = `${window.location.pathname}?${searchParams.toString()}`
    router.push(newPath)
  }

  const buttons = ["popularity", "new", "old"]

  return (
    <div>
      <Popover className="relative">
        <PopoverButton
          type="button"
          className=" hover:bg-zinc-800 outline-none p-2 rounded-xl items-center flex justify-center transition-colors duration-150"
        >
          <Image
            src="/ArrowUpDown.svg"
            width={16}
            height={16}
            className="opacity-80"
            alt={"sort"}
          />
        </PopoverButton>
        <PopoverPanel
          anchor="bottom"
          className="flex flex-col bg-zinc-900 bg-opacity-80 backdrop-blur-md mt-4 p-2 rounded-xl z-20 border border-zinc-800"
        >
          {buttons.map((x, index) => (
            <button
              key={index}
              className="hover:bg-zinc-800 p-2 rounded-md capitalize"
              onClick={() => handleSorting(x)}
            >
              {x}
            </button>
          ))}
        </PopoverPanel>
      </Popover>
    </div>
  )
}

export default SortingPopover
