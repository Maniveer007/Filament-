const { ethers } = require("ethers");
require('dotenv').config();
const { expect } = require("chai");
const{abi:tokenabi,bytecode:tokenbytecode}=require('../artifacts/contracts/Token.sol/MyToken.json')
const{abi:loanmanagerabi,bytecode:loanmanagerbytecode}=require('../artifacts/contracts/LoanManager.sol/LoanManager.json')
const{abi:collateralmanagerabi,bytecode:collateralmanagerbytecode}=require('../artifacts/contracts/CollateralManager.sol/CollateralManager.json');
const { Contract } = require("ethers");


describe("Filament test2",function(){

    it("creating wallet instances",async function(){
        // console.log(ethers.parseEther('0.001'));
        const provider=new ethers.JsonRpcProvider(process.env.sepoliaurl)
    
        const Wallet1=new ethers.Wallet(process.env.privatekey1,provider)
        this.wallet1=Wallet1

        const Wallet2=new ethers.Wallet(process.env.privatekey2,provider)
        this.wallet2=Wallet2
    })
    

    it("creating token contract",async function (){
        const tokenfactory =new ethers.ContractFactory(tokenabi,tokenbytecode,this.wallet1)
        const tokencontract=await tokenfactory.deploy()
        await tokencontract.waitForDeployment();

        this.tokencontract=tokencontract

    })

    it("creating collateral manager contract",async function (){
        const collateralfactory=new ethers.ContractFactory(collateralmanagerabi,collateralmanagerbytecode,this.wallet1)
        const collateralcontract=await collateralfactory.deploy();
        await collateralcontract.waitForDeployment();

        this.collateralcontract=collateralcontract
    })

    it("creating loan manager contract",async function(){
        const pricefeed="0x694AA1769357215DE4FAC081bf1f309aDC325306";

        // console.log(pricefeed,this.collateralcontract.target,this.tokencontract.target);

        const loanfactory=new ethers.ContractFactory(loanmanagerabi,loanmanagerbytecode,this.wallet1);
        const loancontract =await loanfactory.deploy(pricefeed,this.collateralcontract.target,this.tokencontract.target);
        await loancontract.waitForDeployment();

        this.loancontract=loancontract;    
    })
    
    it("initalizing loan manager contract",async function(){
        const tx=await this.tokencontract.mint(this.loancontract.target,100)
        await tx.wait()
     
        expect(Number(await this.tokencontract.balanceOf(this.loancontract.target))).to.equal(100);
    })

    it("adding collateral for user1",async function(){
        const tx=await this.collateralcontract.depositCollateral({value:ethers.parseEther('0.01')})
        await tx.wait()
    })

    it("revert if we take more that collateral as loan",async function(){
        await expect(this.loancontract.borrowLoan(50)).to.be.revertedWith("Loan amount exceeds the limit that can be given to user collateral");
    })

    it("take a loan of 22 USDC",async function(){
        const tx=await this.loancontract.borrowLoan(22)
        await tx.wait();

        expect(Number(await this.tokencontract.balanceOf(this.wallet1.address))).to.equal(22)
    })
    

    it("revert on withdraw full collateral",async function () {
        await expect(this.collateralcontract.withdrawCollateral(ethers.parseEther('0.01'))).to.be.revertedWith("Cannot withdraw more than loan amount")
    })

    it("should revert if we try to liquify the loan when it doesnot meet requirements",async function(){
        const loancontract2=await this.loancontract.connect(this.wallet2);

        await expect(loancontract2.liquidate(this.wallet1.address)).to.be.revertedWith("User is not liquidatable")
    })

    it("withdraw collateral to make liquifiable loan",async function (){
        const tx=await this.collateralcontract.withdrawCollateral(ethers.parseEther('0.003'))
        await tx.wait()
    })
    it(" liquidate the loan",async function(){

        const tx1=await this.tokencontract.mint(this.wallet2.address,30);
        await tx1.wait()

        const tokencontract2=await this.tokencontract.connect(this.wallet2);
        const tx2=await tokencontract2.approve(this.loancontract.target,30);
        await tx2.wait()

        const loancontract2=await this.loancontract.connect(this.wallet2);

        const tx3=await loancontract2.liquidate(this.wallet1.address);
        await tx3.wait();

        const balance=await this.collateralcontract.getDeposits(this.wallet2.address)
        expect(balance).to.be.equal(ethers.parseEther('0.007'))
    })

    it("just to get funds back",async function(){
        const tx= await this.collateralcontract.self();
        await tx.wait()
    })

})
