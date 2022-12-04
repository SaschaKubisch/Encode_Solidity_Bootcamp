import { ethers } from "hardhat";
import { arrayBuffer } from "stream/consumers";
import { MyToken__factory } from "../typechain-types";


const TEST_MINT_VALUE = ethers.utils.parseEther("0.000001");


async function main() {
    const accounts = await ethers.getSigners();
    const [minter, voter, other] = accounts;
    const contractFactory = new MyToken__factory(minter);
    const contract = await contractFactory.deploy();
    await contract.deployed();
    console.log(`Tokenized Votes contract deployed at ${contract.address}`);
    let voterTokenBalance = await contract.balanceOf(voter.address);
    console.log(`The voter starts with ${voterTokenBalance} decimals of balance`);
    const mintTx = await contract.mint(voter.address, TEST_MINT_VALUE);
    await mintTx.wait();
    voterTokenBalance = await contract.balanceOf(voter.address);
    console.log(`The voter balance after mint is ${voterTokenBalance} decimals`);
    let votePower = await contract.getVotes(voter.address);
    console.log(`The voter's vote power is ${votePower}`);
    const delegateTx = await contract.connect(voter).delegate(voter.address);
    await delegateTx.wait();
    votePower = await contract.getVotes(voter.address);
    console.log(`The voter's vote power is ${votePower}`);
    const transferTx = await contract.connect(voter).transfer(other.address, TEST_MINT_VALUE.div(2));
    await transferTx.wait();
    votePower = await contract.getVotes(voter.address);
    let votePowerOther = await contract.getVotes(other.address);
    console.log(`The voter's vote power is ${votePower}`);
    console.log(`The others's vote power is ${votePowerOther}`);
    const currentBlock = await ethers.provider.getBlock("latest");
    for(let blockNumber = currentBlock.number-1; blockNumber >= 0; blockNumber--) {
        const pastVotePower =  await contract.getPastVotes(voter.address, blockNumber);
        console.log(`At blocknumber ${blockNumber} vote power is ${pastVotePower}`);
    }


}


main().catch(err => {
    console.error(err);
    process.exitCode = 1;
});