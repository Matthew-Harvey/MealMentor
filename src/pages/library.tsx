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
import MealSearchResult from "~/components/MealSearchResult";
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

  const conn = connect(config);
  const LibraryCheck = await conn.execute("SELECT * FROM user_library WHERE UserID = ?", [user?.user.sub]);
  const arr = [];
  for (const x in LibraryCheck.rows) {
      // @ts-ignore
      const dish =  await conn.execute("SELECT * FROM meals WHERE MealID = ?", [LibraryCheck.rows[x].MealID]);
      // @ts-ignore
      try{arr.push(dish.rows[0])}catch{}
  }

  if (isdemo == "true" && loggedin == true) {
    return {
      props: { params: {isdemo: true, details: demodetails, loggedin, user:user?.user, lib: arr, items}}
    }
  } if (loggedin == true) {
    return {
      props: { params: {isdemo: false, details: demodetails, loggedin, user:user?.user, lib: arr, items}}
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

const Library = ({ params }: InferGetServerSidePropsType<typeof getServerSideProps>) => {

  let isdemo = "";
  try {
        if (params.user?.sub == "google-oauth2|143087949221293105235") {
        isdemo = "?demo=true"
        }
  } catch {}

  return (
    <>
      <main className="flex min-h-screen flex-col bg-gradient-to-tr from-[#313131] to-[#000000]">
        <Navbar loggedin={params.loggedin} authuser={params.user} items={JSON.parse(params.items)} />
        <div className="container items-center gap-10 px-4 py-10 justify-center max-w-6xl m-auto grid grid-cols-1">
            <h1 className="text-5xl font-extrabold tracking-tight text-white sm:text-[5rem] text-center">
                <span className="text-[#DB6310]">Your </span>Library
            </h1>
            <div className="text-2xl text-white">
              <div className="grid grid-cols-2 max-w-4xl px-2 gap-0 m-auto">
                {params.lib.map((meal: any) => 
                  <>
                    <MealSearchResult title={meal.MealName} id={meal.MealID} image={JSON.parse(meal.Response).image} restaurantChain={JSON.parse(meal.Response).restaurantChain} isdemo={isdemo} />
                  </>
                )}
              </div>
            </div>
        </div>
      </main>
    </>
  );
};

export default Library;
