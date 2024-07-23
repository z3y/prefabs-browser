import {
  Input,
  Listbox,
  ListboxButton,
  ListboxOption,
  ListboxOptions,
  Select,
} from "@headlessui/react"
import React, { useState } from "react"

const SearchOptions = () => {
  return (
    <form className="flex flex-col gap-2 pt-1">
      <Input
        className="bg-zinc-800 bg-opacity-0 border border-zinc-800 rounded-md p-4 focus:outline-none"
        type="text"
        id="search"
        name="prefab"
        placeholder="Search"
      ></Input>

      <div className="flex flex-row items-center gap-4 pt-4">
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
      </div>

      <div className="flex flex-row items-center gap-4">
        <p className="text-zinc-200 text-sm w-12">Type</p>
        <Select
          name="type"
          aria-label="Any"
          className="bg-zinc-950 border border-zinc-800 rounded-md p-2 focus:outline-none w-56"
        >
          <option value="any">Any</option>
          <option value="udon">Udon</option>
          <option value="avatar">Avatar</option>
          <option value="tools">Tools</option>
          <option value="general">General Assets</option>
        </Select>
      </div>

      <div className="flex flex-row items-center gap-4">
        <p className="text-zinc-200 text-sm w-12">Creator</p>
        <Input
          className="bg-zinc-950 bg-opacity-0 border border-zinc-800 rounded-md p-2 focus:outline-none w-56"
          type="text2"
          id="search-creator"
          name="prefab-creator"
          placeholder=""
        ></Input>
      </div>
    </form>
  )
}

export default SearchOptions
