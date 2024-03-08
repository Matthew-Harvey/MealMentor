// pages/api/openai.js

import { type NextApiRequest, type NextApiResponse } from "next";
import { Configuration, OpenAIApi } from "openai";

export default async function handler(req: NextApiRequest, res: NextApiResponse<unknown>) {

  const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
  });

  const openai = new OpenAIApi(configuration);

    const response = await openai.createChatCompletion({
        model: "gpt-3.5-turbo",
        messages: [{role: "user", content: "Please give back an interesting fact!"}],
        max_tokens: 150,
        n: 1,
        stop: ["\n"],
        temperature: 0.7
    });

    console.log(response)

    res.status(200).json({ msg: "Working on it..." });
}
