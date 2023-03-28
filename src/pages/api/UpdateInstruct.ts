/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/rules-of-hooks */
import { connect } from "@planetscale/database";
import { type NextApiRequest, type NextApiResponse } from "next";
import { config } from "~/server/api/routers/db_actions";

export default async function UpdateInstruct(req: NextApiRequest, res: NextApiResponse<any>) {
    
    const conn = connect(config);
    await conn.execute("UPDATE meals SET Instructions = ?, Ingredients = ? WHERE MealID = ?", 
        [req.query.instruct, req.query.ingred, req.query.id]
    )

    res.status(200).json({updated: true});
}