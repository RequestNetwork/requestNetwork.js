// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.8.6;

import "@openzeppelin/contracts/utils/escrow/Escrow.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "https://github.com/RequestNetwork/requestNetwork/blob/mvp-escrow/packages/smart-contracts/src/contracts/interfaces/ERC20FeeProxy.sol";


/// @author Viken Blockchain Solutions
/// @title Invoice based escrow smart-contract
contract MyEscrow is Escrow {
/** Struct */

    struct Invoice {
        uint amount;
        address payable payee;
        address payable payer;
    }

/** Mapping */

    // Stores the Invoice details according to the payment reference
    mapping(bytes => Invoice) public paymentsMapping;


/** Events */

    /// Events to notify when the escrow is Initiated or Completed
    event EscrowInitiated(bytes indexed paymentReference, uint amount, address payee, address payer, address paymentToken);
    event EscrowCompleted(bytes indexed paymentReference, uint amount, address payee, address payer, address paymentToken);


/** Global variables */
    /// Rinkeby IERC20FeeProxy Contract Address 
    IERC20FeeProxy public paymentProxy = IERC20FeeProxy(0xda46309973bFfDdD5a10cE12c44d2EE266f45A44);
    
    /// Rinkeby CentralBankToken (CTBK) Contract Address 
    IERC20 public paymentToken = IERC20(0x995d6A8C21F24be1Dd04E105DD0d83758343E258);


/** Functions */

   /// Transfers paymentToken from payer to MyEscrow smartcontract  
    /// @param _paymentRef Reference of the Invoice related
    /// @dev   Internal function called from initAndDeposit
    function _deposit(bytes memory _paymentRef) internal onlyOwner{
        require(paymentToken.transferFrom(
            paymentsMapping[_paymentRef].payer,
            address(this), 
            paymentsMapping[_paymentRef].amount
        ), 
        "Cannot lock tokens to Escrow as requested, did you approve CTBK?"); 
    }


    /// Transfers paymentToken from payer to MyEscrow smartcontract  
    /// @param _paymentRef Reference of the Invoice related
    /// @dev   Internal function called from WithdrawFunds
    function _withdraw(bytes memory _paymentRef)  internal {
        paymentToken.transfer(paymentsMapping[_paymentRef].payee, paymentsMapping[_paymentRef].amount);
    } 


    /// Store the payment details in struct, then transfers the funds to the Escrow contract
    /// @param _paymentRef Reference of the Invoice related
    /// @param amount Amount to transfer
    /// @param payee address of the reciever/ beneficiary of the escrow funds
    /// @param payer Address of the payer of the invoiced escrow
    function initAndDeposit(bytes memory _paymentRef, uint amount, address payable payee, address payer) 
        public
        payable
        onlyOwner 
    {
        require(
            paymentsMapping[_paymentRef].amount == 0, 
            "This paymentRef already exists, is this the correct paymentRef?"
        );

        paymentsMapping[_paymentRef] = Invoice(amount, payable(payee), payable(payer));
        
        _deposit(_paymentRef);

        emit EscrowInitiated(_paymentRef, paymentsMapping[_paymentRef].amount,  paymentsMapping[_paymentRef].payee,  paymentsMapping[_paymentRef].payer, address(paymentToken));
    }


    /// Withdraw the funds of escrow from a given _paymentRef
    /// @param _paymentRef Reference of the payment related
    /// @dev onlyOwner modifier 
    function withdrawFunds(bytes memory _paymentRef) public onlyOwner {
        require(
            paymentsMapping[_paymentRef].amount != 0,
            "Payment reference does not exist"
        );

        uint amount = paymentsMapping[_paymentRef].amount;
        paymentsMapping[_paymentRef].amount = 0;
    
/*

        paymentProxy.transferFromWithReferenceAndFee(
            paymentToken, 
            referenceMapping[_paymentRef].payee, 
            referenceMapping[_paymentRef].amount, 
            _paymentRef, 
            feeAmount, 
            feeAddress 
        );

*/
        _withdraw(_paymentRef);
        
        emit EscrowCompleted(_paymentRef, amount, paymentsMapping[_paymentRef].payee, paymentsMapping[_paymentRef].payer, address(paymentToken));
    }


    /** Getter functions */

    /// Get the Invoice details of a given _paymentRef
    /// @param _paymentRef Reference of the Invoice related
    /// @dev onlyOwner modifier 
    function getInvoice(bytes memory _paymentRef) public view onlyOwner 
        returns (
        uint amount, 
        address payee,
        address payer
        ) 
    {
        require(
            paymentsMapping[_paymentRef].amount != 0,
            "Payment reference does not exist"
        );
        return ( 
            paymentsMapping[_paymentRef].amount, 
            paymentsMapping[_paymentRef].payee,
            paymentsMapping[_paymentRef].payer
        );
    }
}

/** 




    struct Token {
        bytes32 ticker;
        address tokenAddress;
    }

    mapping(bytes32 => Token) public tokenMapping;
    bytes32[] public tokenlist;

    /// Checks if the token a valid token
    modifier tokenExist(bytes32 ticker){
        require(tokenMapping[ticker].tokenAddress != address(0), "Token does not exist");
        _;
    }


    uint public feeAmount;
    address public feeAddress;


    // Register token to use with the smartcontract
    /// @param ticker ticker symbol of token
    /// @param tokenAddress contract address of token
    function addToken(bytes32 ticker, address tokenAddress) external onlyOwner {
        tokenMapping[ticker] = Token(ticker, tokenAddress);
        tokenlist.push(ticker);
    }


    






   

   

   

}


*/ 