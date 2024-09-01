"use client";

import React from "react";

import apolloClient from "@/lib/apolloClient";
import { ApolloProvider as GraphQlApolloProvider } from "@apollo/client";

const ApolloProvider = ({ children }) => {
  return (
    <GraphQlApolloProvider client={apolloClient}>
      {children}
    </GraphQlApolloProvider>
  );
};

export default ApolloProvider;
