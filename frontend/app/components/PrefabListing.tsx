"use client"

import Prefab from "./Prefab";


function PrefabListing(prefab: Prefab) {

    const desc = prefab.description == null ? "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin at consequat ante. Vestibulum venenatis eros eu quam sollicitudin, nec feugiat est iaculis. Integer mollis in diam ut hendrerit" : prefab.description;
    const imageScr = prefab.image == null ? "/missing-thumbnail.png" : prefab.image;

    return (
        <div className="flex-col flex relative w-64 border-2 border-zinc-700 hover:border-zinc-400 rounded-xl p-3 bg-zinc-900 hover:bg-zinc-950 transition duration-100">
            <div className="relative h-28">
                <p className="font-semibold text-xl text-center">{prefab.name}</p>
                <p className="pt-2 text-sm line-clamp-3 text-zinc-300">{desc}</p>
            </div>
            <div className="relative rounded-md bg-zinc-800 flex-grow content-center min-h-56">

                <img src={imageScr} alt="Thumbnail" className='object-contain rounded-md' />
                <div className="pointer-events-none absolute bottom-2 right-2 backdrop-blur-sm bg-zinc-950 bg-opacity-50 text-zinc-200 text-sm p-1 rounded border border-zinc-600 border-opacity-50">
                    <p className="pl-1 pr-1">{prefab.creator}</p>
                </div>
            </div>
        </div>
    );
}

export default PrefabListing;
