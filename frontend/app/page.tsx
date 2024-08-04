"use client"

import PrefabData, { PrefabSearchResult } from "@/components/Prefab"
import PrefabListingFull from "@/components/PrefabListingFull"
import { useSearchParams } from "next/navigation"
import { useEffect, useState } from "react"
import InfiniteScroll from "react-infinite-scroll-component"

export default function Home() {
  const searchParams = useSearchParams()

  const [prefabs, setPrefabs] = useState<PrefabData[]>([])
  const [page, setPage] = useState(0)
  const [totalPages, setTotalPages] = useState(1)
  const [hasMore, setHasMore] = useState(true)

  const fetchData = (append: boolean, page: number) => {
    if (page > totalPages) {
      setHasMore(false)
      return
    }

    const url = `http://localhost:3001/search?name=${searchParams.get(
      "name"
    )}&category=${searchParams.get("category")}&sort=${searchParams.get(
      "sort"
    )}&page=${page}`

    console.log(url)

    fetch(url)
      .then((res) => res.json())
      .then((data: PrefabSearchResult) => {
        setTotalPages(data.pages)

        if (append) {
          setPrefabs((prev) => [...prev, ...data.results])
        } else {
          setPrefabs(data.results)
        }
        setPage(page + 1)
      })
  }

  useEffect(() => {
    setPage(0)
    setHasMore(true)
    fetchData(false, 0)
  }, [searchParams])

  return (
    <main className="bg-zinc-950 h-full overflow-auto">
      <div className="flex flex-row max-w-[1300px] mx-auto">
        <div className="grow flex flex-col">
          <InfiniteScroll
            dataLength={prefabs.length}
            next={() => fetchData(true, page)}
            hasMore={hasMore}
            loader={<></>}
            scrollThreshold={1}
          >
            {prefabs &&
              prefabs.map((x) => <PrefabListingFull {...x} key={x.id} />)}
          </InfiniteScroll>
        </div>
      </div>
    </main>
  )
}
