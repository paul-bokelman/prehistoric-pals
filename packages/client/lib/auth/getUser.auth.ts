import type { NextApiRequest } from "next";
import { AuthenticatedUser, validateCookie } from "lib/sdk";

import { ppals } from "lib/sdk";

type GetUser = ({
  cookies,
}: {
  cookies: NextApiRequest["cookies"];
}) => Promise<AuthenticatedUser | null>;

export const getUser: GetUser = async ({ cookies }) => {
  const token = cookies?.token;
  if (!token) return null;

  try {
    const user = await ppals.user.get({ token });
    if (!user) return null;
    return user;
  } catch (error) {
    console.log(error);
    return null;
  }
};