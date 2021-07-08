// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.6.0 <0.8.6;

import "@openzeppelin/contracts/utils/escrow/ConditionalEscrow.sol";
import "@openzeppelin/contracts/tokens/ERC20/IERC20.sol";


// TODO: 
// Add ERC20 functionality to OP ESCROW
// Add payment proxy code
// conditional milestones timestamps, time when money is available to withdraw if not accepted
// condition to accept the "work" or task as completed
// function to withdraw for both payee and payer what's best?
// DONE: Add token address as parameter and as part of the escrow struct
// DONE: Add conditional escrow from OP


/// @author Viken Blockchain Solutions
/// @title Invoice based escrow smart-contract
contract MyEscrow is ConditionalEscrow {
    struct Invoice {
        IERC20 tokenAddress;
        uint amount;
        address payable payee;
    }
    
    struct Token {
        bytes32 ticker;
        address tokenAddress;
    }

    mapping(bytes32 => Token) public tokenMapping;
    mapping(bytes => InvoiceBasedEscrow) private referenceMapping;
    bytes32[] public tokenlist;

    modifier tokenExist(bytes32 ticker){
        require(tokenMapping[ticker].tokenAddress != address(0), "Token does not exist");
        _;
    }

    modifier referenceExist(bytes32 _paymentRef) {
        require(
            referenceMapping[_paymentRef].tokenAddress != address(0),
            "Payment reference does not exist");
        _;
    }

    
    /// Events to notify when the escrow is locked or unlocked
    /// @param paymentReference Reference of the payment related
    /// @dev uint amount and address payee is emitted in Escrow contract
    event EscrowLocked(bytes32 indexed paymentReference);
    event EscrowUnlocked(bytes32 indexed paymentReference);


    // Register token to use with the smartcontract
    /// @param ticker ticker symbol of token
    /// @param tokenAddress contract address of token
    function addToken(bytes32 ticker, address tokenAddress) external onlyOwner {
        tokenMapping[ticker] = Token(ticker, tokenAddress);
        tokenlist.push(ticker);
    }


    function deposit(uint amount, bytes32 ticker) tokenExist(ticker) external {
        IERC20(tokenMapping[ticker].tokenAddress).transfer(payee, amount);

    }


    function withdraw(uint amount, bytes32 ticker, address payee) tokenExist(ticker) 
        external 
        onlyOwner 
    {
        IERC20(tokenMapping[ticker].tokenAddress).transfer(payee, amount);
    } 


    /// Store the payment details in struct, then transfers the funds to the Escrow contract
    /// @param _paymentRef Reference of the payment related
    /// @param _amount Amount to transfer
    /// @param _payee address of the reciever/ beneficiary of the funds
    /// @param _tokenAddress Address of the ERC20 token smart contract
    function initAndDeposit(
        bytes32 _paymentRef, 
        uint _amount, 
        address payable _payee, 
        address _tokenAddress
    ) 
        public
        payable
        onlyOwner 
    {
        require(
            referenceMapping[_paymentRef].amount == 0, 
            "This paymentRef already exists, is this the correct paymentRef?"
        );

        referenceMapping[_paymentRef] = invoice(_amount, _payee, _tokenAddress);
        
        // FIXME: use payment Proxy code to deposit
        deposit(escrow.payee);

        emit EscrowLocked(_paymentRef);
    }
   

    /// Get the escrow details of a given _paymentRef
    /// @param _paymentRef Reference of the payment related
    /// @dev onlyOwner modifier 
    /// @return uint amount, address payee
    function getEscrow(bytes32 _paymentRef) referenceExist(_paymentRef) public view onlyOwner 
        returns (
        uint amount, 
        address payee, 
        address token
        ) 
    {
        return ( 
            referenceMapping[_paymentRef].token, 
            referenceMapping[_paymentRef].amount, 
            referenceMapping[_paymentRef].payee 
        );
    }
   

    /// Withdraw the funds of escrow from a given _paymentRef
    /// @param _paymentRef Reference of the payment related
    /// @dev onlyOwner modifier 
    // FIXME: add conditionalEscrow functionality
    function withdrawFunds(bytes32 _paymentRef) preferenceExist(_paymentRef) public onlyOwner {
        uint amount = referenceMapping[_paymentRef].amount;
        referencedEscrows[_paymentRef].amount = 0;
        
        withdraw(amount, referenceMapping[_paymentRef], referenceMapping[_paymentRef].payee);
        
        emit EscrowUnlocked(_paymentRef);
    }




}