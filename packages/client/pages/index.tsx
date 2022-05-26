import type { NextPage } from "next";
import { useEffect, useState } from "react";
import { useChainContext, useAuthContext } from "context";
const Home: NextPage = () => {
  const { signer, address, mint, connect, connectWithSession } =
    useChainContext();
  const { user, loggedIn } = useAuthContext();

  useEffect(() => {
    if (loggedIn) {
      connectWithSession();
    }
  }, []);

  return (
    <div className="h-screen w-screen flex flex-col items-center justify-center">
      <h1 className="text-3xl font-bold">Prehistoric Pals</h1>
      <button onClick={async () => connect()}>login w meta</button>
      <button onClick={async () => await mint({ contractName: "dino" })}>
        mint
      </button>
      <h1>{address}</h1>
      <p>{user && user.id}</p>
    </div>
  );
};

export default Home;
