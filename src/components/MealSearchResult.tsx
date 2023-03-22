/* eslint-disable @typescript-eslint/restrict-plus-operands */
/* eslint-disable @typescript-eslint/no-misused-promises */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @next/next/no-img-element */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */

import router from "next/router";

const MealSearchResult = ({id, title, image, restaurantChain }: any) => {
  return (
    <>
        <article key={id} className="rounded-xl border border-gray-700 bg-purple-800 p-4 m-4 hover:scale-105 ease-in-out transition">
            <button className="flex items-center gap-4" onClick={() => router.push("/dish/" + id)}>
                <img
                alt="No Image"
                src={image.toString()}
                className="h-24 w-24 rounded-full object-cover"
                />
                <div>
                <h3 className="text-lg font-medium text-white">{title}</h3>

                <div className="flow-root">
                    <ul className="-m-1 flex flex-wrap">
                        <li className="p-1 leading-none">
                            <p className="text-xs font-medium text-gray-300">{restaurantChain}</p>
                        </li>
                    </ul>
                </div>
                </div>
            </button>
        </article>
    </>
  );
};

export default MealSearchResult;
