interface PrefabData {
  id: string
  name: string
  creator: string
  category: string
  description?: string
  added: string
  thumbnail?: string
  link: string
}

// export async function fetchPrefabs(search: URLSearchParams) {
//   // const headers = {
//   // }

//   const response = await fetch(
//     `http://localhost:3000/search?name=${search.get("name")}&category=${search.get("category")}`,
//     // { headers: headers }
//   )

//   const result = await response.json()
//   return result
// }

export default PrefabData

// export const prefabTestData: PrefabData[] = [
//   {
//     name: "Poiyomi Shaders",
//     creator: "Poiyomi",
//     date: "12/11/2024",
//     link: "https://github.com/poiyomi/PoiyomiToonShader",
//   },
//   {
//     name: "VRCMarker",
//     creator: "z3y",
//     date: "12/11/2024",
//     link: "https://github.com/poiyomi/PoiyomiToonShader",
//     image: "/thumbnail.webp",
//   },
//   {
//     name: "VRCMarker",
//     creator: "z3y",
//     date: "12/11/2024",
//     link: "https://github.com/poiyomi/PoiyomiToonShader",
//     image: "/thumbnail.webp",
//   },
//   {
//     name: "VRCMarker",
//     creator: "z3y",
//     date: "12/11/2024",
//     link: "https://github.com/poiyomi/PoiyomiToonShader",
//     image: "/thumbnail.webp",
//   },
//   {
//     name: "Poiyomi Shaders",
//     creator: "Poiyomi",
//     date: "12/11/2024",
//     link: "https://github.com/poiyomi/PoiyomiToonShader",
//   },
//   {
//     name: "Poiyomi Shaders",
//     creator: "Poiyomi",
//     date: "12/11/2024",
//     link: "https://github.com/poiyomi/PoiyomiToonShader",
//   },
//   {
//     name: "Poiyomi Shaders",
//     creator: "Poiyomi",
//     date: "12/11/2024",
//     link: "https://github.com/poiyomi/PoiyomiToonShader",
//   },
//   {
//     name: "Poiyomi Shaders",
//     creator: "Poiyomi",
//     date: "12/11/2024",
//     link: "https://github.com/poiyomi/PoiyomiToonShader",
//   },
//   {
//     name: "Poiyomi Shaders",
//     creator: "Poiyomi",
//     date: "12/11/2024",
//     link: "https://github.com/poiyomi/PoiyomiToonShader",
//   },
//   {
//     name: "Poiyomi Shaders",
//     creator: "Poiyomi",
//     date: "12/11/2024",
//     link: "https://github.com/poiyomi/PoiyomiToonShader",
//   },
//   {
//     name: "Poiyomi Shaders",
//     creator: "Poiyomi",
//     date: "12/11/2024",
//     link: "https://github.com/poiyomi/PoiyomiToonShader",
//   },
//   {
//     name: "Poiyomi Shaders",
//     creator: "Poiyomi",
//     date: "12/11/2024",
//     link: "https://github.com/poiyomi/PoiyomiToonShader",
//   },
// ]
