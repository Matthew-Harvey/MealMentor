/* eslint-disable @typescript-eslint/no-for-in-array */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/ban-ts-comment */

import { z } from "zod";
import {Configuration, OpenAIApi} from 'openai';

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

import {
  createTRPCRouter,
  publicProcedure,
  protectedProcedure,
} from "~/server/api/trpc";

export const exampleRouter = createTRPCRouter({
  hello: publicProcedure
    .input(z.object({ text: z.string() }))
    .query(({ input }) => {
      return {
        greeting: `Hello ${input.text}`,
      };
    }),

  getAll: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.example.findMany();
  }),

  getSecretMessage: protectedProcedure.query(() => {
    return "you can now see this secret message!";
  }),

  chatGPT: publicProcedure
    .input(z.object({ text: z.string() }))
    .query(async ({ input }) => {
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

});
