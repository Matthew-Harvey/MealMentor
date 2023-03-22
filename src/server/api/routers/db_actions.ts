/* eslint-disable prefer-const */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-for-in-array */
/* eslint-disable @typescript-eslint/no-unsafe-argument */

import { connect } from "@planetscale/database";
import { z } from "zod";
import { createTRPCRouter, publicProcedure} from "~/server/api/trpc";

export const config = { url: process.env['DATABASE_URL'] }

export const DBrouter = createTRPCRouter({
  reset_tables: publicProcedure
  .query(async () => {
    const conn = connect(config)
    await conn.execute(
    `

      DROP TABLE IF EXISTS meal_history, users, meals

    `);
    await conn.execute(
    `

    CREATE TABLE meal_history (
      UserID varchar(255) NOT NULL,
      MealID varchar(255) NOT NULL
    )

    `);
    await conn.execute(
    `

    CREATE TABLE users (
      UserID varchar(255) NOT NULL,
      Picture varchar(255),
      Name varchar(255),
      Nickname varchar(255),
      Locale varchar(255),
      GivenName varchar(255),
      EmailVerified varchar(255),
      Email varchar(255),
      Updated varchar(255),
      PRIMARY KEY (UserID)
    )

    `);
    await conn.execute(
      `
  
      CREATE TABLE meals (
        MealID varchar(255) NOT NULL,
        MealName varchar(255) NOT NULL,
        Response varchar(255),
        PRIMARY KEY (MealID)
      )
  
      `);
    return {
      results: "complete"
    };
  }),
  
  InsertUser: publicProcedure
  .input(z.object({ user: z.object({name: z.string()}).catchall(z.any())}))
  .mutation(async ({ input }) => {
    const conn = connect(config);
    const doesidexist = await conn.execute("SELECT UserID FROM users WHERE UserID = ?", [input.user.sub]);
    let runinsert = true;
    for (let x in doesidexist.rows) {
      runinsert = false;
    }
    if (runinsert == true) {
      await conn.execute("INSERT INTO users (UserID, Picture, Name, Nickname, Locale, GivenName, EmailVerified, Email, Updated) VALUES (?,?,?,?,?,?,?,?,?)", 
        [input.user.sub, input.user.picture, input.user.name, input.user.nickname, input.user.locale, input.user.given_name, input.user.email_verified, input.user.email, input.user.updated_at]
      )
    }
    return {
      result: "added",
    };
  }),
});