import { GetServerSideProps, GetServerSidePropsContext, GetServerSidePropsResult } from "next";
import { parseCookies } from "nookies";

export function canSSRGuest<P>(fn: GetServerSideProps<P>) {
  return async (ctx: GetServerSidePropsContext): Promise<GetServerSidePropsResult<P>> => {
    const cookies = parseCookies(ctx);
    if (cookies["@SalaoCondo.token"]) {
      return {
        redirect: {
          destination: "/reservation",
          permanent: false
        }
      };
    }
    return await fn(ctx);
  };
}
