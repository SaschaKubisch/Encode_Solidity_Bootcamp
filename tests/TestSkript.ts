import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { expect } from "chai";
import { ethers } from "hardhat";
import { HelloWorld } from "../typechain-types";

describe("HelloWorld", async () => {
    let helloWorldContract: HelloWorld;
    let signers: SignerWithAddress[];
    
    beforeEach( async () => {
        signers = await ethers.getSigners();
        const helloWorldFactory = await ethers.getContractFactory("HelloWorld");
        helloWorldContract = await helloWorldFactory.deploy() as HelloWorld;
        await helloWorldContract.deployed();
    });

    it("Should give a Hello World", async ()  => {
        const text = await helloWorldContract.helloWorld();
        expect(text).to.equal("Hello World");
    })

    it("Should set owner to deployer account", async () => {
        const owner = await helloWorldContract.owner();
        const deployer = signers[0].address;
        expect(owner).to.equal(deployer);
    })

    it("Should change text correctly", async () => {
        const newText = "Hi There"
        const tx = await helloWorldContract.setText(newText);
        await tx.wait();
        const response = await helloWorldContract.helloWorld();
        expect(response).to.equal(newText);
    });

    it("Should not allow anyone other than owner to change text", async () => {
        const newText = "Hi There"
        await expect(helloWorldContract.connect(signers[1]).setText(newText)).to.be.reverted;
      });
});