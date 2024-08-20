"use client"

import PrefabData from "@/components/Prefab"
import PrefabListingFull from "@/components/PrefabListingFull"
import { useSearchParams } from "next/navigation"
import { useEffect, useState } from "react"

export default function Home() {
  const searchParams = useSearchParams()
  const [prefabs, setPrefabs] = useState<PrefabData[]>([])

  const fetchData = () => {
    let name = searchParams.get("name")?.toLocaleLowerCase()
    let category = searchParams.get("category") ?? "udon"
    let sort = searchParams.get("sort")

    fetch(`output/${category}.json`)
      .then((res) => res.json())
      .then((data: PrefabData[]) => {
        if (name != undefined) {
          data = data.filter(
            (x) =>
              x.name.toLocaleLowerCase().includes(name) ||
              x.description?.toLocaleLowerCase().includes(name) ||
              x.creator.toLocaleLowerCase().includes(name)
          )
        }
        if (sort != undefined) {
          if (sort === "old") {
            data = data.reverse()
          }
        }
        setPrefabs(data)
        console.log("fetched")
      })
  }

  useEffect(() => {
    fetchData()
  }, [searchParams])

  return (
    <main className="bg-zinc-950 h-full overflow-auto">
      <div className="flex flex-row max-w-[1300px] mx-auto">
        <div className="grow flex flex-col">
          {prefabs &&
            prefabs.map((x) => <PrefabListingFull {...x} key={x.id} />)}
        </div>
      </div>
    </main>
  )
}
