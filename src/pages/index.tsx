/* eslint-disable @next/next/no-img-element */
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
import { getSearchResults } from "~/functions/getalldish";

export async function getServerSideProps(context : GetServerSidePropsContext) {

  const items = await getSearchResults();

  const isdemo = context.query.demo;
  if (isdemo == "true") {
    return {
      props: { params: {isdemo: true, details: demodetails, items}}
    }
  } else {
    return {
      props: { params: {isdemo: false, details: demodetails, items}}
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

  let isdemo = "";
  try {
        if (auth.user?.sub == "google-oauth2|143087949221293105235") {
        isdemo = "?demo=true"
        }
    } catch {}

  return (
    <>
      <main className="flex min-h-screen pb-10 flex-col bg-gradient-to-tr from-[#313131] to-[#000000]">
        <Navbar loggedin={loggedin} authuser={auth.user} items={JSON.parse(params.items)} />
        <div className="container items-center gap-10 px-4 py-10 justify-center max-w-6xl m-auto">
            <div className="grid grid-cols-5">
              <div className="col-span-5 md:col-span-3">
                <h1 className="text-5xl lg:text-8xl font-extrabold tracking-tight text-white sm:text-[5rem] col">
                Find Your <span className="text-[#DB6310]">Dream Food</span> With Us
                </h1>
                {loggedin ? 
                  <>
                    <p className="text-2xl text-white my-10">
                        Please start looking for dishes by selecting below:
                    </p>
                  </>
                  :
                  <>
                    <p className="text-2xl text-white my-10">
                        Please log in to find your next dish!
                    </p>
                  </>
                }
            </div>
            <div style={{backgroundImage: "url(/noah-buscher-8A7fD6Y5VF8-unsplash.jpg)"}} className="relative rounded-3xl w-full h-96 col-span-5 md:col-span-2 bg-cover bg-no-repeat min-h-full z-0">
                <img src={"/ric-matkowski-T8SD7bwyxHU-unsplash-removebg-preview.png"} alt="Burger ingredients" className="
                  relative bottom-0 left-0 rounded-3xl w-auto h-72 md:h-96 z-10 overflow-visible rotate-45 lg:mb-32 lg:-mt-32 lg:mr-32 lg:-ml-32 md:mb-28 md:-mt-28 md:mr-28 md:-ml-28
                  sm:mb-40 sm:-mt-0 sm:mr-40 sm:-ml-12 mb-10 -mt-12 mr-10 -ml-10
                " />
                <svg xmlns="http://www.w3.org/2000/svg" version="1.1" className="w-full m-auto h-full -z-50 lg:mb-80 lg:-mt-40 lg:mr-80 lg:-ml-40 md:mb-32 md:-mt-32 md:mr-32 md:-ml-32 hidden md:flex" viewBox="0 0 1422 800"><g stroke-width="20" stroke="hsl(30, 100%, 40%)" fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-dasharray="18.5 35" transform="rotate(326, 711, 400)"><path d="M322.5 11.5Q904.5 101.5 711 400Q414.5 598.5 1099.5 788.5 " marker-end="url(#SvgjsMarker3482)" marker-start="url(#SvgjsMarker3483)"></path></g><defs><marker markerWidth="6.5" markerHeight="6.5" refX="3.25" refY="3.25" viewBox="0 0 6.5 6.5" orient="auto" id="SvgjsMarker3482"><polygon points="0,6.5 2.1666666666666665,3.25 0,0 6.5,3.25" fill="hsl(30, 100%, 40%)"></polygon></marker><marker markerWidth="6.5" markerHeight="6.5" refX="3.25" refY="3.25" viewBox="0 0 6.5 6.5" orient="auto" id="SvgjsMarker3483"><polygon points="0,3.25 6.5,0 4.333333333333333,3.25 6.5,6.5" fill="hsl(30, 100%, 40%)"></polygon></marker></defs></svg>
            </div>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:flex md:gap-8 mt-10 z-40">
            {loggedin == false ?
             <>
                <Link
                  className="flex max-w-xs flex-col gap-4 rounded-xl bg-white/10 p-4 text-white hover:bg-white/20"
                  href="api/auth/login"
                >
                  <h3 className="text-2xl font-bold">Sign In →</h3>
                  <div className="text-lg">
                    Login using auth0 to save all of your data across devices.
                  </div>
                </Link>
                <button
                  className="flex max-w-xs flex-col gap-4 rounded-xl bg-white/10 p-4 text-white hover:bg-white/20 text-left"
                  onClick={demologin}
                >
                  <h3 className="text-2xl font-bold">Demo →</h3>
                  <div className="text-lg">
                    To have a look around as a demo user, click here.
                  </div>
                </button>
             </>
             :
             <>
                <Link
                  className="flex max-w-xs flex-col gap-4 rounded-xl bg-white/10 p-4 text-white hover:bg-white/20"
                  href={"/find" + isdemo}
                >
                  <h3 className="text-2xl font-bold">Find dish →</h3>
                  <div className="text-lg">
                    Use ChatGPT API to find a dish and get steps for creation.
                  </div>
                </Link>
                <Link
                  className="flex max-w-xs flex-col gap-4 rounded-xl bg-white/10 p-4 text-white hover:bg-white/20 text-left"
                  href={"/library" + isdemo}
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
