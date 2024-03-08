/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/rules-of-hooks */
// import { connect } from "@planetscale/database";
import { type NextApiRequest, type NextApiResponse } from "next";
import { client } from "~/server/api/routers/db_actions";

export default async function UpdateInstruct(req: NextApiRequest, res: NextApiResponse<any>) {
    
    await client.execute({
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion, @typescript-eslint/no-non-null-asserted-optional-chain
        sql: "UPDATE meals SET Instructions = ?, Ingredients = ? WHERE MealID = ?", args: [req.query.instruct?.toString()!, req.query.ingred?.toString()!, req.query.id?.toString()!]
    });

    res.status(200).json({updated: true});
}