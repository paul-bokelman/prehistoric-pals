import type { NextPage } from "next";
import { useChainContext, useAuthContext } from "context";
const Home: NextPage = () => {
  const { signer, address, mint, connect } = useChainContext();
  const { user } = useAuthContext();

  return (
    <div>
      <button onClick={async () => connect()}>login w meta</button>
      {/* <button onClick={async () => await mint({ contractName: "dino" })}>
        mint
      </button> */}
      <h1>{address}</h1>
      <p>{user && user.id}</p>
    </div>
  );
};

export default Home;
