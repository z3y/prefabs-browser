"use client"

interface TestProps {
    heading: string;
    items: string[];
}

import { useState } from "react";

function Test({items, heading}: TestProps) {

    const [state, setState] = useState(-1);

    return (
        <div className="p-2 flex">
            <div className="border border-neutral-800 rounded-xl p-4">
                <h1 className="text-xl border-b flex justify-center">{heading}</h1>

                {items.map((item, index) => (
                    <p className="flex justify-center" onClick={() => setState(index)} key={index}>Hello {item}</p>
                ))}
            </div>
        </div>
    );
}

export default Test;