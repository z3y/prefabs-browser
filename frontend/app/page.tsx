"use client"

import PrefabData, { prefabTestData } from "@/components/Prefab"
import PrefabListingFull from "@/components/PrefabListingFull"
import SearchOptions from "@/components/SearchOptions"
import { SetStateAction, useState } from "react"

function Main() {
  return (
    <div className="justify-center flex ">
      <div
        className={
          "pt-16 pb-16 grid gap-4 2xl:grid-cols-5 xl:grid-cols-4 lg:grid-cols-3 md:grid-cols-2"
        }
      >
        {prefabTestData.map((x) => (
          <PrefabListingFull {...x} />
        ))}
      </div>

      <div
        id="search bar"
        className="fixed bg-opacity-95 backdrop-blur-md bg-zinc-900 rounded-lg top-6 min-h-20 p-4 border-2 border-zinc-600 border-opacity-50 content-center"
      >
        <h1>Search</h1>
      </div>
    </div>
  )
}

export default function Home() {
  return (
    <main className="bg-zinc-950 h-full overflow-auto">
      <div
        id="list-content"
        className="h-full flex flex-row max-w-[1300px] mx-auto"
      >
        <div
          id="search-options"
          className="relative min-w-80 border-r border-l border-zinc-800 hidden lg:block"
        >
          <div className="fixed min-w-80 p-4">
            <SearchOptions />
          </div>
        </div>
        <div
          id="prefabs-list"
          className="grow flex flex-col border-r border-zinc-800"
        >
          {prefabTestData.map((x) => (
            <PrefabListingFull {...x} />
          ))}
        </div>
      </div>
    </main>
  )
}
