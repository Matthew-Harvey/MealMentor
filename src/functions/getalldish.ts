/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/ban-ts-comment */
import { connect } from "@planetscale/database";
import { config } from "~/server/api/routers/db_actions";

export async function getSearchResults () {
    const conn = connect(config);
    const AllMeals = await conn.execute("SELECT * FROM meals");

    const resultarr: { id: any; name: any; }[] = [];
    AllMeals.rows.forEach(meal => {
        // @ts-ignore
        const appendres = {id: meal.MealID, name:meal.MealName, type:meal.MealType};
        resultarr.push(appendres);
    });
    return JSON.stringify(resultarr);
}

