# Web3 Function Automated Top-Up

This project maintains an addresses (Smart Contract or EOA) balance at a desired value and periodically tops it up when below a specified threshold.
Since computation is performed entirely off-chain by a Web3 Function, no contract deployment is necessary leading to gas savings.
Funds are stored in a user's `dedicatedMsgSender` proxy which funds all topup tasks.

> [!NOTE]
> Whilst no per-user contract deployment is necessary, a [forwarder](https://github.com/gelatodigital/w3f-automated-topup/blob/main/contracts/FeeForwarder.sol) contract must be deployed once on each network and is subsequently shared by all topup tasks.

## Hardhat Task
The example implements an [topup](https://github.com/gelatodigital/w3f-automated-topup/blob/main/tasks/toüup.ts) hardhat task for deployment from the CLI.  
Specify a desired `amount` and `threshold` along with a list of `targets` to topup (comma-separated).  
[See Quick Start](#quick-start)

## Quick Start

> [!WARNING]
> Contracts are not audited by a third party. Please use at your own discretion.

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
5. Create topup task
   ```
   yarn hardhat topup --targets [addresses] --amount [value] --threshold [value] --network [network]
   ```
6. Fund `dedicatedMsgSender` proxy   
   [https://fund-proxy.web.app/](https://fund-proxy.web.app/)
