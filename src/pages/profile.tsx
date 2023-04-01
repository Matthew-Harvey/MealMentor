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

  return (
    <>
      <main className="flex min-h-screen flex-col bg-gradient-to-tr from-[#313131] to-[#000000]">
        <Navbar loggedin={params.loggedin} authuser={params.user} items={JSON.parse(params.items)} />
        <div className="container items-center gap-10 px-4 py-10 justify-center max-w-6xl m-auto grid grid-cols-1 text-white text-center text-xl">
            <h1 className="text-5xl font-extrabold tracking-tight text-white sm:text-[5rem] text-center">
                <span className="text-[#DB6310]">Your </span>Account
            </h1>
            <p>Name - {params.user?.name}</p>
            <p>Email - {params.user?.email}</p>
            <p>Created - {new Date(params.updated.toString()).toDateString()}</p>
            <div id="recent">
              <h2 className="text-left max-w-6xl underline">Recent</h2>
              {params.recent.map((meal: any) => 
                  <>
                    {parseInt(((params.now_time - meal.time)/1000/60).toString()) > 60 &&
                      <p className="text-left text-gray-200 italic my-2" onClick={()=> router.push("/dish/" + meal.mealinfo.MealID)}>{meal.mealinfo.MealName} - {parseInt(((params.now_time - meal.time)/1000/60).toString())}h</p>
                    }
                    {parseInt(((params.now_time - meal.time)/1000/60/60).toString()) > 24 &&
                      <p className="text-left text-gray-200 italic my-2" onClick={()=> router.push("/dish/" + meal.mealinfo.MealID)}>{meal.mealinfo.MealName} - {parseInt(((params.now_time - meal.time)/1000/60).toString())}d</p>
                    }
                    {parseInt(((params.now_time - meal.time)/1000/60).toString()) <= 60 &&
                      <p className="text-left text-gray-200 italic my-2" onClick={()=> router.push("/dish/" + meal.mealinfo.MealID)}>{meal.mealinfo.MealName} - {parseInt(((params.now_time - meal.time)/1000/60).toString())}m</p>
                    }
                  </>
              )}
            </div>
        </div>
      </main>
    </>
  );
};

export default Profile;
