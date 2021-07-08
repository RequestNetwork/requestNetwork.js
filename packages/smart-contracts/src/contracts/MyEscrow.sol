// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.4;

import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/e4696f73157edb97a146f7d06b88a6a250fec768/contracts/utils/escrow/ConditionalEscrow.sol";
import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/e4696f73157edb97a146f7d06b88a6a250fec768/contracts/token/ERC20/IERC20.sol";
import "https://github.com/RequestNetwork/requestNetwork/blob/mvp-escrow/packages/smart-contracts/src/contracts/interfaces/ERC20FeeProxy.sol";


// TODO: 
// Add ERC20 functionality to OP ESCROW
// DONE: Add payment proxy code
// conditional milestones timestamps, time when money is available to withdraw if not accepted
// condition to accept the "work" or task as completed
// function to withdraw for both payee and payer what's best?
// DONE: Add token address as parameter and as part of the escrow struct
// DONE: Add conditional escrow from OP


/// @author Viken Blockchain Solutions
/// @title Invoice based escrow smart-contract
contract MyEscrow is ConditionalEscrow {
    struct Invoice {
        address tokenAddress;
        uint amount;
        address payable payee;
    }
    
    struct Token {
        bytes32 ticker;
        address tokenAddress;
    }

    mapping(bytes32 => Token) public tokenMapping;
    mapping(bytes => Invoice) private referenceMapping;
    bytes32[] public tokenlist;

    /// Checks if the token a valid token
    modifier tokenExist(bytes32 ticker){
        require(tokenMapping[ticker].tokenAddress != address(0), "Token does not exist");
        _;
    }


    /// Events to notify when the escrow is locked or unlocked
    event EscrowLocked(bytes indexed paymentReference, uint amount, address payee);
    event EscrowUnlocked(bytes indexed paymentReference, uint amount, address payee);

    IERC20FeeProxy public paymentProxy;
    uint public feeAmount;
    address public feeAddress;



    // Register token to use with the smartcontract
    /// @param ticker ticker symbol of token
    /// @param tokenAddress contract address of token
    function addToken(bytes32 ticker, address tokenAddress) external onlyOwner {
        tokenMapping[ticker] = Token(ticker, tokenAddress);
        tokenlist.push(ticker);
    }


    function _deposit(bytes memory _paymentRef, uint amount, bytes32 ticker) tokenExist(ticker) internal {
        IERC20(tokenMapping[ticker].tokenAddress).transfer(referenceMapping[_paymentRef].payee, amount);

    }


    function _withdraw(uint amount, bytes32 ticker, address payee) tokenExist(ticker) 
        internal 
        onlyOwner 
    {
        IERC20(tokenMapping[ticker].tokenAddress).transfer(payee, amount);
    } 


    /// Store the payment details in struct, then transfers the funds to the Escrow contract
    /// @param _paymentRef Reference of the payment related
    /// @param _amount Amount to transfer
    /// @param _payee address of the reciever/ beneficiary of the funds
    /// @param _tokenAddress Address of the ERC20 token smart contract
    function initAndDeposit(bytes memory _paymentRef, uint _amount, address payable _payee, address _tokenAddress) 
        public
        payable
        onlyOwner 
    {
        require(
            referenceMapping[_paymentRef].amount == 0, 
            "This paymentRef already exists, is this the correct paymentRef?"
        );

        // Rinkeby Contract Address 
        paymentProxy = IERC20FeeProxy(0xda46309973bFfDdD5a10cE12c44d2EE266f45A44);
        
        referenceMapping[_paymentRef] = Invoice(_tokenAddress, _amount, _payee);
        

        paymentProxy.transferFromWithReferenceAndFee(
            _tokenAddress, 
            _payee, 
            _amount, 
            _paymentRef, 
            feeAmount, 
            feeAddress 
        );

        emit EscrowLocked(_paymentRef, _amount, _payee);
    }
   

    /// Get the escrow details of a given _paymentRef
    /// @param _paymentRef Reference of the payment related
    /// @dev onlyOwner modifier 
    function getEscrow(bytes memory _paymentRef) public view onlyOwner 
        returns (
        address token,
        uint amount, 
        address payee
        ) 
    {
        require(
            referenceMapping[_paymentRef].tokenAddress != address(0),
            "Payment reference does not exist"
        );
        return ( 
            referenceMapping[_paymentRef].tokenAddress, 
            referenceMapping[_paymentRef].amount, 
            referenceMapping[_paymentRef].payee 
        );
    }
   

    /// Withdraw the funds of escrow from a given _paymentRef
    /// @param _paymentRef Reference of the payment related
    /// @dev onlyOwner modifier 
    function withdraw(bytes memory _paymentRef, bytes32 _ticker) public onlyOwner {
        require(
            referenceMapping[_paymentRef].tokenAddress != address(0),
            "Payment reference does not exist"
        );
        require(withdrawAll(referenceMapping[_paymentRef].payee) == true);
        uint amount = referenceMapping[_paymentRef].amount;
        referenceMapping[_paymentRef].amount = 0;
        
        _withdraw(amount, tokenMapping[_ticker].ticker, referenceMapping[_paymentRef].payee);
        
        emit EscrowUnlocked(_paymentRef, amount, referenceMapping[_paymentRef].payee);
    }




}