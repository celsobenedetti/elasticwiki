import { type AppType } from "next/app";
import Head from "next/head";

import "@/styles/globals.css";
import { api } from "@/lib/api";

import Header from "@/components/Header";
import { ThemeHandler } from "@/store/theme";

const MyApp: AppType = ({ Component, pageProps }) => {
  return (
    <>
      <Head>
        <title>Elasticwiki</title>
        <meta name="description" content="Elasticsearch web client" />

        <link
          about="favicon"
          rel="icon"
          href="data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>📖</text></svg>"
        />
      </Head>

      <ThemeHandler />

      <Header />
      <Component {...pageProps} />
    </>
  );
};

export default api.withTRPC(MyApp);
