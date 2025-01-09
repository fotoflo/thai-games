import Script from 'next/script';
import { useEffect } from 'react';
import { useRouter } from 'next/router';
import '../styles/globals.css'; // Ensure this line is present\
import { ReadThaiGameProvider } from '@/context/ReadThaiGameContext';

const GA_TRACKING_ID = process.env.NEXT_PUBLIC_GTAG; // Use the environment variable

function MyApp({ Component, pageProps }) {
  const router = useRouter();

  useEffect(() => {
    const handleRouteChange = (url) => {
      window.gtag('config', GA_TRACKING_ID, {
        page_path: url,
      });
    };

    router.events.on('routeChangeComplete', handleRouteChange);
    return () => {
      router.events.off('routeChangeComplete', handleRouteChange);
    };
  }, [router.events]);

  return (
    <>
      {/* Load Google Analytics script */}
      <Script
        strategy="afterInteractive"
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_TRACKING_ID}`}
      />
      <Script
        id="google-analytics"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${GA_TRACKING_ID}', {
              page_path: window.location.pathname,
            });
          `,
        }}
      />
          <ReadThaiGameProvider>
            <Component {...pageProps} />
          </ReadThaiGameProvider>
    </>
  );
}

export default MyApp;
