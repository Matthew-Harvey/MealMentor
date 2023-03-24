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
import Link from "next/link";
import { useUser } from '@auth0/nextjs-auth0/client';
import { demodetails, demologin } from "~/functions/demo";
import Navbar from "~/components/Navbar";

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

const Home = ({ params }: InferGetServerSidePropsType<typeof getServerSideProps>) => {

  const auth = useUser();
  let loggedin = false;
  if (auth.user){
    loggedin = true;
  }
  if (params.isdemo == true) {
    loggedin = true;
    auth.user = params.details;
  }

  return (
    <>
      <Navbar loggedin={loggedin} authuser={auth.user} />
      <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c]">
        <div className="container flex flex-col items-center justify-center gap-12 px-4 py-10 ">
          <h1 className="text-5xl font-extrabold tracking-tight text-white sm:text-[5rem]">
            <span className="text-[hsl(280,100%,70%)]">Meal</span>Mentor
          </h1>
          {loggedin ? 
            <>
              <p className="text-2xl text-white">
                  Please start looking for dishes by selecting below:
              </p>
            </>
            :
            <>
              <p className="text-2xl text-white">
                  Please log in to find your next dish!
              </p>
            </>
          }
          
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-8">
            {loggedin == false ?
             <>
                <Link
                  className="flex max-w-xs flex-col gap-4 rounded-xl bg-white/10 p-4 text-white hover:bg-white/20"
                  href="api/auth/login"
                >
                  <h3 className="text-2xl font-bold">Sign In →</h3>
                  <div className="text-lg">
                    Login using auth0 to save your data across devices.
                  </div>
                </Link>
                <button
                  className="flex max-w-xs flex-col gap-4 rounded-xl bg-white/10 p-4 text-white hover:bg-white/20 text-left"
                  onClick={demologin}
                >
                  <h3 className="text-2xl font-bold">Demo →</h3>
                  <div className="text-lg">
                    To have a look around as a demo user.
                  </div>
                </button>
             </>
             :
             <>
                <Link
                  className="flex max-w-xs flex-col gap-4 rounded-xl bg-white/10 p-4 text-white hover:bg-white/20"
                  href="/find"
                >
                  <h3 className="text-2xl font-bold">Find dish →</h3>
                  <div className="text-lg">
                    Use ChatGPT API to find a dish and get steps for creation.
                  </div>
                </Link>
                <Link
                  className="flex max-w-xs flex-col gap-4 rounded-xl bg-white/10 p-4 text-white hover:bg-white/20 text-left"
                  href="/library"
                >
                  <h3 className="text-2xl font-bold">View Library →</h3>
                  <div className="text-lg">
                    Press here to view the favourite dishes within your collection.
                  </div>
                </Link>
             </>
            }
          </div>
        </div>
      </main>
    </>
  );
};

export default Home;
