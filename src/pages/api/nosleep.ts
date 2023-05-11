/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/rules-of-hooks */
import { connect } from "@planetscale/database";
import { type NextApiRequest, type NextApiResponse } from "next";
import { config } from "~/server/api/routers/db_actions";

function makeid(length: number) {
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    let counter = 0;
    while (counter < length) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
      counter += 1;
    }
    return result;
}

export default async function NoSleep(req: NextApiRequest, res: NextApiResponse<any>) {
    
    const conn = connect(config);

    await conn.execute("CREATE TABLE IF NOT EXISTS nosleep (example varchar(10))");

    await conn.execute("INSERT INTO nosleep VALUES (?)", [makeid(10)]);

    await conn.execute("DROP TABLE IF EXISTS nosleep");

    res.status(200).json({"fixedsleep": true});
}