// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

// import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";
import "@chainlink/contracts/src/v0.8/shared/interfaces/AggregatorV3Interface.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "./CollateralManager.sol";

contract LoanManager {

    struct Loan {
        address borrower;
        uint amount;
        uint borrowTime;
    }

    AggregatorV3Interface priceFeed;
    CollateralManager collateralManager;
    IERC20 usdc;

    constructor(address _priceFeed, address _collateralManager, address _usdc) {
        priceFeed = AggregatorV3Interface(_priceFeed);
        collateralManager = CollateralManager(_collateralManager);
        collateralManager.setLoanManager(address(this));
        usdc = IERC20(_usdc);
    }

    event LoanBorrowed(address indexed user, uint amount);
    event LoanRepaid(address indexed user, uint amount);
    event LoanLiquidated(address indexed user, address indexed liquidator, uint amount);

    mapping (address => Loan) public loanDetails;
    
    uint LTV = 75;
    uint INTEREST_RATE = 5;

    function borrowLoan(uint amount) public {
        require(loanDetails[msg.sender].amount == 0, "Already borrowed funds");
        require(collateralManager.getDeposits(msg.sender) >= 0, "Does not have any collateral");
        require(amount <= (totalValueInUSDC(msg.sender)) * LTV / 100, "Loan amount exceeds the limit that can be given to user collateral");

        loanDetails[msg.sender] = Loan(msg.sender, amount, block.timestamp);
        usdc.transfer(msg.sender, amount); 
        emit LoanBorrowed(msg.sender,amount);
    }

    function repayLoan() public payable {
        require(loanDetails[msg.sender].amount != 0, "No loan left to repay");

        Loan memory loan = loanDetails[msg.sender];

        uint totalAmount = loan.amount + calculateInterest(loan);
        require(IERC20(usdc).balanceOf(msg.sender) >= totalAmount, "Insufficient USDC to repay loan");

        IERC20(usdc).transferFrom(msg.sender, address(this), totalAmount);

        delete loanDetails[msg.sender];
        emit LoanRepaid(msg.sender,totalAmount);
    }

    function calculateInterest(Loan memory loan) internal view returns (uint256) {
        uint256 timeElapsed = block.timestamp - loan.borrowTime;
        uint256 yearsElapsed = timeElapsed / (365 days);
        uint256 interestAccrued = loan.amount * INTEREST_RATE * yearsElapsed / 100;
        return interestAccrued;
    }

    function liquidate(address user) public {
        Loan memory userLoan = loanDetails[user];
        require(isLiquidatable(userLoan), "User is not liquidatable");

        delete loanDetails[user];

        uint totalAmount = userLoan.amount + calculateInterest(userLoan);
        require(IERC20(usdc).balanceOf(msg.sender) >= totalAmount, "Insufficient USDC to liquidate loan");

        IERC20(usdc).transferFrom(msg.sender, address(this), totalAmount);
        collateralManager.liquidate(user, msg.sender);

        emit LoanLiquidated(user,msg.sender,totalAmount);
    }

    function isLiquidatable(Loan memory userLoan) public view returns(bool) {
        uint userUsdcCollateral=totalValueInUSDC(userLoan.borrower);

        uint maximumLoanCanBeTaken = userUsdcCollateral * LTV / 100;

        return userLoan.amount >= maximumLoanCanBeTaken;
    }

    function totalValueInUSDC(address from) public view returns(uint) {
        return collateralManager.getDeposits(from) * getEthToUsdcPrice() / 1 ether;
    }

    function getEthToUsdcPrice() public view returns(uint) {
        (, int256 ethPrice,,,) = priceFeed.latestRoundData();
        return uint(ethPrice / 10**8);
    }

    function getLoanDetails(address from) public view returns(Loan memory) {
        return loanDetails[from];
    }
}
