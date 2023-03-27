/* eslint-disable @typescript-eslint/restrict-plus-operands */
/* eslint-disable @typescript-eslint/no-misused-promises */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @next/next/no-img-element */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */

import router from "next/router";

const MealSearchResult = ({id, title, image, restaurantChain, isdemo }: any) => {
  return (
    <>
        <article key={id} className="rounded-xl m-auto w-96 cursor-pointer shadow bg-[#313131] p-2 my-4 hover:scale-105 ease-in-out transition" onClick={() => router.push("/dish/" + id + isdemo)}>
            <div className="flex items-center gap-2 text-left">
                <img
                    alt="No Image"
                    src={image.toString()}
                    className="h-32 w-32 rounded-full object-cover"
                />
                <div>
                <h3 className="text-2xl font-medium text-white">{title}</h3>

                <div className="flow-root">
                    <ul className="-m-1 flex flex-wrap">
                        <li className="p-1 leading-none">
                            <p className="text-lg font-medium text-gray-300 italic">From {restaurantChain}</p>
                        </li>
                    </ul>
                </div>
                </div>
            </div>
        </article>
    </>
  );
};

export default MealSearchResult;
