import { type AppType } from "next/app";
import { api } from "@/lib/api";
import "@/styles/globals.css";
import { ThemeProvider } from "@/store/theme";

const MyApp: AppType = ({ Component, pageProps }) => {
  return (
    <>
      <ThemeProvider />
      <Component {...pageProps} />
    </>
  );
};

export default api.withTRPC(MyApp);
