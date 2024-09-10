import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
    return (
      <Html lang="pt-br">
        <Head>
          <title>SalãoCondo</title>
          <meta name="description" content="Sistema de agendamento de salão de festa"/>
          <meta name="keywords" content="festa, condominio, salao, agendamento, fatec"/>
          <meta name="viewport" content="width=device-width, initial-scale=1.0"></meta>
          <link rel="icon" href="Icon.svg"/>
          <link
            rel="stylesheet"
            href="https://cdnjs.cloudflare.com/ajax/libs/nprogress/0.2.0/nprogress.min.css"
            integrity="sha512-42kB9yDlYiCEfx2xVwq0q7hT4uf26FUgSIZBK8uiaEnTdShXjwr8Ip1V4xGJMg3mHkUt9nNuTDxunHF0/EgxLQ=="
            crossOrigin="anonymous" 
            referrerPolicy="no-referrer"
            />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
  
