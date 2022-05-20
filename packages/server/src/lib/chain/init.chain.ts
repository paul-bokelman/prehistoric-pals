import { ethers } from "ethers";
import type {
  Dino as DinoContract,
  Scenery as SceneryContract,
} from "contracts/typechain";
import Dino from "contracts/artifacts/contracts/Dino.sol/Dino.json";
import Scenery from "contracts/artifacts/contracts/Scenery.sol/Scenery.json";

declare global {
  interface Window {
    ethereum: any;
  }
}

type InitializeChainPayload = {
  provider: ethers.providers.JsonRpcProvider;
  owner: ethers.Signer;
  contracts: {
    dino: DinoContract;
    scenery: SceneryContract;
  };
};
type InitializeChain = () => Promise<InitializeChainPayload>;

export const initializeChain: InitializeChain = async () => {
  const provider = new ethers.providers.JsonRpcProvider();

  const owner = provider.getSigner(
    "0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266"
  );
  const signer = provider.getSigner(
    "0x70997970c51812dc3a010c7d01b50e0d17dc79c8"
  );

  const dino = new ethers.Contract(
    process.env.DINO_CONTRACT_ADDRESS || "",
    Dino.abi,
    owner
  ) as DinoContract;

  const scenery = new ethers.Contract(
    process.env.SCENERY_CONTRACT_ADDRESS || "",
    Scenery.abi,
    owner
  ) as SceneryContract;

  return { provider, owner, contracts: { dino, scenery } };
};
