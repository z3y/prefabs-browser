"use client"

import Image from "next/image";

interface Prefab {
    name: string;
    creator: string;
    description?: string;
    date: string;
    image: string;
}

function PrefabListing(prefab: Prefab) {

    return (
        <div className="relative w-72 border border-zinc-700 hover:border-gray-400 rounded-xl p-4 hover:bg-zinc-800 transition duration-100">
            <div className="relative h-28">
                <p className="font-semibold text-xl text-center">{prefab.name}</p>
                {prefab.description && <p className="pt-2 text-sm line-clamp-3 text-zinc-300">{prefab.description}</p>}
            </div>
            <div className="relative rounded-md bg-zinc-800 h-64 content-center">

                <img src={prefab.image} alt="Thumbnail" className='object-contain rounded-md' />
                <div className="pointer-events-none absolute bottom-2 right-2 bg-zinc-600 bg-opacity-50 text-slate-100 text-sm p-1 rounded">
                    <p className="pl-1 pr-1">{prefab.creator}</p>
                </div>
            </div>
        </div>
    );
}

export default PrefabListing;
