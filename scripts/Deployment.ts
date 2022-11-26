import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { ethers, Wallet } from "ethers";
import { Ballot, Ballot__factory } from "../typechain-types";
import * as dotenv from "dotenv";
dotenv.config();


// const PROPOSALS = ["Vanilla", "Choco", "Nutty"];

function convertStringArrayToBytes32(array: string[]) {
    const bytes32Array = [];
    for (let index = 0; index < array.length; index++) {
      bytes32Array.push(ethers.utils.formatBytes32String(array[index]));
    }
    return bytes32Array;
  }


async function main() {
    const provider = ethers.getDefaultProvider("goerli");
    
    // const wallet = new ethers.Wallet.fromMnemonic(process.env.MNEMONIC ?? "");
    let mnemonic = 'other birth logic scrub leaf sentence health minute bag misery motion want';
    let wallet = ethers.Wallet.fromMnemonic(mnemonic);
    
    const signer = wallet.connect(provider);
    console.log(wallet);
    const balanceBN = await signer.getBalance();
    console.log(`Connected to account ${signer.address} with balance ${balanceBN.toString()} Wei`);

    const args = process.argv;
    const proposals = args.slice(2);

    if (proposals.length <= 0 ) throw Error("Not enough args");
    console.log("Deploying Ballot contract");
    console.log("Proposals: ");
    proposals.forEach((element, index) => {
      console.log(`Proposal N. ${index + 1}: ${element}`);
    });

    let ballotContract: Ballot;
    // let accounts: SignerWithAddress[];
    // accounts = await ethers.getSigners();
    const ballotContractFactory = new Ballot__factory(signer);
    ballotContract = await ballotContractFactory.deploy(convertStringArrayToBytes32(proposals));
    await ballotContract.deployed();
    console.log(`The contract was deployed at the address ${ballotContract.address}`);
    const chairperson = await ballotContract.chairperson();
    console.log(`The chairperson is ${chairperson}`);

}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});