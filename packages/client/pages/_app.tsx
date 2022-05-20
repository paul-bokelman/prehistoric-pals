import type { AppProps } from "next/app";
import "tailwindcss/tailwind.css";
import { ChainProvider } from "context";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ChainProvider>
      <Component {...pageProps} />
    </ChainProvider>
  );
}

export default MyApp;
