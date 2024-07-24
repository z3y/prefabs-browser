"use client"

import PrefabData, { prefabTestData } from "@/components/Prefab"
import PrefabListingFull from "@/components/PrefabListingFull"
import { useSearchParams } from "next/navigation"
import { useEffect } from "react"

export default function Home() {
  const searchParams = useSearchParams()

  useEffect(() => {
    console.log(searchParams.toString())
  }, [searchParams.get("name")])

  return (
    <main className="bg-zinc-950 h-full overflow-auto">
      <div
        id="list-content"
        className="h-full flex flex-row max-w-[1300px] mx-auto"
      >
        <div
          id="prefabs-list"
          className="grow flex flex-col border-r border-l border-zinc-800"
        >
          {prefabTestData.map((x, index) => (
            <PrefabListingFull {...x} key={index} />
          ))}
        </div>
      </div>
    </main>
  )
}
