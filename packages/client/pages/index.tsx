import type { NextPage } from "next";
import { useEffect } from "react";
import { useChainContext } from "context";

const Home: NextPage = () => {
  const { signer, address, mint } = useChainContext();

  useEffect(() => {
    const test = async () => {
      const add = await signer?.getAddress();
      console.log(add);
    };
    test().catch(console.log);
  }, [signer]);

  return (
    <div>
      <button onClick={async () => await mint({ contractName: "dino" })}>
        mint
      </button>
      <h1>{address}</h1>
    </div>
  );
};

export default Home;
