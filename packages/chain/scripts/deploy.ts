import { ethers } from "hardhat";

async function main() {
  const Dino = await ethers.getContractFactory("Dino");
  const Scenery = await ethers.getContractFactory("Scenery");

  const dino = await Dino.deploy();
  const scenery = await Scenery.deploy();

  await dino.deployed();
  await scenery.deployed();

  console.log("Dino contract deployed to:", dino.address);
  console.log("Scenery contract deployed to:", scenery.address);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
