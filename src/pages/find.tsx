/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-floating-promises */
/* eslint-disable @typescript-eslint/require-await */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/restrict-plus-operands */
/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/no-for-in-array */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */

import { type GetServerSidePropsContext, type InferGetServerSidePropsType} from "next";
import { api } from "~/utils/api";
import { useUser } from '@auth0/nextjs-auth0/client';
import { useState } from "react";
import { demodetails } from "~/functions/demo";
import Navbar from "~/components/Navbar";
import MealSearchResult from "~/components/MealSearchResult";

export function getServerSideProps(context : GetServerSidePropsContext) {
  const isdemo = context.query.demo;
  if (isdemo == "true") {
    return {
      props: { params: {isdemo: true, details: demodetails}}
    }
  } else {
    return {
      props: { params: {isdemo: false, details: demodetails}}
    }
  }
}

const Find = ({ params }: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const queryGPT = api.example.mutateGPT.useMutation();
  const authInsert = api.db.InsertUser.useMutation();
  const api_test = api.example.getApiResults.useMutation();

  //const resetdb = api.db.reset_tables.useQuery();

  const [inputval, setInputVal] = useState("Pasta");
  const [hasEnter, setHasEnter] = useState(false);
  const [queryCount, setQuerycount] = useState(1);

  const auth = useUser();
  let loggedin = false;
  if (auth.user){
    loggedin = true;
  }
  if (params.isdemo == true) {
    loggedin = true;
    auth.user = params.details;
  }
  
  async function QueryFind  () {
    authInsert.mutate({ user: JSON.parse(JSON.stringify(auth.user)) });
    api_test.mutate({ text: inputval });
    setHasEnter(true);
    setQuerycount(queryCount);
  }

  const handleKeyDown = (e: any) => {
    if (e.code === "Enter") {
      QueryFind();
    }
  }

  let display_result;
  if (api_test.data?.mealjson) {
    display_result = JSON.parse(api_test.data?.mealjson);
  }

  return (
    <>
      <Navbar loggedin={loggedin} authuser={auth.user} />
      <div className="min-h-screen bg-gradient-to-b from-[#2e026d] to-[#15162c]">
        <main className="flex flex-col items-center justify-center">
            <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16 ">
                <h1 className="text-5xl font-extrabold tracking-tight text-white sm:text-[5rem]">
                    <span className="text-[hsl(280,100%,70%)]">Find</span> a dish
                </h1>
                {loggedin ? 
                    <>
                      <input value={inputval} onChange={(e) => setInputVal(e.target.value)} className="p-2 rounded-xl text-black text-md w-80" type="search" onKeyDown={handleKeyDown} disabled={api_test.isLoading || queryCount > 5}></input>
                      <div className="text-2xl text-white">
                        <>
                          {api_test.isLoading == true && "Loading response..."}
                          {hasEnter == false && "Please Type a question above"}
                          {api_test.data ? 
                            display_result.map((meal: any) => 
                                <>
                                    <MealSearchResult title={meal.title} id={meal.id} image={meal.image} restaurantChain={meal.restaurantChain} />
                                </>
                              )
                          : ""}
                        </>
                      </div>
                    </>
                    :
                    <>
                    <p className="text-2xl text-white">
                        Please log in to find a dish.
                    </p>
                    </>
                }
            </div>
        </main>
    </div>
    </>
  );
};

export default Find;
