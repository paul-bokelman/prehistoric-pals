import { ethers } from "hardhat";

async function main() {
  const Dino = await ethers.getContractFactory("Dino");

  const dino = await Dino.deploy();

  await dino.deployed();

  console.log("Dino contract deployed to:", dino.address);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
