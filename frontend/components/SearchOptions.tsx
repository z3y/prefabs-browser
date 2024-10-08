"use client"

import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { useEffect, useState } from "react"
import Image from "next/image"
import SortingPopover from "./SortingPopover"

const SearchOptions = () => {
  const searchParams = useSearchParams()

  const [searchText, setSearchText] = useState("")

  const router = useRouter()

  const previousName = searchParams.get("name")

  useEffect(() => {
    const previousName = searchParams.get("name")
    setSearchText(previousName || "")
    // console.log("setting " + previousName)
  }, [previousName])

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    const searchParams = new URLSearchParams(window.location.search)
    searchText && searchParams.set("name", searchText)

    const newPath = `/?${searchParams.toString()}`

    router.push(newPath)
  }

  return (
    <form
      className="flex flex-row grow gap-4 items-center"
      autoComplete="off"
      onSubmit={handleSearch}
    >
      <div className="grow flex flex-row rounded-xl bg-zinc-900  hover:bg-blue-600 border-opacity-0 hover:border-opacity-100 border  transition-colors duration-150 border-zinc-700 items-center">
        <button type="submit">
          <Image
            src="/Magnifier2.svg"
            width={18}
            height={18}
            className="text-zinc-200 ml-3 opacity-80"
            alt={"search"}
          />
        </button>

        <input
          className="grow enabled:bg-slate-700 enabled:bg-opacity-0 fill-none py-1.5 px-3 text-zinc-200 placeholder:text-zinc-400 outline-none text-center text-sm"
          type="text"
          id="search"
          name="prefab"
          placeholder="Search Prefabs"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
        />
        <button
          type="reset"
          onClick={() => {
            const searchParams = new URLSearchParams(window.location.search)
            searchParams.set("name", "")
            setSearchText("")
            router.push("/?" + searchParams.toString())
          }}
        >
          <Image
            src="/X.svg"
            width={18}
            height={18}
            className={`text-zinc-200 mr-3 ${
              searchText === "" ? "opacity-0" : "opacity-80"
            }`}
            alt={"x"}
          />
        </button>
      </div>

      <SortingPopover />
    </form>
  )
}

export default SearchOptions
