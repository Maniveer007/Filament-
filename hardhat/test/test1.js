const { ethers } = require("ethers");
require('dotenv').config();
const { expect } = require("chai");
const{abi:tokenabi,bytecode:tokenbytecode}=require('../artifacts/contracts/Token.sol/MyToken.json')
const{abi:loanmanagerabi,bytecode:loanmanagerbytecode}=require('../artifacts/contracts/LoanManager.sol/LoanManager.json')
const{abi:collateralmanagerabi,bytecode:collateralmanagerbytecode}=require('../artifacts/contracts/CollateralManager.sol/CollateralManager.json');
const { Contract } = require("ethers");


describe("Filament test1",function(){

    it("creating wallet instances",async function(){
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

    it("take a loan of 20 USDC",async function(){
        const tx=await this.loancontract.borrowLoan(20)
        await tx.wait();

        expect(Number(await this.tokencontract.balanceOf(this.wallet1.address))).to.equal(20)
    })
    it("revert if repay loan with less funds",async function(){
      const tx1 = await this.tokencontract.transfer(this.wallet2.address,10)  
      await tx1.wait();

         await expect( this.loancontract.repayLoan()).to.be.revertedWith("Insufficient USDC to repay loan")
         const token2 = await this.tokencontract.connect(this.wallet2) 

         const tx2 = await token2.transfer(this.wallet1.address,10)
         await tx2.wait ( ) 

    })

    it("repay loan",async function () {

        const txn2= await this.tokencontract.approve(this.loancontract.target,20);
        await txn2.wait()

        const tx=await this.loancontract.repayLoan()
        await tx.wait()
    })

    

})


