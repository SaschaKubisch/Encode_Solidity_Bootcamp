import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { expect } from "chai";
import { ethers } from "hardhat";
import { Ballot } from "../typechain-types/Ballot";

const PROPOSALS = ["Vanilla", "Choco", "Nutty"];

function convertStringArrayToBytes32(array: string[]) {
    const bytes32Array = [];
    for (let index = 0; index < array.length; index++) {
      bytes32Array.push(ethers.utils.formatBytes32String(array[index]));
    }
    return bytes32Array;
  }

describe("Ballot", async () => {
    let ballotContract: Ballot;
    let accounts: SignerWithAddress[];
    beforeEach(async () => {
        accounts = await ethers.getSigners();
        const ballotContractFactory = await ethers.getContractFactory("Ballot");
        ballotContract = await ballotContractFactory.deploy(convertStringArrayToBytes32(PROPOSALS));
    });
    describe("When contract is deployed", async () => {
        it("Has the provided proposals", async () => {
            for (let index = 0; index < PROPOSALS.length; index++) {
                const proposal = await ballotContract.proposals(index);
                expect(ethers.utils.parseBytes32String(proposal.name)).to.eq(PROPOSALS[index]);
            }   
        });

        it("sets deployer as chairperson",async () => {
            const chairperson = await ballotContract.chairperson();
            expect(chairperson).to.eq(accounts[0].address);
        });

        it("sets voting weight for chairperson as 1",async () => {
            const chairperson = await ballotContract.voters(accounts[0].address);

            expect(chairperson.weight).to.eq(1);
        });
    });
});