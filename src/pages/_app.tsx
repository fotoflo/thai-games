import "@/styles/globals.css";
import { ReadThaiGameProvider } from "@/context/ReadThaiGameContext";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import useGoogleAnalytics from "@/hooks/useGA";
import type { AppProps } from "next/app";

const queryClient = new QueryClient();

function MyApp({ Component, pageProps }: AppProps) {
  const GoogleAnalytics = useGoogleAnalytics();

  return (
    <>
      {GoogleAnalytics}
      <QueryClientProvider client={queryClient}>
        <ReadThaiGameProvider>
          <Component {...pageProps} />
        </ReadThaiGameProvider>
      </QueryClientProvider>
    </>
  );
}

export default MyApp;
