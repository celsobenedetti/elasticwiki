import { type AppType } from "next/app";
import { api } from "@/lib/api";
import "@/styles/globals.css";
import { ThemeProvider } from "@/store/theme";
import Header from "@/components/Header";
import { SearchProvider } from "@/store/search";

const MyApp: AppType = ({ Component, pageProps }) => {
  return (
    <>
      <Header />

      <ThemeProvider />
      <SearchProvider />

      <Component {...pageProps} />
    </>
  );
};

export default api.withTRPC(MyApp);
