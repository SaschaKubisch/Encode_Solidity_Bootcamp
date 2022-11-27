import {ethers} from "hardhat";
import * as dotenv from "dotenv";
import { MyERC20__factory } from "../typechain-types";
dotenv.config;

async function main() {
    const accounts = await ethers.getSigners();
    const erc20TokenFactory = new MyERC20__factory(accounts[0]);
    const erc20TokenContract = await erc20TokenFactory.deploy();
    await erc20TokenContract.deployed();
    console.log(`contract deployed at address ${erc20TokenContract.address}`);

    const mintTx = await erc20TokenContract.mint(accounts[0].address, 10);
    const totalSupply = await erc20TokenContract.totalSupply();
    console.log(`Total supply ${totalSupply}`);

    const balance01 = await erc20TokenContract.balanceOf(accounts[0].address);
    console.log(`Balance01 ${balance01}`);
    const transferTx = await erc20TokenContract.transfer(accounts[1].address, 1);
    await transferTx.wait();
    const balance02 = await erc20TokenContract.balanceOf(accounts[0].address);
    console.log(`Balance02 ${balance02}`);
    const balance12 = await erc20TokenContract.balanceOf(accounts[1].address);
    console.log(`Balance12 ${balance12}`);
    const balance03 = await erc20TokenContract.balanceOf(accounts[0].address);
    console.log(`Balance03 ${balance03}`);

}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
    })