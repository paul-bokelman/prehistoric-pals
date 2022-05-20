import { ethers, waffle } from "hardhat";

async function main() {
  const [owner] = await ethers.getSigners();

  const Dino = await ethers.getContractFactory("Dino");

  const dino = Dino.attach("0x5FbDB2315678afecb367f032d93F642f64180aa3");

  const provider = waffle.provider;
  const balanceInWei = await provider.getBalance(dino.address);
  console.log(ethers.utils.formatEther(balanceInWei));

  const tx = await dino.withdrawFunds();

  const receipt = await tx.wait();

  console.log(receipt);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
