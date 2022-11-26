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
    const params = args.slice(2);
    const contractAddress = params[0];
    const targetAccount = params[1];

    let ballotContract: Ballot;
    const ballotContractFactory = new Ballot__factory(signer);
    ballotContract = ballotContractFactory.attach(contractAddress);
    const tx = await ballotContract.giveRightToVote(targetAccount);
    const receipt = await tx.wait();
    console.log({receipt});

}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});