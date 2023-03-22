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
        <div key={id} className="group cursor-pointer relative inline-block text-center">
            <button onClick={() => router.push("/dish/" + id)}>
                <img id={title.toString()} src={image.toString()} alt={title.toString()} className="rounded-3xl w-48 p-2 h-70" />
                <div className="absolute bottom-0 flex-col items-center hidden mb-6 group-hover:flex">
                    <span className="z-10 p-3 text-md leading-none rounded-lg text-white whitespace-no-wrap bg-gradient-to-r from-blue-700 to-red-700 shadow-lg">
                        {title} from {restaurantChain}
                    </span>
                </div>
            </button>
        </div>
    </>
  );
};

export default MealSearchResult;
