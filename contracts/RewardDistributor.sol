// // SPDX-License-Identifier: MIT
// pragma solidity ^0.8.0;

// import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
// import "@openzeppelin/contracts/access/Ownable.sol";
// import "./external/uniswap/IUniswapV3Staker.sol";
// import "./external/uniswap/interfaces/INonfungiblePositionManager.sol";

// contract RewardDistributor is Ownable {
//     IUniswapV3Staker public uniswapV3Staker;
//     IERC20 public rewardToken;
//     address[] public poolAddresses;
//     uint256 public lastIncentiveTimestamp;
//     uint256 public constant monthlyRewardAmount = 5000 * 10**18; // Assuming 18 decimals for DCA token
//     uint256 public constant oneMonth = 30 days;

//     constructor(
//         address _uniswapV3Staker,
//         address _rewardToken,
//         address[] memory _poolAddresses
//     ) {
//         require(_poolAddresses.length == 3, "Must provide exactly 3 pool addresses");
//         uniswapV3Staker = IUniswapV3Staker(_uniswapV3Staker);
//         rewardToken = IERC20(_rewardToken);
//         poolAddresses = _poolAddresses;
//     }

//     function createMonthlyIncentives() external {
//         require(block.timestamp >= getNextIncentiveTime(), "Incentives can only be created once per month");
        
//         uint256 rewardPerPool = monthlyRewardAmount / 3;

//         for (uint256 i = 0; i < poolAddresses.length; i++) {
//             IUniswapV3Staker.IncentiveKey memory key = IUniswapV3Staker.IncentiveKey({
//                 rewardToken: rewardToken,
//                 pool: IUniswapV3Pool(poolAddresses[i]),
//                 startTime: block.timestamp,
//                 endTime: block.timestamp + oneMonth,
//                 refundee: address(this)
//             });
//             rewardToken.approve(address(uniswapV3Staker), rewardPerPool);
//             uniswapV3Staker.createIncentive(key, rewardPerPool);
//         }

//         lastIncentiveTimestamp = block.timestamp;
//     }

//     function getNextIncentiveTime() public view returns (uint256) {
//         return lastIncentiveTimestamp + oneMonth;
//     }
// }
