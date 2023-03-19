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
import { useUser } from '@auth0/nextjs-auth0/client';
import { demodetails } from "~/functions/demo";
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

const Library = ({ params }: InferGetServerSidePropsType<typeof getServerSideProps>) => {
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
      <div className="min-h-screen bg-gradient-to-b from-[#2e026d] to-[#15162c]">
        <main className="flex flex-col items-center justify-center">
            <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16 ">
                <h1 className="text-5xl font-extrabold tracking-tight text-white sm:text-[5rem]">
                    <span className="text-[hsl(280,100%,70%)]">Your </span>Library
                </h1>
            </div>
        </main>
      </div>
    </>
  );
};

export default Library;
