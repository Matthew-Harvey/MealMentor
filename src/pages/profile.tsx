/* eslint-disable react/jsx-no-undef */
/* eslint-disable @typescript-eslint/no-misused-promises */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
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
import { demodetails } from "~/functions/demo";
import Navbar from "~/components/Navbar";
import { connect } from "@planetscale/database";
import { config } from "~/server/api/routers/db_actions";
import { getSession } from "@auth0/nextjs-auth0";
import { getSearchResults } from "~/functions/getalldish";
import { useRouter } from "next/router";
import { useState } from "react";
import Image from "next/image";

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

  const conn = connect(config);
  const GetUpdated = await conn.execute("SELECT updated FROM users WHERE UserID = ?", [user?.user.sub]);
  // @ts-ignore
  const updated = GetUpdated.rows[0].updated.toString();
  const now_time = new Date().getTime();

  const RecentView = await conn.execute("SELECT * FROM user_recentview WHERE UserID = ?", [user?.user.sub]);
  const arr = [];
  for (const x in RecentView.rows) {
      // @ts-ignore
      const dish =  await conn.execute("SELECT * FROM meals WHERE MealID = ?", [RecentView.rows[x].MealID]);
      // @ts-ignore
      try{arr.push({mealinfo: dish.rows[0], time: RecentView.rows[x].time_viewed})}catch{}
  }

  if (isdemo == "true" && loggedin == true) {
    return {
      props: { params: {isdemo: true, details: demodetails, loggedin, user:user?.user, items, updated, recent:arr, now_time}}
    }
  } if (loggedin == true) {
    return {
      props: { params: {isdemo: false, details: demodetails, loggedin, user:user?.user, items, updated, recent:arr, now_time}}
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

const Profile = ({ params }: InferGetServerSidePropsType<typeof getServerSideProps>) => {

  let isdemo = "";
  try {
        if (params.user?.sub == "google-oauth2|143087949221293105235") {
        isdemo = "?demo=true"
        }
  } catch {}

  const router = useRouter();
  const recentarr = params.recent;
  recentarr.sort((a, b) => b.time - a.time);

  const [select_option, setSelectOption] = useState(0);
  const [recentpage, setRecentPage] = useState(1);
  const [recentperpage] = useState(6);
  const indexoflast = recentpage * recentperpage;
  const indexoffirst = indexoflast - recentperpage;
  const currentrecent = recentarr.slice(indexoffirst, indexoflast);
  const pageNumbers = [];
  for (let i = 1; i <= Math.ceil(recentarr.length / recentperpage); i++) {
      pageNumbers.push(i);
  }
  const paginate = (number: number) => {
      if (number >= 1 && number <= Math.ceil(recentarr.length / recentperpage)) {
        setRecentPage(number);
      }
  };

  const button_class = "w-1/2 m-auto rounded-lg bg-[#DB6310] px-2 py-4 text-base font-semibold leading-2 text-black shadow-md hover:bg-orange-500 ease-in-out transition";
  const button_class_selected = "w-1/2 m-auto rounded-lg bg-orange-400 px-2 py-4 text-base font-semibold leading-2 text-black shadow-md ease-in-out transition cursor-auto";

  return (
    <>
      <main className="flex min-h-screen flex-col bg-gradient-to-tr from-[#313131] to-[#000000]">
        <Navbar loggedin={params.loggedin} authuser={params.user} items={JSON.parse(params.items)} />
        <div className="container items-center gap-10 px-4 py-10 justify-center grid grid-cols-1 text-white text-xl max-w-sm md:max-w-6xl mx-auto">
            <h1 className="text-5xl font-extrabold tracking-tight text-white sm:text-[5rem] text-center">
                <span className="text-[#DB6310]">Your </span>Profile
            </h1>
            <div className="grid grid-cols-1 md:grid-cols-3 bg-[#313131] p-6 rounded-lg">
                <div className="grid grid-cols-1 h-40">
                  {select_option == 0 ?
                    <button onClick={()=> setSelectOption(0)} className={button_class_selected}>
                        Account
                    </button>
                  :
                    <button onClick={()=> setSelectOption(0)} className={button_class}>
                        Account
                    </button>
                  }
                  {select_option == 1 ?
                    <button onClick={()=> setSelectOption(1)} className={button_class_selected}>
                        Recent
                    </button>
                  :
                    <button onClick={()=> setSelectOption(1)} className={button_class}>
                        Recent
                    </button>
                  }
                </div>
                <div className="md:col-span-2">
                    {select_option == 1 && 
                      <div id="recent" className="">
                        <h2 className="text-left underline text-4xl font-semibold">Recent</h2>
                        {currentrecent.map((meal: any) => 
                            <>
                              {meal.mealinfo.MealType == "recipes" ? 
                                <>
                                  {parseFloat(((params.now_time - meal.time)/86400000).toFixed(0)) > 1 &&
                                    <p className="text-left text-gray-200 my-4 cursor-pointer" onClick={()=> router.push("/recipe/" + meal.mealinfo.MealID + isdemo)}>{meal.mealinfo.MealName} - {parseFloat(((params.now_time - meal.time)/86400000).toFixed(0))}d</p>
                                  }
                                  {parseFloat(((params.now_time - meal.time)/3600000).toFixed(0)) >= 1 && parseFloat(((params.now_time - meal.time)/86400000).toFixed(0)) <= 1 &&
                                    <p className="text-left text-gray-200 my-4 cursor-pointer" onClick={()=> router.push("/recipe/" + meal.mealinfo.MealID + isdemo)}>{meal.mealinfo.MealName} - {parseFloat(((params.now_time - meal.time)/3600000).toFixed(0))}h</p>
                                  }
                                  {parseFloat(((params.now_time - meal.time)/3600000).toFixed(0)) < 1 &&
                                    <p className="text-left text-gray-200 my-4 cursor-pointer" onClick={()=> router.push("/recipe/" + meal.mealinfo.MealID + isdemo)}>{meal.mealinfo.MealName} - {parseFloat(((params.now_time - meal.time)/60000).toFixed(0))}m</p>
                                  }
                                </>
                              :
                                <>
                                  {parseFloat(((params.now_time - meal.time)/86400000).toFixed(0)) > 1 &&
                                    <p className="text-left text-gray-200 my-4" onClick={()=> router.push("/menuitem/" + meal.mealinfo.MealID + isdemo)}>{meal.mealinfo.MealName} - {parseFloat(((params.now_time - meal.time)/86400000).toFixed(0))}d</p>
                                  }
                                  {parseFloat(((params.now_time - meal.time)/3600000).toFixed(0)) >= 1 && parseFloat(((params.now_time - meal.time)/86400000).toFixed(0)) <= 1 &&
                                    <p className="text-left text-gray-200 my-4" onClick={()=> router.push("/menuitem/" + meal.mealinfo.MealID + isdemo)}>{meal.mealinfo.MealName} - {parseFloat(((params.now_time - meal.time)/3600000).toFixed(0))}h</p>
                                  }
                                  {parseFloat(((params.now_time - meal.time)/3600000).toFixed(0)) < 1 &&
                                    <p className="text-left text-gray-200 my-4" onClick={()=> router.push("/menuitem/" + meal.mealinfo.MealID + isdemo)}>{meal.mealinfo.MealName} - {parseFloat(((params.now_time - meal.time)/60000).toFixed(0))}m</p>
                                  }
                                </>
                              }
                            </>
                        )}
                        {recentarr &&
                          <>
                            {recentpage > 1 &&
                              <button onClick={() => paginate(recentpage-1)} className="text-left m-2 text-black bg-white p-2 rounded-xl mb-10">
                                <svg viewBox="0 0 24 24" className="w-8 h-8" xmlns="http://www.w3.org/2000/svg" fill="#000000"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <title></title> <g id="Complete"> <g id="arrow-left"> <g> <polyline data-name="Right" fill="none" id="Right-2" points="7.6 7 2.5 12 7.6 17" stroke="#000000" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></polyline> <line fill="none" stroke="#000000" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" x1="21.5" x2="4.8" y1="12" y2="12"></line> </g> </g> </g> </g></svg>
                              </button>
                            }
                            {recentpage < Math.ceil(recentarr.length / recentperpage) &&
                              <button onClick={() => paginate(recentpage+1)} className="text-left m-2 text-black bg-white p-2 rounded-xl mb-10">
                                <svg viewBox="0 0 24.00 24.00" className="w-8 h-8" xmlns="http://www.w3.org/2000/svg" fill="#000000"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <title></title> <g id="Complete"> <g id="arrow-right"> <g> <polyline data-name="Right" fill="none" id="Right-2" points="16.4 7 21.5 12 16.4 17" stroke="#000000" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.4"></polyline> <line fill="none" stroke="#000000" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.4" x1="2.5" x2="19.2" y1="12" y2="12"></line> </g> </g> </g> </g></svg>
                              </button>
                            }
                          </>
                        }
                    </div>
                    }
                    {select_option == 0 &&
                      <div className="m-auto grid grid-cols-4">
                        <div>
                          <Image width="200" height="200" src={params.user?.picture} alt="pfp" className="rounded-full w-40 h-40 ring-1 ring-gray-400 ring-opacity-40 ring-offset-gray-800 ring-offset-2" referrerPolicy="no-referrer" />
                        </div>
                        <div className="col-span-3">
                          <p className="py-2 font-normal text-xl">Name: {params.user?.name}</p>
                          <p className="py-2 font-normal text-xl">Email: {params.user?.email}</p>
                          <p className="py-2 font-normal text-xl">Created: {new Date(params.updated.toString()).toDateString()}</p>
                        </div>
                      </div>
                    }
                </div>
            </div>
        </div>
      </main>
    </>
  );
};

export default Profile;
