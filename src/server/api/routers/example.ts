/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-for-in-array */
/* eslint-disable prefer-const */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/restrict-plus-operands */
/* eslint-disable @typescript-eslint/ban-ts-comment */
import { z } from "zod";
import {Configuration, OpenAIApi} from 'openai';
// import { connect } from "@planetscale/database";

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

import {
  createTRPCRouter,
  publicProcedure,
  protectedProcedure,
} from "~/server/api/trpc";
import axios from "axios";
import { client } from "./db_actions";

export const exampleRouter = createTRPCRouter({
  hello: publicProcedure
    .input(z.object({ text: z.string() }))
    .query(({ input }) => {
      return {
        greeting: `Hello ${input.text}`,
      };
    }),

  getSecretMessage: protectedProcedure.query(() => {
    return "you can now see this secret message!";
  }),

  mutateGPT: publicProcedure
    .input(z.object({ text: z.string() }))
    .mutation(async ({ input }) => {
      const openai = new OpenAIApi(configuration);

      const messages = [];
      messages.push({ role: "user", content: input.text });

      // @ts-ignore
      const completion = await openai.createChatCompletion({model: "gpt-3.5-turbo", messages: messages});
      const text = completion.data.choices[0]?.message;
      return {
        api_test: text,
      };
    }),
    
  getApiResults: publicProcedure
    .input(z.object({ text: z.string(), type: z.string() }))
    .mutation(async ({ input }) => {
      const MealCheck = await client.execute({
        sql: "SELECT * FROM meals WHERE MealName LIKE ? AND MealType = ?",
        args: ["%" + input.text.toLowerCase() + "%", input.type]
      });
      // eslint-disable-next-line @typescript-eslint/no-array-constructor
      let mealjson = new Array();
      let getResults;
      if (MealCheck.rows.length >= 10) {
        for (let mealnum in MealCheck.rows) {
          // @ts-ignore
          let meal = {id: MealCheck.rows[mealnum].MealID, title: MealCheck.rows[mealnum].MealName, image: JSON.parse(MealCheck.rows[mealnum].Response).image, restaurantChain: JSON.parse(MealCheck.rows[mealnum].Response).restaurantChain, servings: JSON.parse(MealCheck.rows[mealnum].Response).servings};
          mealjson.push(meal);
        }
      } else {
        if (input.type == "menuitem") {
          getResults = await axios.get("https://api.spoonacular.com/food/menuItems/search?query=" + input.text + "&apiKey=" + process.env.FOOD_APIKEY);
          for (let mealnum in getResults.data.menuItems) {
            let meal = {id: getResults.data.menuItems[mealnum].id, title: getResults.data.menuItems[mealnum].title, image: getResults.data.menuItems[mealnum].image,
              restaurantChain: getResults.data.menuItems[mealnum].restaurantChain, servings: getResults.data.menuItems[mealnum].servings
            };
            mealjson.push(meal);
            await client.execute({
              sql: "INSERT INTO meals (MealID, MealName, Response, MealType) SELECT ?, ?, ?, ? WHERE NOT EXISTS (SELECT 1 FROM meals WHERE MealID = ?);",
              args: [getResults.data.menuItems[mealnum].id, getResults.data.menuItems[mealnum].title, JSON.stringify(meal), input.type, getResults.data.results[mealnum].id]
            });
          }
        }
        if (input.type == "recipes") {
          getResults = await axios.get("https://api.spoonacular.com/recipes/complexSearch?query=" + input.text + "&apiKey=" + process.env.FOOD_APIKEY);
          for (let mealnum in getResults.data.results) {
            let meal = {id: getResults.data.results[mealnum].id, title: getResults.data.results[mealnum].title, image: getResults.data.results[mealnum].image};
            mealjson.push(meal);
            await client.execute({
              sql: "INSERT INTO meals (MealID, MealName, Response, MealType) SELECT ?, ?, ?, ? WHERE NOT EXISTS (SELECT 1 FROM meals WHERE MealID = ?);",
              args: [getResults.data.results[mealnum].id, getResults.data.results[mealnum].title, JSON.stringify(meal), input.type, getResults.data.results[mealnum].id]
            });
          }
        }
      }
      return { mealjson: JSON.stringify(mealjson), result: getResults?.data};
    }),

  UpdateInstructIngredient: publicProcedure
    .input(z.object({ dishid: z.string(), HowToMake: z.string()}))
    .mutation(async ({ input }) => {
      await client.execute({
        sql: "UPDATE meals SET HowToMake = ? WHERE MealID = ?",
        args: [input.HowToMake, input.dishid]
      });
      return { result: "Updated instruction + ingredient for dish " + input.dishid};
    }),

  addDishLibrary: publicProcedure
    .input(z.object({ dishid: z.string(), userid: z.string() }))
    .mutation(async ({ input }) => {
      await client.execute({
        sql: "INSERT INTO user_library (MealID, UserID) SELECT ?, ? WHERE NOT EXISTS (SELECT 1 FROM user_library WHERE MealID = ? AND UserID = ?);",
        args: [input.dishid, input.userid, input.dishid, input.userid]
      });
      return { result: "Added into user_library"};
    }),

  removeDishLibrary: publicProcedure
    .input(z.object({ dishid: z.string(), userid: z.string() }))
    .mutation(async ({ input }) => {
      await client.execute({
        sql: "DELETE FROM user_library WHERE MealID = ? AND UserID = ?",
        args: [input.dishid, input.userid]
      });
      return { result: "Removed from user_library"};
    }),

  AddUserRecentView: publicProcedure
    .input(z.object({ dishid: z.string(), userid: z.string() }))
    .query(async ({ input }) => {
      await client.execute({
        sql: "DELETE FROM user_recentview WHERE MealID = ? AND UserID = ?",
        args: [input.dishid, input.userid]
      });
      await client.execute({
        sql: "INSERT INTO user_recentview (MealID, UserID, time_viewed) SELECT ?, ?, ? WHERE NOT EXISTS (SELECT 1 FROM user_library WHERE MealID = ? AND UserID = ?);",
        args: [input.dishid, input.userid, new Date().getMilliseconds(), input.dishid, input.userid]
      });
      return { result: "added to user_recentview"};
    }),
});
