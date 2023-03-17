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

import { type NextPage } from "next";
import Link from "next/link";
import { api } from "~/utils/api";
import { useUser } from '@auth0/nextjs-auth0/client';
import { useState } from "react";

const Home: NextPage = () => {
  const hello = api.example.hello.useQuery({ text: "from tRPC" });
  const api_test = api.example.chatGPT.useMutation();

  const [inputval, setInputVal] = useState("Hello!");
  const [hasEnter, setHasEnter] = useState(false);
  const [queryCount, setQuerycount] = useState(1);

  const auth = useUser();
  let loggedin = false;
  if (auth.user){
    loggedin = true;
  }
  
  async function QueryGPT  () {
    api_test.mutate({ text: inputval });
    setHasEnter(true);
    setQuerycount(queryCount+1);
  }

  const handleKeyDown = (e: any) => {
    if (e.code === "Enter") {
      QueryGPT();
    }
  }

  return (
    <>
      <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c]">
        <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16 ">
          <h1 className="text-5xl font-extrabold tracking-tight text-white sm:text-[5rem]">
            <span className="text-[hsl(280,100%,70%)]">Meal</span>Mentor
          </h1>
          {loggedin ? 
            <>
              <input value={inputval} onChange={(e) => setInputVal(e.target.value)} className="p-2 rounded-xl text-black text-md w-80" type="search" onKeyDown={handleKeyDown} disabled={api_test.isLoading || queryCount > 5}></input>
              <p className="text-2xl text-white">
                  {api_test.isLoading == true && "Loading response..."}
                  {hasEnter == false && "Please Type a question above"}
                  {api_test.data ? api_test.data?.api_test?.content : ""}
              </p>
            </>
            :
            <>
              <p className="text-2xl text-white">
                  Please log in to query chatGPT.
              </p>
            </>
          }
          
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-8 hidden">
            <Link
              className="flex max-w-xs flex-col gap-4 rounded-xl bg-white/10 p-4 text-white hover:bg-white/20"
              href="https://create.t3.gg/en/usage/first-steps"
              target="_blank"
            >
              <h3 className="text-2xl font-bold">First Steps →</h3>
              <div className="text-lg">
                Just the basics - Everything you need to know to set up your
                database and authentication.
              </div>
            </Link>
            <Link
              className="flex max-w-xs flex-col gap-4 rounded-xl bg-white/10 p-4 text-white hover:bg-white/20"
              href="https://create.t3.gg/en/introduction"
              target="_blank"
            >
              <h3 className="text-2xl font-bold">Documentation →</h3>
              <div className="text-lg">
                Learn more about Create T3 App, the libraries it uses, and how
                to deploy it.
              </div>
            </Link>
          </div>
          <div className="flex flex-col items-center gap-2 hidden">
            <p className="text-2xl text-white">
              {hello.data ? hello.data.greeting : "Loading tRPC query..."}
            </p>
          </div>
        </div>
      </main>
    </>
  );
};

export default Home;
