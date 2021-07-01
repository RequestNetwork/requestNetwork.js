// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/utils/escrow/Escrow.sol";

//import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/v4.1.0/contracts/utils/escrow/Escrow.sol";

contract MyEscrow is Escrow {
    struct InvoiceBasedEscrow {
        uint amount;
        address payable payee;
    }

    event EscrowUnlocked(bytes indexed paymentReference, uint amount, address payee);
    event EscrowLocked(bytes indexed paymentReference, uint amount, address payee);

    mapping(bytes => InvoiceBasedEscrow) public referencedEscrows;

    // TODO: 
    // Add modifer for payer, payee 
    // replace onlyOner in getEscrow
    

    function initAndDeposit(bytes memory _paymentRef, address payable _payee) public payable onlyOwner {
        
        require(referencedEscrows[_paymentRef].amount == 0, "This paymentRef already exists, is this the correct paymentRef?");
        
        InvoiceBasedEscrow storage escrow = referencedEscrows[_paymentRef];
        escrow.amount = msg.value;
        escrow.payee = _payee;
   
        deposit(escrow.payee);

        emit EscrowLocked(_paymentRef, msg.value, _payee);
    }
   
    
    function getEscrow(bytes memory _paymentRef) public view onlyOwner returns (uint amount, address payee){
        return ( referencedEscrows[_paymentRef].amount, referencedEscrows[_paymentRef].payee );
    }
   
    function withdrawFunds(bytes memory _paymentRef) public {

        uint amount = referencedEscrows[_paymentRef].amount;

        withdraw(referencedEscrows[_paymentRef].payee);
        referencedEscrows[_paymentRef].amount = 0;
        
        emit EscrowUnlocked(_paymentRef, amount, referencedEscrows[_paymentRef].payee);
    }

}