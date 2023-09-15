"use client";
import Spinner from "@/components/Spinner";
import {
  QueryClient,
  QueryClientProvider as Provider,
} from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import React from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
const QueryClientProvider = ({ children }: { children: React.ReactNode }) => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        refetchOnWindowFocus: false, // default: true
      },
    },
  });

  return (
    <Provider client={queryClient}>
      <Spinner />
      <ToastContainer />
      <ReactQueryDevtools initialIsOpen={true} />
      {children}
    </Provider>
  );
};

export default QueryClientProvider;
