# Web3 Function Automated Upkeep

This project maintains an addresses (Smart Contract or EOA) balance at a desired value and periodically tops it up when below a specified threshold.
Since computation is performed entirely off-chain by a Web3 Function, no contract deployment is necessary leading to gas savings.
Funds are stored in a user's `dedicatedMsgSender` proxy which funds all upkeep tasks.

> **Note**  
> Whilst no per-user contract deployment is necessary, a [forwarder](https://github.com/gelatodigital/w3f-automated-upkeep/blob/main/contracts/FeeForwarder.sol) contract must be deployed once on each network and is subsequently shared by all upkeep tasks.

## Hardhat Task
The example implements an [upkeep](https://github.com/gelatodigital/w3f-automated-upkeep/blob/main/tasks/upkeep.ts) hardhat task for deployment from the CLI.  
Specify a desired `amount` and `threshold` along with a list of `targets` to upkeep (comma-separated).  
[See Quick Start](#quick-start)

## Quick Start
1. Install dependencies
   ```
   yarn install
   ```
2. Compile smart contracts
   ```
   yarn run hardhat compile
   ```
3. Edit ``.env``
   ```
   cp .env.example .env
   ```
4. Deploy forwarder contract (Optional)
   ```
   yarn hardhat deploy --network [network]
   ```
5. Create upkeep task
   ```
   yarn hardhat upkeep --targets [addresses] --amount [value] --threshold [value] --network [network]
   ```
6. Fund `dedicatedMsgSender` proxy   
   [https://fund-proxy.web.app/](https://fund-proxy.web.app/)
