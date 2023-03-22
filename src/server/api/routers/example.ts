/* eslint-disable prefer-const */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/restrict-plus-operands */
/* eslint-disable @typescript-eslint/ban-ts-comment */
import { z } from "zod";
import {Configuration, OpenAIApi} from 'openai';
import { connect } from "@planetscale/database";

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

import {
  createTRPCRouter,
  publicProcedure,
  protectedProcedure,
} from "~/server/api/trpc";
import axios from "axios";
import { config } from "./db_actions";

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

  chatGPT: publicProcedure
    .input(z.object({ text: z.string() }))
    .mutation(async ({ input }) => {
      const openai = new OpenAIApi(configuration);

      const messages = [];
      messages.push({ role: "user", content: input.text });

      // @ts-ignore
      const completion = await openai.createChatCompletion({model: "gpt-3.5-turbo", messages: messages});
      const text = completion.data.choices[0]?.message;

      return {
        // @ts-ignore
        api_test: text,
      };
    }),

  getApiResults: publicProcedure
    .input(z.object({ text: z.string() }))
    .mutation(async ({ input }) => {
      const conn = connect(config);
      const MealCheck = await conn.execute("SELECT * FROM meals WHERE MealName LIKE ?", ["%" + input.text.toLowerCase() + "%"]);
      // eslint-disable-next-line @typescript-eslint/no-array-constructor
      let mealjson = new Array();
      console.log(MealCheck.size);
      if (MealCheck.size >= 10) {
        console.log(MealCheck.rows);
      } else {
        const getResults = await axios.get("https://api.spoonacular.com/food/menuItems/search?query=" + input.text + "&apiKey=" + process.env.FOOD_APIKEY);
        for (let mealnum in getResults.data.menuItems) {
          let meal = {id: getResults.data.menuItems[mealnum].id, title: getResults.data.menuItems[mealnum].title, image: getResults.data.menuItems[mealnum].image,
            restaurantChain: getResults.data.menuItems[mealnum].restaurantChain, servings: getResults.data.menuItems[mealnum].servings
          };
          mealjson.push(meal);
          await conn.execute("INSERT IGNORE INTO meals (MealID, MealName, Response) VALUES (?,?,?)", 
            [getResults.data.menuItems[mealnum].id, getResults.data.menuItems[mealnum].title, JSON.stringify(meal)]
          )
        }
      }
      return { mealjson: JSON.stringify(mealjson)};
    }),
});
