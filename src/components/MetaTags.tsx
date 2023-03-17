import { type NextPage } from "next";
import Head from "next/head";

const MetaTags: NextPage = () => {
  return (
    <>
        <Head>
            <title>MealMentor</title>
            <meta name="description" content="Type in a prompt and get steps to make that food. Auth included so users have a library of past meals." />
            <link rel="icon" href="/favicon.ico" />
        </Head>
    </>
  );
};

export default MetaTags;
