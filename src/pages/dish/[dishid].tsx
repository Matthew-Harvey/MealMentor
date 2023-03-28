/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @next/next/no-img-element */
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
import { api } from "~/utils/api";
import { demodetails } from "~/functions/demo";
import Navbar from "~/components/Navbar";
import { connect } from "@planetscale/database";
import { config } from "~/server/api/routers/db_actions";
import { useState } from "react";
import { getSession } from "@auth0/nextjs-auth0";
import { getSearchResults } from "~/functions/getalldish";
import axios from "axios";

export async function getServerSideProps(context : GetServerSidePropsContext) {
    const isdemo = context.query.demo;
    const dishid = context.query.dishid;

    const conn = connect(config);
    const getDetails = await conn.execute("SELECT * FROM meals WHERE MealID = ?", [dishid]);

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

    const HowToMakeCheck = await conn.execute("SELECT Instructions, Ingredients FROM meals WHERE MealID = ?", [dishid]);
    let instruct = "";
    let ingred = "";
    // @ts-ignore
    if (HowToMakeCheck.rows[0].Instructions != null) {
        // @ts-ignore
        instruct = HowToMakeCheck.rows[0].Instructions.toString(),
        // @ts-ignore
        ingred = HowToMakeCheck.rows[0].Ingredients.toString()
    } else {
        // @ts-ignore
        const getResult = await axios.get(process.env.AUTH0_BASE_URL?.toString() + "/api/GetInstructIngred", {params: {id: dishid, message: "Please give instructions to make " + getDetails.rows[0].MealName + " from " + JSON.parse(JSON.stringify(getDetails.rows[0].Response)).restaurantChain}});
        ingred = getResult.data.ingred;
        instruct = getResult.data.instruct;
        const updateDB = await axios.get(process.env.AUTH0_BASE_URL?.toString() + "/api/UpdateInstruct", {params: {id: dishid, instruct:instruct, ingred:ingred}});
    }

    const items = await getSearchResults();
    
    if (getDetails.size > 0) {
        const conn = connect(config);
        const LibraryCheck = await conn.execute("SELECT * FROM meal_history WHERE MealID = ? AND UserID = ?", [dishid, user?.user.sub]);
        let islibrary = false;
        if (LibraryCheck.size > 0){
            islibrary = true;
        }
        if (isdemo == "true") {
            return {
                // @ts-ignore
                props: { params: {instruct, ingred, isdemo: true, details: demodetails, dishid, name: getDetails.rows[0].MealName, dishdetails: getDetails.rows[0].Response, loggedin, user:user.user, islibrary:islibrary, items}}
            }
        } else {
            return {
                // @ts-ignore
                props: { params: {instruct, ingred, isdemo: false, details: demodetails, dishid, name: getDetails.rows[0].MealName, dishdetails: getDetails.rows[0].Response, loggedin, user:user.user, islibrary:islibrary, items}}
            }
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

const DishPage = ({ params }: InferGetServerSidePropsType<typeof getServerSideProps>) => {
    const dishdetails = JSON.parse(params.dishdetails);
    const authInsert = api.db.InsertUser.useMutation();

    console.log(params);
    
    // @ts-ignore
    const AddLibrary = api.example.addDishLibrary.useMutation({dishid: params.dishid, userid: params.user.sub});const RemoveLibrary = api.example.removeDishLibrary.useMutation({dishid: params.dishid, userid: params.user.sub});
    const [AddedLib, SetAddedLib] = useState(params.islibrary);

    function AddToLibrary(){
        authInsert.mutate({ user: JSON.parse(JSON.stringify(params.user)) });
        // @ts-ignore
        AddLibrary.mutate({dishid: params.dishid, userid: params.user.sub});
        SetAddedLib(true);
    }
    function RemoveFromLibrary(){
        authInsert.mutate({ user: JSON.parse(JSON.stringify(params.user)) });
        // @ts-ignore
        RemoveLibrary.mutate({dishid: params.dishid, userid: params.user.sub});
        SetAddedLib(false);
    }

    return (
        <>
        <main className="flex min-h-screen flex-col bg-gradient-to-tr from-[#313131] to-[#000000]">
            <Navbar loggedin={params.loggedin} authuser={params.user} items={JSON.parse(params.items)} />
            <div className="container items-center gap-10 px-4 py-10 justify-center max-w-6xl m-auto">
                <h1 className="text-5xl font-extrabold tracking-tight text-white sm:text-[5rem]">
                    <span className="text-white">{params.name}</span>
                </h1>
                <h2 className="font-semibold text-4xl mt-4 mb-10 text-[#DB6310]">From {dishdetails.restaurantChain}</h2>
                <div className="grid grid-cols-3 max-w-6xl">
                    <div className="col-span-2 text-white">
                        <h2 className="bold underline text-lg mb-1">Ingredients:</h2>
                        <p>{params.ingred}</p>
                        <br />
                        <h2 className="bold underline text-lg mb-1">Instructions:</h2>
                        <p>{params.instruct}</p>
                    </div>
                    <img src={dishdetails.image} alt="Dish Image" className="rounded-lg m-auto shadow-lg" />
                </div>
                {params.loggedin ?
                    <>
                        {AddedLib ?
                            <button onClick={RemoveFromLibrary} className="p-3 bg-red-400 text-white transition hover:scale-105 rounded-lg mt-10">Remove from library</button>
                            :
                            <button onClick={AddToLibrary} className="p-3 bg-green-400 text-white transition hover:scale-105 rounded-lg mt-10">Add to library</button>
                        }
                    </>
                :
                    <>
                    </>
                }
            </div>
        </main>
        </>
    );
};

export default DishPage;
