"use client";
import { AppProgressBar as ProgressBar } from "next-nprogress-bar";

import ApolloProvider from "@/lib/apolloProvider";
import { Theme } from "@radix-ui/themes";
export default function Providers({ children }) {
  return (
    <ApolloProvider>
      <Theme>
        {children}
        <ProgressBar
          height="4px"
          color="#BFA01D"
          options={{ showSpinner: false }}
          shallowRouting
        />
      </Theme>
    </ApolloProvider>
  );
}
