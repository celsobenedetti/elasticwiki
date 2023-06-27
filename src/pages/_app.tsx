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
        <title>ElasticWiki 📑</title>
        <meta name="description" content="Elasticsearch web client" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <ThemeHandler />

      <Header />
      <Component {...pageProps} />
    </>
  );
};

export default api.withTRPC(MyApp);
