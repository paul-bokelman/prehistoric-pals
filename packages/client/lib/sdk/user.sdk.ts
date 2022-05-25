import axios from "axios";
import { url, authHeaders } from ".";

// type Error = { error: boolean; message?: string }; // this needs to be addressed

export type AuthenticatedUser = {
  // this should be connected to User Schema
  id: string;
  address: string;
  nonce: string;
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
    const r = await axios.get<AuthenticatedUser>(url("/user"), {
      withCredentials: true,
      headers: {
        authorization: `Bearer ${token}`,
      },
    });
    console.log(r);
    return r.data;
  } catch (error) {
    console.log(error);

    // throw error?
    return null;
  }
};

export const user: UserSDK = {
  // should get token here?
  get,
};
