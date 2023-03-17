
import { api } from "~/utils/api";

import "~/styles/globals.css";

import { UserProvider } from '@auth0/nextjs-auth0/client';
import type { AppProps } from 'next/app'
import Navbar from "~/components/Navbar";
import MetaTags from "~/components/MetaTags";

function MealMentor({ Component, pageProps }: AppProps) {
  return (
    <UserProvider>
      <MetaTags />
      <Navbar />
      <Component {...pageProps} />
    </UserProvider>
  );
}

export default api.withTRPC(MealMentor);
