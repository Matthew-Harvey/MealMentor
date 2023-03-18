/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import Link from "next/link";
import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/router";


const Navbar = ({loggedin, authuser} : any) => {

  const [navbar, setNavbar] = useState(false);
  const router = useRouter();

  function demologin () {
    void router.push( router.basePath + "?demo=true" );
  }

  return (
        <nav className="w-full bg-white shadow sticky top-0 z-10 flex-shrink-1">
            <div className="justify-between px-4 mx-auto lg:max-w-6xl md:items-center md:flex md:px-8">
                <div>
                    <div className="flex items-center justify-between py-3 md:py-5 md:block">
                        <Link href={"/"}><h2 className="text-3xl font-bold"><span className="text-[hsl(280,100%,70%)]">Meal</span>Mentor</h2></Link>
                        <div className="md:hidden">
                            <button
                                className="p-2 text-gray-700 rounded-md outline-none focus:border-gray-400 focus:border"
                                onClick={() => setNavbar(!navbar)}
                            >
                                {navbar ? (
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="w-6 h-6"
                                        viewBox="0 0 20 20"
                                        fill="currentColor"
                                    >
                                        <path
                                            fillRule="evenodd"
                                            d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                                            clipRule="evenodd"
                                        />
                                    </svg>
                                ) : (
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="w-6 h-6"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                        strokeWidth={2}
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            d="M4 6h16M4 12h16M4 18h16"
                                        />
                                    </svg>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
                <div>
                    <div
                        className={`flex-1 justify-self-center pb-3 mt-8 md:block md:pb-0 md:mt-0 ${
                            navbar ? "block" : "hidden"
                        }`}
                    >
                        <ul className="items-center justify-center space-y-8 md:flex md:space-x-6 md:space-y-0">
                            <li className="text-gray-600 text-lg md:-mr-6">
                              {loggedin && <span>{authuser?.name}</span>}
                            </li>
                            <li className="text-gray-600 text-lg md:mr-6 hidden md:flex">
                              {loggedin && authuser?.picture && <Image width="10" height="10" src={authuser?.picture} alt="pfp" 
                                className="rounded-full m-2 w-8 h-8 ring-1 ring-black" referrerPolicy="no-referrer" />
                              }
                            </li>
                            <li className="text-gray-600 hover:text-purple-600 text-lg">
                              {loggedin ? <Link href="/api/auth/logout">Logout</Link> : <Link href="/api/auth/login">Sign In</Link>}
                            </li>
                            <li className="text-gray-600 hover:text-purple-600 text-lg">
                              {loggedin == false && <button onClick={demologin}>Demo</button>}
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
