import "@/styles/globals.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import useGoogleAnalytics from "@/hooks/useGA";
import type { AppProps } from "next/app";
import { ReadThaiGameContext } from "@/machines/cardSetMachine";

const queryClient = new QueryClient();

function MyApp({ Component, pageProps }: AppProps) {
  const GoogleAnalytics = useGoogleAnalytics();

  return (
    <>
      {GoogleAnalytics}
      <QueryClientProvider client={queryClient}>
        <ReadThaiGameContext.Provider>
          <Component {...pageProps} />
        </ReadThaiGameContext.Provider>
      </QueryClientProvider>
    </>
  );
}

export default MyApp;
