/* eslint-disable @typescript-eslint/restrict-plus-operands */
/* eslint-disable @typescript-eslint/no-floating-promises */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import Link from "next/link";
import { useState } from "react";
import Image from "next/image";
import { demologin } from "~/functions/demo";
import { ReactSearchAutocomplete } from "react-search-autocomplete";
import router from "next/router";

const Navbar = ({loggedin, authuser, items} : any) => {

    const [navbar, setNavbar] = useState(false);

    let isdemo = "";
    try {
        if (authuser.sub == "google-oauth2|143087949221293105235") {
            isdemo = "?demo=true"
        }
    } catch {}
    
    const handleOnSearch = (string:any, results:any) => {
        // onSearch will have as the first callback parameter
        // the string searched and for the second the results.
        console.log(string, results, "ENTER PRESSED")
    }

    
    const handleOnHover = (result:any) => {
        // the item hovered
        console.log(result)
    }
    
    const handleOnSelect = (item:any) => {
        console.log(item);
        if (item.type == "recipes") {
            router.push("/recipe/" + item.id + isdemo);
        } else {
            router.push("/menuitem/" + item.id + isdemo);
        }
    }
    
    const handleOnFocus = () => {
        console.log('Focused')
    }
    
    const formatResult = (item:any) => {
        return (
          <>
            <span style={{ display: 'block', textAlign: 'left' }}>{item.name}</span>
          </>
        )
    }

    return (
        <nav className="w-full bg-transparent bg-opacity-50 sticky top-0 backdrop-blur-lg z-10 flex-shrink-1 border-b-stone-500 border-b border-opacity-40 will-change-scroll">
            <div className="justify-between px-4 mx-auto lg:max-w-6xl md:items-center md:flex md:px-8">
                <div>
                    <div className="flex items-center justify-between py-3 md:py-5 md:block">
                        <Link href={"/" + isdemo}><h2 className="text-4xl font-bold text-white"><span className="text-[#DB6310]">MEAL</span>MENTOR</h2></Link>
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
                            {loggedin && 
                                <div className="w-60">
                                    <ReactSearchAutocomplete
                                        items={items}
                                        onSearch={handleOnSearch}
                                        onHover={handleOnHover}
                                        onSelect={handleOnSelect}
                                        onFocus={handleOnFocus}
                                        autoFocus
                                        formatResult={formatResult}
                                        placeholder="Search"
                                    />
                                </div>
                            }
                            {loggedin && 
                                <Link className="text-white text-xl hover:text-[#DB6310]" href={"/find" + isdemo}>
                                    <p className="py-4 md:py-0">Find</p>
                                </Link>
                            }
                            {loggedin && 
                                <Link className="text-white text-xl hover:text-[#DB6310]" href={"/library" + isdemo}>
                                    <p className="py-4 md:py-0">Library</p>
                                </Link>
                            }
                            {loggedin ? <Link href="/api/auth/logout" className="text-white hover:text-[#DB6310] text-xl"><p className="py-4 md:py-0">Logout</p></Link> : <Link href="/api/auth/login" className="text-white hover:text-[#DB6310] text-xl"><p className="py-4 md:py-0">Sign In</p></Link>}
                            {loggedin && 
                                <>
                                    <Link className="bg-transparent" href={"/profile" + isdemo}>
                                        <Image width="200" height="200" src={authuser?.picture} alt="pfp" className="rounded-full w-8 h-8 ring-1 ring-gray-400 ring-opacity-40 ring-offset-gray-800 ring-offset-2" referrerPolicy="no-referrer" />
                                    </Link>
                                </>
                            }
                            <p className="text-white hover:text-[#DB6310] text-xl">
                              {loggedin == false && <button onClick={demologin}>Demo</button>}
                            </p>
                        </ul>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
