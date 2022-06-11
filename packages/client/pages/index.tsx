import type { NextPage } from "next";
import { useEffect, useState } from "react";
import { useChainContext, useAuthContext } from "context";
const Home: NextPage = () => {
  const { signer, address, connect, connectWithSession } = useChainContext();
  const { user, loggedIn } = useAuthContext();

  useEffect(() => {
    if (loggedIn) {
      connectWithSession();
    }
  }, []);

  return (
    <div className="h-screen w-screen fixed bg-black flex items-center justify-center">
      <h1 className="text-white text-5xl italic">Prehistoric Pals</h1>
    </div>
  );
};

export default Home;
