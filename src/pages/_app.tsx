
import { api } from "~/utils/api";

import "~/styles/globals.css";

import { UserProvider } from '@auth0/nextjs-auth0/client';
import type { AppProps } from 'next/app'
import MetaTags from "~/components/MetaTags";
import { Analytics } from '@vercel/analytics/react';


function MealMentor({ Component, pageProps }: AppProps) {
  return (
    <UserProvider>
      <MetaTags />
      <Component {...pageProps} />
      <Analytics />
    </UserProvider>
  );
}

export default api.withTRPC(MealMentor);
