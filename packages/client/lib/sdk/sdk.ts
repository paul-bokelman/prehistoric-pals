import type { AxiosRequestHeaders } from "axios";
import type { GetServerSidePropsContext, NextApiRequest } from "next";
import { dino, auth, user } from ".";

export const url = (path: string) => {
  return `${process.env.NEXT_PUBLIC_API_URL}${path}`;
};

export const authHeaders = (token: string, headers?: AxiosRequestHeaders) => {
  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};

export const validateCookie = ({
  cookies,
}: {
  cookies: NextApiRequest["cookies"];
}): { Cookie: string } | false => {
  const sessionID = cookies?.["connect.sid"];
  return sessionID
    ? {
        Cookie: `connect.sid=${sessionID}`,
      }
    : false;
};

export const ppals = { dino, auth, user };
