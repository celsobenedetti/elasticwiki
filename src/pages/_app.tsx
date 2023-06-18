import { type AppType } from "next/app";
import { api } from "@/lib/api";
import "@/styles/globals.css";
import { ThemeProvider } from "@/store/theme";
import Header from "@/components/Header";

const MyApp: AppType = ({ Component, pageProps }) => {
  return (
    <>
      <ThemeProvider />

      <Header />

      <Component {...pageProps} />
    </>
  );
};

export default api.withTRPC(MyApp);
