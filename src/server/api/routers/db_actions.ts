/* eslint-disable prefer-const */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-for-in-array */
/* eslint-disable @typescript-eslint/no-unsafe-argument */

// import { connect } from "@planetscale/database";
import { z } from "zod";
import { createTRPCRouter, publicProcedure} from "~/server/api/trpc";

export const config = { url: process.env['DATABASE_URL'] }

import { createClient } from "@libsql/client/web";
export const client = createClient({
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  url: process.env['TURSO_DATABASE_URL']!,
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  authToken: process.env['TURSO_AUTH_KEY']!,
});

export const DBrouter = createTRPCRouter({
  reset_tables: publicProcedure
  .query(async () => {
    await client.execute('DROP TABLE IF EXISTS users;');
    await client.execute('DROP TABLE IF EXISTS meals;');
    await client.execute('DROP TABLE IF EXISTS user_library;');
    await client.execute('DROP TABLE IF EXISTS user_recentview;');
    await client.execute(`
      CREATE TABLE user_library (
        UserID INT NOT NULL,
        MealID varchar(255) NOT NULL,
        PRIMARY KEY (UserID, MealID)
      )
    `)
    await client.execute(`
      CREATE TABLE users (
        UserID INT NOT NULL,
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
    await client.execute(`
      CREATE TABLE meals (
        MealID INT NOT NULL,
        MealName varchar(255),
        Response varchar(255),
        HowToMake TEXT,
        MealType varchar(255) NOT NULL,
        Taste varchar(255),
        Nutrition TEXT,
        Ingredients TEXT,
        Equipment TEXT,
        Price TEXT,
        PRIMARY KEY (MealID)
      )
    `);
    await client.execute(`
      CREATE TABLE user_recentview (
        MealID INT NOT NULL,
        UserID INT NOT NULL,
        time_viewed BIGINT,
        PRIMARY KEY (UserID, MealID)
      )
    `);
    return {
      results: "complete"
    };
  }),
  
  InsertUser: publicProcedure
  .input(z.object({ user: z.object({name: z.string()}).catchall(z.any())}))
  .mutation(async ({ input }) => {
    const doesidexist = await client.execute({
      sql: "SELECT UserID FROM users WHERE UserID = ?",
      args: [input.user.sub]
    });
    let runinsert = true;
    for (let x in doesidexist.rows) {
      runinsert = false;
    }
    if (runinsert == true) {
      await client.execute({
        sql: "INSERT INTO users (UserID, Picture, Name, Nickname, Locale, GivenName, EmailVerified, Email, Updated) VALUES (?,?,?,?,?,?,?,?,?)",
        args: [input.user.sub, input.user.picture, input.user.name, input.user.nickname, input.user.locale, input.user.given_name, input.user.email_verified, input.user.email, input.user.updated_at]
      });
    }
    return {
      result: "added",
    };
  }),
});
