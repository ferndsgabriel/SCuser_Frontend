import { AppProps } from "next/app";
import  "../../styles/globals.scss";
import { AuthProvider } from "../contexts/AuthContexts";
import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { LoadingProvider } from "../contexts/LoadingContexts";
import NProgress from "nprogress";
import Router from "next/router";
import Head from "next/head";

NProgress.configure({
  showSpinner: true,
  trickleSpeed: 300,
});
Router.events.on("routeChangeStart", (url)=>{
  NProgress.start()
})
Router.events.on("routeChangeComplete", (url)=>{
    NProgress.done(false)
  });
Router.events.on('routeChangeError', () => NProgress.done());


  export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <link
        rel="stylesheet"
        href="https://cdnjs.cloudflare.com/ajax/libs/nprogress/0.2.0/nprogress.min.css"
        integrity="sha512-42kB9yDlYiCEfx2xVwq0q7hT4uf26FUgSIZBK8uiaEnTdShXjwr8Ip1V4xGJMg3mHkUt9nNuTDxunHF0/EgxLQ=="
        crossOrigin="anonymous"
        referrerPolicy="no-referrer"
        />
        <link rel="icon" href="Icon.svg"/>
        <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-9165545721062643"></script>
        <meta name="google-adsense-account" content="ca-pub-9165545721062643"></meta>
      </Head>
      <ToastContainer
        position="bottom-center"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
      <AuthProvider>
        <LoadingProvider>
          <Component {...pageProps} />
        </LoadingProvider>
      </AuthProvider>
    </>
  );
}