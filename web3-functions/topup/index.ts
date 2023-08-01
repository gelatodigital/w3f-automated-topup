import { ethers } from "ethers";
import {
  Web3Function,
  Web3FunctionContext,
} from "@gelatonetwork/web3-functions-sdk";
import { abi } from "../../artifacts/contracts/FeeForwarder.sol/FeeForwarder.json";
import { FeeForwarder } from "../../typechain";
import verifyUserArgs from "./verifyUserArgs";

Web3Function.onRun(async (context: Web3FunctionContext) => {
  const { userArgs, multiChainProvider } = context;
  const { proxyAddress, forwarderAddress, amount, threshold, targetAddresses } =
    verifyUserArgs(userArgs);

  const provider = multiChainProvider.default();

  const forwarder = new ethers.Contract(
    forwarderAddress,
    abi,
    provider
  ) as FeeForwarder;

  const [proxyBalance, ...balances] = (
    await forwarder.getBalances([proxyAddress, ...targetAddresses])
  ).map((x) => x.toBigInt());

  const targets = balances.map((balance, index) => ({
    balance,
    address: targetAddresses[index],
  }));

  const target = targets.reduce((a, b) => (a.balance < b.balance ? a : b));

  if (target.balance >= threshold)
    return { canExec: false, message: "No refill required" };

  const delta = amount - target.balance;

  const tx = await forwarder.populateTransaction.transfer(
    target.address,
    delta
  );

  if (!tx.to || !tx.data)
    return { canExec: false, message: "Invalid transaction" };

  return {
    canExec: true,
    callData: [{ to: tx.to, data: tx.data, value: proxyBalance.toString() }],
  };
});
