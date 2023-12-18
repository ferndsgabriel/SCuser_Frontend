import { GetServerSideProps, GetServerSidePropsContext, GetServerSidePropsResult } from "next";
import { parseCookies, destroyCookie } from "nookies";
import { AuthTokenError } from "../services/error/AuthTokenError";

export function canSSRAuth<P>(fn: GetServerSideProps<P>) {
  return async (ctx: GetServerSidePropsContext): Promise<GetServerSidePropsResult<P>> => {
    const cookies = parseCookies(ctx);
    const token = cookies["@SalaoCondo.token"];

    if (!token) {
      destroyCookie(ctx, "@SalaoCondo.token"); 
      return {
        redirect: {
          destination: "/",
          permanent: false,
        },
      };
    }
    try {
      return await fn(ctx);
    } catch (err) {
      if (err instanceof AuthTokenError || (err.response && err.response.status === 401)) {
        destroyCookie(ctx, "@SalaoCondo.token"); 
        return {
          redirect: {
            destination: "/",
            permanent: false,
          },
        };
      }
      throw err; 
    }
  };
}
