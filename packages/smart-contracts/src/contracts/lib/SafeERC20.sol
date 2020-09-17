pragma solidity ^0.5.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

/**
 * @title SafeERC20
 * @notice Works around implementations of ERC20 with transferFrom not returning success status.
 */
library SafeERC20 {

  /**
   * @notice Call transferFrom ERC20 function and validates the return data of a ERC20 contract call.
   * @dev This is necessary because of non-standard ERC20 tokens that don't have a return value.
   * @return The return value of the ERC20 call, returning true for non-standard tokens
   */
  function safeTransferFrom(IERC20  _token, address _from, address _to, uint256 _amount) internal returns (bool result) {
    address tokenAddress = address(_token);
    /* solium-disable security/no-inline-assembly */
    // check if the address is a contract
    assembly {
      if iszero(extcodesize(tokenAddress)) { revert(0, 0) }
    }
    
    // solium-disable-next-line security/no-low-level-calls
    (bool success, ) = tokenAddress.call(abi.encodeWithSignature(
      "transferFrom(address,address,uint256)",
      _from,
      _to,
      _amount
    ));

    assembly {
        switch returndatasize()
        case 0 { // not a standard erc20
            result := 1
        }
        case 32 { // standard erc20
            returndatacopy(0, 0, 32)
            result := mload(0)
        }
        default { // anything else, should revert for safety
            revert(0, 0)
        }
    }

    require(success, "transferFrom() has been reverted");

    /* solium-enable security/no-inline-assembly */
    return result;
  }
}
