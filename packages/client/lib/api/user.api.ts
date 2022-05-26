import axios from "axios";
import { url } from ".";

export type AuthenticatedUser = {
  // this should be connected to User Schema
  id: string;
  address: string;
  nonce: string;
  isAdmin: boolean;
  username: string;
};

type GetUser = ({
  token,
}: {
  token: string;
}) => Promise<AuthenticatedUser | null>;

export interface UserSDK {
  get: GetUser;
}

const get: GetUser = async ({ token }) => {
  try {
    const { data } = await axios.get<AuthenticatedUser>(url("/user"), {
      withCredentials: true,
      headers: {
        authorization: `Bearer ${token}`,
      },
    });
    return data;
  } catch (error) {
    console.log(error);
    throw new Error("An error occurred fetching user");
  }
};

export const user: UserSDK = {
  get,
};
