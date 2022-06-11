import type { AxiosRequestHeaders } from "axios";
import type { NextApiRequest } from "next";
import { auth, user } from ".";

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

export const api = { auth, user };
