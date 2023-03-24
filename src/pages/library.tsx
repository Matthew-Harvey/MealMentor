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

  const conn = connect(config);
  const LibraryCheck = await conn.execute("SELECT * FROM meal_history WHERE UserID = ?", [user?.user.sub]);
  const arr = [];
  for (const x in LibraryCheck.rows) {
      // @ts-ignore
      const dish =  await conn.execute("SELECT * FROM meals WHERE MealID = ?", [LibraryCheck.rows[x].MealID]);
      // @ts-ignore
      try{arr.push(dish.rows[0].MealName)}catch{}
  }

  if (isdemo == "true" && loggedin == true) {
    return {
      props: { params: {isdemo: true, details: demodetails, loggedin, user:user?.user, lib: arr}}
    }
  } if (loggedin == true) {
    return {
      props: { params: {isdemo: false, details: demodetails, loggedin, user:user?.user, lib: arr}}
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

  return (
    <>
      <Navbar loggedin={params.loggedin} authuser={params.user} />
      <div className="min-h-screen bg-gradient-to-b from-[#2e026d] to-[#15162c]">
        <main className="flex flex-col items-center justify-center">
            <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16 ">
                <h1 className="text-5xl font-extrabold tracking-tight text-white sm:text-[5rem]">
                    <span className="text-[hsl(280,100%,70%)]">Your </span>Library
                </h1>
            </div>
            {params.lib.map((meal: any) => 
              <>
                <p className="text-white py-2">{meal}</p>
              </>
            )}
        </main>
      </div>
    </>
  );
};

export default Library;
