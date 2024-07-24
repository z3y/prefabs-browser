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
    console.log("setting " + previousName)
  }, [previousName])

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    const searchParams = new URLSearchParams(window.location.search)
    searchText && searchParams.set("name", searchText)

    const newPath = `${window.location.pathname}?${searchParams.toString()}`

    router.push(newPath)
  }

  return (
    <form
      className="flex flex-row gap-4 items-center"
      autoComplete="off"
      onSubmit={handleSearch}
    >
      <div className="lg:w-80 flex flex-row rounded-xl bg-zinc-900  hover:bg-blue-600 border-opacity-0 hover:border-opacity-100 border  transition-colors duration-150 border-zinc-700 items-center">
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
        <button type="reset" onClick={() => setSearchText("")}>
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

      {/* <div className="flex flex-row items-center gap-4 pt-4">
          <p className="text-zinc-200 text-sm w-12">Sorting</p>

          <Select
            name="sorting"
            aria-label="Popularity"
            className="bg-zinc-950  border border-zinc-800 rounded-md p-2 focus:outline-none w-56"
          >
            <option value="popularity">Popularity</option>
            <option value="new">New</option>
            <option value="old">Old</option>
          </Select>
        </div> */}

      {/* <div className="flex flex-row items-center gap-4">
          <p className="text-zinc-200 text-sm w-12">Type</p>
          <Select
            name="type"
            aria-label="Any"
            className="bg-zinc-950 border border-zinc-800 rounded-md p-2 focus:outline-none w-56"
          >
            <option value="any">Any</option>
            <option value="udon">Udon</option>
            <option value="avatar">Avatar</option>
            <option value="tool">Tool</option>
            <option value="general">General Assets</option>
          </Select>
        </div> */}

      {/* <div className="flex flex-row items-center gap-4">
          <p className="text-zinc-200 text-sm w-12">Creator</p>
          <input
            className="bg-zinc-950 border border-zinc-800 rounded-md p-2 focus:outline-none w-56"
            type="text"
            id="creator"
            name="creator"
            placeholder=""
          ></input>
        </div> */}
    </form>
  )
}

export default SearchOptions
