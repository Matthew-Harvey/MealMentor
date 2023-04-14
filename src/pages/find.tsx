/* eslint-disable @typescript-eslint/no-misused-promises */
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
import { useState } from "react";
import { demodetails } from "~/functions/demo";
import Navbar from "~/components/Navbar";
import MealSearchResult from "~/components/MealSearchResult";
import { getSession } from "@auth0/nextjs-auth0";
import { getSearchResults } from "~/functions/getalldish";

export async function getServerSideProps(context : GetServerSidePropsContext) {
  const isdemo = context.query.demo;
  
  let user = await getSession(context.req, context.res);
  let loggedin = false;
  if (user?.user){
      loggedin = true;
  }
  if (isdemo == "true") {
      loggedin = true;
      // @ts-ignore
      user = {};user.user = demodetails;
  }
  
  const items = await getSearchResults();

  if (isdemo == "true" && loggedin == true) {
    return {
      props: { params: {isdemo: true, details: demodetails, loggedin, user:user?.user, items}}
    }
  } if (loggedin == true) {
    return {
      props: { params: {isdemo: false, details: demodetails, loggedin, user:user?.user, items}}
    }
  } else {
    return {
      redirect: {
          permanent: false,
          destination: "/",
      }
  }
  }
}

const Find = ({ params }: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  //const queryGPT = api.example.mutateGPT.useMutation();
  const authInsert = api.db.InsertUser.useMutation();
  const api_test = api.example.getApiResults.useMutation();

  //const resetdb = api.db.reset_tables.useQuery();

  const [inputval, setInputVal] = useState("");
  const [typeSearch, settypeSearch] = useState("recipes")
  const [hasEnter, setHasEnter] = useState(false);
  const [queryCount, setQuerycount] = useState(1);
  
  async function QueryFind  () {
    authInsert.mutate({ user: JSON.parse(JSON.stringify(params.user)) });
    api_test.mutate({ text: inputval, type: typeSearch});
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

  let isdemo = "";
  try {
        if (params.user?.sub == "google-oauth2|143087949221293105235") {
        isdemo = "?demo=true"
        }
  } catch {}

  let titletext = "Recipe"
  if (typeSearch == "menuitem") {
    titletext = "Dish"
  }

  return (
    <>
      <main className="flex min-h-screen flex-col bg-gradient-to-tr from-[#313131] to-[#000000]">
        <Navbar loggedin={params.loggedin} authuser={params.user} items={JSON.parse(params.items)} />
        <div className="container items-center gap-10 px-4 py-10 justify-center max-w-6xl mx-auto grid grid-cols-1">
          <h1 className="text-5xl lg:text-8xl font-extrabold tracking-tight text-white sm:text-[5rem] text-center m-auto">
            <span className="text-[#DB6310]">Find</span> a {titletext}
          </h1>
          {params.loggedin ? 
            <>
                {hasEnter == false && <p className="text-2xl text-white text-center">Please enter a search query and select type of result.</p>}
                <div className="m-auto w-1/2">
                  <input value={inputval} onChange={(e) => setInputVal(e.target.value)} placeholder="eg. Burger" className="p-2 rounded-l-lg text-black text-lg w-5/6" type="search" onKeyDown={handleKeyDown} disabled={api_test.isLoading || queryCount > 5}></input>
                  <button className="bg-[#DB6310] p-2 rounded-r-lg w-1/6 text-lg text-black" onClick={QueryFind}>Go!</button>
                </div>
                <select id="type" value={typeSearch} onChange={(e) => {settypeSearch(e.target.value)}} className="w-1/2 m-auto bg-gray-50 border border-gray-300 text-gray-900 text-lg rounded-lg focus:ring-black focus:border-black block p-2 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white">
                    <option value="menuitem">Menu Items - WIP</option>
                    <option value="recipes">Recipes</option>
                </select>
                <div className="text-2xl text-white text-center">
                  <>
                    {api_test.isLoading == true && "Loading response..."}
                    <div className="grid grid-cols-2 md:max-w-4xl px-2 gap-0 m-auto">
                      {api_test.data ? 
                        display_result.map((meal: any) => 
                            <>
                                <MealSearchResult title={meal.title} id={meal.id} image={meal.image} restaurantChain={meal.restaurantChain} isdemo={isdemo} type={typeSearch} />
                            </>
                          )
                      : ""}
                    </div>
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
    </>
  );
};

export default Find;
