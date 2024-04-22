// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./LoanManager.sol";

contract CollateralManager {

    mapping(address => uint) deposits;
    LoanManager loanManager;

    event DepositMade(address indexed user, uint amount);
    event CollateralWithdrawn(address indexed user, uint amount);
    event Liquidation(address indexed user, address indexed to);


    function depositCollateral() public payable {
        deposits[msg.sender] += msg.value;
        emit DepositMade(msg.sender,msg.value);
    }

    function setLoanManager(address _loanManager) public {
        require(address(loanManager) == address(0), "Can only be changed once");
        loanManager = LoanManager(_loanManager);
    }

    function getDeposits(address from) public view returns(uint) {
        return deposits[from];
    }

    function withdrawCollateral(uint amount) public {
        require(amount<=deposits[msg.sender],"dont have enough collateral");
        uint remainingAmount = deposits[msg.sender] - amount;
        uint remainingAmountInUSDC = remainingAmount * loanManager.getEthToUsdcPrice() / 10**18;

        require(remainingAmountInUSDC >= loanManager.getLoanDetails(msg.sender).amount, "Cannot withdraw more than loan amount");
        deposits[msg.sender]-=amount;
        payable(msg.sender).transfer(amount);
        emit CollateralWithdrawn(msg.sender,amount);
    }

    function liquidate(address from, address to) public onlyLoanManager {
        deposits[to] += deposits[from];
        deposits[from] = 0;

        emit Liquidation(from,to);
    }

    modifier onlyLoanManager() {
        require(msg.sender == address(loanManager), "Only LoanManager can call this function");
        _;
    }

    
}
