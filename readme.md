# Filament

### Testing the smart contracts 
 
 clone the repo
 ```
  git clone https://github.com/Maniveer007/Filament-.git
 ```

 install dependency
 ```
 cd hardhat
 npm install
 ```

 create .env file and add this information
 ```
privatekey1=
privatekey2=
sepoliaurl=
 ```

 private key used for testing because we used chainlinks price feed on sepolia testnet so we cannot run on hardhat local node so we are using private keys to test on sepolia testnet

 run tests 
 ```
npx hardhat test
 ```




# Working of smart contracts

## LoanManager Smart Contract Documentation

## Purpose
This smart contract manages loans in a decentralized lending protocol.

## Features
- Users can borrow USDC tokens by depositing ETH as collateral.
- The contract uses a Chainlink oracle to get the ETH/USDC exchange rate.
- Loan Manager can only be set once to prevent unauthorized access.
- Users can repay their loans with interest.
- The contract allows liquidation of undercollateralized loans by anyone with enough USDC.

## Dependencies
- AggregatorV3Interface: Chainlink oracle contract for getting ETH/USDC price.
- IERC20: OpenZeppelin interface for ERC20 tokens (used for USDC).
- CollateralManager: The contract managing collateral deposits.

## Variables
- `priceFeed`: AggregatorV3Interface contract for getting ETH/USDC price.
- `collateralManager`: Address of the CollateralManager contract.
- `usdc`: IERC20 interface representing the USDC token.
- `loanDetails`: Mapping that stores loan information for each user (borrower address, loan amount, and borrow time).
- `LTV`: Loan-to-Value ratio (percentage of collateral required for a loan).
- `INTEREST_RATE`: Annual interest rate for loans.

## Events
- `LoanBorrowed(address indexed user, uint amount)`: Emitted when a user borrows USDC.
- `LoanRepaid(address indexed user, uint amount)`: Emitted when a user repays their loan.
- `LoanLiquidated(address indexed user, address indexed liquidator, uint amount)`: Emitted when a user's loan is liquidated.

## Functions
- `borrowLoan(uint amount)`: Allows users to borrow USDC by depositing ETH as collateral.
- `repayLoan()`: Allows users to repay their loan with interest.
- `calculateInterest(Loan memory loan)`: Calculates the interest accrued on a loan based on the loan amount, interest rate, and time elapsed.
- `liquidate(address user)`: Allows anyone with enough USDC to liquidate a user's undercollateralized loan.
- `isLiquidatable(Loan memory userLoan)`: Checks if a user's loan is undercollateralized and can be liquidated.
- `totalValueInUSDC(address from)`: Calculates the total value of a user's collateral in USDC.
- `getEthToUsdcPrice()`: Fetches the ETH/USDC price from the Chainlink oracle.
- `getLoanDetails(address from)`: Returns the loan details for a user.

# CollateralManager Smart Contract Documentation

## Purpose
This smart contract manages collateral deposits for loans in a decentralized lending protocol.

## Features
- Users can deposit ETH as collateral for loans.
- The contract keeps track of deposited collateral for each user.
- Users can withdraw their collateral partially as long as the remaining amount is sufficient to cover their loan.
- The LoanManager contract can call liquidate to take a user's collateral if their loan becomes undercollateralized.

## Events
- `DepositMade(address indexed user, uint amount)`: Emitted when a user deposits collateral.
- `CollateralWithdrawn(address indexed user, uint amount)`: Emitted when a user withdraws collateral.
- `Liquidation(address indexed user, address indexed to)`: Emitted when a user's collateral is liquidated.

## Function 

- `depositCollateral()`: Allows users to deposit ETH as collateral. Increases the user's deposited collateral amount in the deposits mapping.

- `setLoanManager(address _loanManager)`: Sets the address of the LoanManager contract (can only be called once to prevent unauthorized access).

- `getDeposits(address from)`: Returns the amount of collateral deposited by a user.

- `withdrawCollateral(uint amount)`: Allows users to withdraw their collateral partially. Checks if the user has enough collateral to cover the withdrawal amount. Calculates the remaining collateral value in USDC after the withdrawal. Ensures the remaining USDC value is sufficient to cover the user's loan (calls getLoanDetails from the LoanManager contract). Reduces the user's deposited collateral amount and sends the withdrawn ETH back to the user.

- `liquidate(address from, address to)`: This function can only be called by the LoanManager contract. Transfers the liquidated user's entire collateral balance to the liquidator's address.

## Modifier
`onlyLoanManager`: This modifier restricts the liquidate function to be called only by the LoanManager contract.
