import type { AppProps } from "next/app";

// Import "../style/ter-windows.css";
import "@xterm/xterm/css/xterm.css";

export default function App({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />;
}
