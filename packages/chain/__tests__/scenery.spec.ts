import { expect } from "chai";
import { ethers } from "hardhat";
import type { Scenery } from "../typechain";

describe("Prehistoric Pals Scenery (PPALSS)", function () {
  let sceneryInstance: Scenery;

  it("Should deploy contract and return address", async () => {
    const Scenery = await ethers.getContractFactory("Scenery");
    const scenery = await Scenery.deploy();
    await scenery.deployed();
    sceneryInstance = scenery;
    expect(scenery.address).to.be.a("string");
  });

  it("Should mint token to signer", async () => {
    // 5 tokens?
    const [_, signer] = await ethers.getSigners();
    const scenery = sceneryInstance.connect(signer);
    await scenery.safeMint(signer.address, "1/1", {
      value: ethers.utils.parseEther("10"),
    });

    const contractBalance = await scenery.balanceOf(signer.address);
    expect(contractBalance.toString()).to.equal("1");
    expect(await scenery.ownerOf(1)).to.equal(signer.address);
  });

  it("Should return token uri for 1", async () => {
    const scenery = sceneryInstance;
    expect(await scenery.tokenURI(1)).to.equal(
      "https://prehistoric-pals.s3.amazonaws.com/scenery/1/1"
    );
  });

  it("Should return all of signers token uris", async () => {
    const [_, signer] = await ethers.getSigners();
    const scenery = sceneryInstance.connect(signer);
    const tokens = Array.from(
      Array((await scenery.balanceOf(signer.address)).toNumber()).keys()
    );
    const uris = await Promise.all(
      tokens.map(async (i) => {
        return await scenery.tokenURI(i + 1);
      })
    );

    expect(uris).to.deep.equal(
      tokens.map((i) => {
        return `https://prehistoric-pals.s3.amazonaws.com/scenery/${i + 1}/${
          i + 1
        }`;
      })
    );
  });

  it("Should withdraw funds", async () => {
    const [owner] = await ethers.getSigners();
    const scenery = sceneryInstance.connect(owner);
    const initialBalance = ethers.utils.formatEther(await owner.getBalance());
    await scenery.withdrawFunds();
    const finalBalance = ethers.utils.formatEther(await owner.getBalance());
    expect(Number(finalBalance)).to.be.greaterThanOrEqual(
      Number(initialBalance)
    );
  });

  it("Should fail because of insufficient funds", async () => {
    const [_, signer] = await ethers.getSigners();
    const scenery = sceneryInstance.connect(signer);
    await expect(
      scenery.safeMint(signer.address, "uri", {
        value: ethers.utils.parseEther("8"), // should be 10 ether
      })
    ).to.be.revertedWith("Scenery price is 10 MATIC");
  });

  it("Should fail because only owner can call withdraw", async () => {
    const [_, signer] = await ethers.getSigners();
    const scenery = sceneryInstance.connect(signer);
    await expect(scenery.withdrawFunds()).to.be.revertedWith(
      "Ownable: caller is not the owner"
    );
  });
});
