"use client"

import PrefabData from "@/components/Prefab"
import PrefabListingFull from "@/components/PrefabListingFull"
import { useSearchParams } from "next/navigation"
import { useEffect, useState } from "react"

export default function Home() {
  const searchParams = useSearchParams()

  const [prefabs, setPrefabs] = useState<PrefabData[]>()

  useEffect(() => {
    const url = `http://localhost:3000/search?name=${searchParams.get("name")}&category=${searchParams.get("category")}&sorting=${searchParams.get("sorting")}`
    try {
      fetch(url)
      .then((res) => res.json())
      .then((data) => {
        setPrefabs(data)
      })
    }
    catch (e){
      console.log(e)
    }
    
  }, [searchParams])
  

  return (
    <main className="bg-zinc-950 h-full overflow-auto">
      <div
        id="list-content"
        className="h-full flex flex-row max-w-[1300px] mx-auto"
      >
        <div
          id="prefabs-list"
          className="grow flex flex-col border-r border-l border-zinc-800 min-h-screen"
        >
          {prefabs && prefabs.map((x) => (
            <PrefabListingFull {...x} key={x.id} />
          ))}
        </div>
      </div>
    </main>
  )
}
