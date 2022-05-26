import type { AppProps as NextAppProps } from "next/app";
import type { AuthenticatedUser } from "lib/api";
import App from "next/app";
import "tailwindcss/tailwind.css";
import { ChainProvider, AuthProvider } from "context";
import { getUser } from "lib/auth";

interface AppProps extends NextAppProps {
  user: AuthenticatedUser | null;
}

const PrehistoricPals = ({ Component, pageProps, user }: AppProps) => {
  console.log(user);
  return (
    <AuthProvider sessionUser={user}>
      <ChainProvider>
        <Component {...pageProps} />
      </ChainProvider>
    </AuthProvider>
  );
};

PrehistoricPals.getInitialProps = async (app: any) => {
  const appProps = await App.getInitialProps(app);
  const cookies = app.ctx.req?.cookies;
  const user = cookies ? await getUser({ cookies }) : null;
  return { ...appProps, user };
};

export default PrehistoricPals;
