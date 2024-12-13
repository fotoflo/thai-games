import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import "../styles/globals.css"; // Add this line
import { useEffect } from "react";
import Script from "next/script";

const queryClient = new QueryClient();

export default function App({ Component, pageProps }) {
  useEffect(() => {
    // Initialize gtag
    window.dataLayer = window.dataLayer || [];
    function gtag() {
      window.dataLayer.push(arguments);
    }
    gtag("js", new Date());
    gtag("config", process.env.NEXT_PUBLIC_GTAG);
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <Script
        id="gtag"
        strategy="afterInteractive"
        src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GTAG}`}
      />
      <Component {...pageProps} />
    </QueryClientProvider>
  );
}