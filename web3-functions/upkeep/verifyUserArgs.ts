import { Web3FunctionUserArgs } from "@gelatonetwork/web3-functions-sdk";
import { ethers } from "ethers";

interface IUserArgs {
  proxyAddress: string;
  forwarderAddress: string;
  amount: bigint;
  threshold: bigint;
  targetAddresses: string[];
}

const verifyUserArgs = (args: Web3FunctionUserArgs): IUserArgs => {
  const proxyAddress = args.proxy as string;
  if (!ethers.utils.isAddress(proxyAddress))
    throw new Error("verifyUserArgs: Invalid dedicatedMsgSender address");

  const forwarderAddress = args.forwarder as string;
  if (!ethers.utils.isAddress(forwarderAddress))
    throw new Error("verifyUserArgs: Invalid forwarder address");

  const amount = BigInt(args.amount as string);
  if (!amount) throw new Error("verifyUserArgs: Invalid amount");

  const threshold = BigInt(args.threshold as string);
  if (!threshold) throw new Error("verifyUserArgs: Invalid threshold");

  if (amount < threshold)
    throw new Error("verifyUserArgs: require amount >= threshold");

  const targetAddresses = args.targets as string[];
  for (const target of targetAddresses) {
    if (!ethers.utils.isAddress(target))
      throw new Error("verifyUserArgs: Invalid target addresses");
  }

  return {
    proxyAddress,
    forwarderAddress,
    amount,
    threshold,
    targetAddresses,
  };
};

export default verifyUserArgs;
