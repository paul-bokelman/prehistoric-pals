import { expect } from "chai";
import { ethers } from "hardhat";
import type { Dino } from "../typechain";

describe("Prehistoric Pals (PPALS)", async () => {
  let dinoInstance: Dino;

  it("Should deploy contract and return address", async () => {
    const Dino = await ethers.getContractFactory("Dino");
    const dino = await Dino.deploy();
    await dino.deployed();
    dinoInstance = dino;
    expect(dino.address).to.be.a("string");
  });

  it("Should mint token to signer", async () => {
    // 5 tokens?
    const [_, signer] = await ethers.getSigners();
    const dino = dinoInstance.connect(signer);
    await dino.safeMint(signer.address, "1/1", {
      value: ethers.utils.parseEther("15"),
    });

    const contractBalance = await dino.balanceOf(signer.address);
    expect(contractBalance.toString()).to.equal("1");
    expect(await dino.ownerOf(1)).to.equal(signer.address);
  });

  it("Should return token uri for 1", async () => {
    const dino = dinoInstance;
    expect(await dino.tokenURI(1)).to.equal(
      "https://prehistoric-pals.s3.amazonaws.com/dinos/1/1"
    );
  });

  it("Should return all of signers token uris", async () => {
    const [_, signer] = await ethers.getSigners();
    const dino = dinoInstance.connect(signer);
    const tokens = Array.from(
      Array((await dino.balanceOf(signer.address)).toNumber()).keys()
    );
    const uris = await Promise.all(
      tokens.map(async (i) => {
        return await dino.tokenURI(i + 1);
      })
    );

    expect(uris).to.deep.equal(
      tokens.map((i) => {
        return `https://prehistoric-pals.s3.amazonaws.com/dinos/${i + 1}/${
          i + 1
        }`;
      })
    );
  });

  it("Should withdraw funds", async () => {
    const [owner] = await ethers.getSigners();
    const dino = dinoInstance.connect(owner);
    const initialBalance = ethers.utils.formatEther(await owner.getBalance());
    await dino.withdrawFunds();
    const finalBalance = ethers.utils.formatEther(await owner.getBalance());
    expect(Number(finalBalance)).to.be.greaterThanOrEqual(
      Number(initialBalance)
    );
  });

  it("Should fail because of insufficient funds", async () => {
    const [_, signer] = await ethers.getSigners();
    const dino = dinoInstance.connect(signer);
    await expect(
      dino.safeMint(signer.address, "uri", {
        value: ethers.utils.parseEther("10"), // should be 15 ether
      })
    ).to.be.revertedWith("Dino price is 15 MATIC");
  });

  it("Should fail because only owner can call withdraw", async () => {
    const [_, signer] = await ethers.getSigners();
    const dino = dinoInstance.connect(signer);
    await expect(dino.withdrawFunds()).to.be.revertedWith(
      "Ownable: caller is not the owner"
    );
  });
});
