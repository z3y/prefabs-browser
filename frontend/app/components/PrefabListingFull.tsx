"use client"

import Prefab from "./Prefab";

interface TagDescription {
    name: string;
    link: string;
}

function Tag(desc: TagDescription) {

    return (
    <div className="font-semibold w-fit">
        <a href={desc.link} className="">
            <div className=" bg-zinc-950 hover:bg-slate-600 transition duration-100 bg-opacity-50 text-gray-200 text-sm p-1 rounded border border-zinc-600 border-opacity-50">
                <p className="pl-1 pr-1">{desc.name}</p>
            </div>
        </a>
    </div>
    )
}

function PrefabListingFull(prefab: Prefab) {

    const desc = prefab.description == null ? "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin at consequat ante. Vestibulum venenatis eros eu quam sollicitudin, nec feugiat est iaculis. Integer mollis in diam ut hendrerit" : prefab.description;
    const imageScr = prefab.image == null ? "/missing-thumbnail.png" : prefab.image;

    return (
        <div className="bg-zinc-900 flex-row flex border-2 border-zinc-700 rounded-xl">

            <div className="p-4 relative min-w-72 min-h-72">
                <div className="bg-zinc-800 rounded-md">

                    <img src={imageScr} alt="Thumbnail" className='object-contain rounded-md' />

                    <div className="absolute bottom-6 right-6 backdrop-blur-sm bg-zinc-950 bg-opacity-50 text-zinc-200 text-sm p-1 rounded border border-zinc-600 border-opacity-50">
                        <p className="pl-1 pr-1">{prefab.creator}</p>
                    </div>

                </div>

            </div>
            
            <div className="grow flex flex-col">

                <div className="relative flex-row flex p-4 pl-2">

                    <div className="">
                        <p className="font-semibold text-2xl text-center">{prefab.name}</p>
                    </div>

                    <div className="absolute flex-row flex gap-1 right-4">
                        <Tag name={"Tag"} link={"test"} />
                        <Tag name={"Shader"} link={"test"} />
                    </div>

        
                </div>
                
                <div className="relative grow">
                    
                    <p className="p-2 pt-0 text-sm text-zinc-300">{desc}</p>

                    <div className="p-2 font-semibold absolute bottom-2 right-2">
                        <a href={prefab.link} target="_blank" rel="noopener noreferrer" className="">
                            <div className=" bg-zinc-950 hover:bg-slate-600 transition duration-100 bg-opacity-50 text-gray-200 text-sm p-2 rounded border border-zinc-600 border-opacity-50">
                                <p className="pl-1 pr-1">Download</p>
                            </div>
                        </a>
                    </div>

                </div>

            </div>

        </div>
    );
}

export default PrefabListingFull;
