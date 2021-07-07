// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.6;

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
    struct InvoiceBasedEscrow {
        IERC20 token;
        uint amount;
        address payable payee;
    }
    
    mapping(bytes => InvoiceBasedEscrow) private referencedEscrows;

    /// Events to notify when the escrow is locked or unlocked
    /// @param paymentReference Reference of the payment related
    /// @dev   uint amount and address payee is emited from the ConditionalEscrow inherited smart-contract
    event EscrowLocked(bytes indexed paymentReference);
    event EscrowUnlocked(bytes indexed paymentReference);


    /// Store the payment referance in the struct and transfer the funds to the ESCROW smart-contract
    /// @param _paymentRef Reference of the payment related
    /// @param _amount Amount to transfer
    /// @param _payee address of the reciever/ beneficiary of the funds
    /// @param _tokenAddress Address of the ERC20 token smart contract
    /// @dev 
    /// @dev
    function initAndDeposit(bytes memory _paymentRef, uint _amount, address payable _payee, address _tokenAddress) public payable onlyOwner {
        require(referencedEscrows[_paymentRef].amount == 0, "This paymentRef already exists, is this the correct paymentRef?");
        InvoiceBasedEscrow storage escrow = referencedEscrows[_paymentRef];
        escrow.amount = _amount;
        escrow.payee = _payee;
        escrow.token = _tokenAddress;

        // FIXME: use payment Proxy code to deposit
        deposit(escrow.payee);

        emit EscrowLocked(_paymentRef);
    }
   

    /// Get the escrow details of a given _paymentRef
    /// @param _paymentRef Reference of the payment related
    /// @dev onlyOwner modifier 
    /// @return uint amount, address payee
    function getEscrow(bytes memory _paymentRef) public view onlyOwner returns (uint amount, address payee, address token) {
        return ( referencedEscrows[_paymentRef]. , referencedEscrows[_paymentRef].amount, referencedEscrows[_paymentRef].payee );
    }
   

    /// Withdraw the funds of escrow from a given _paymentRef
    /// @param _paymentRef Reference of the payment related
    /// @dev onlyOwner modifier 
    // FIXME: add conditionalEscrow functionality
    function withdrawFunds(bytes memory _paymentRef) public onlyOwner {
        uint amount = referencedEscrows[_paymentRef].amount;
        referencedEscrows[_paymentRef].amount = 0;
        withdraw(referencedEscrows[_paymentRef].payee);
        
        emit EscrowUnlocked(_paymentRef);
    }

}