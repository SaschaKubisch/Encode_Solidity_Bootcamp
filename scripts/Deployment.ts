import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { ethers } from "hardhat";
import { Ballot } from "../typechain-types";


async function main() {

    let ballotContract: Ballot;

}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});