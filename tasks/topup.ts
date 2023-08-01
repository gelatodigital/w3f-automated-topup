import { AutomateSDK } from "@gelatonetwork/automate-sdk";
import { task } from "hardhat/config";

task("topup", "Automatically refill wallets/contracts with native tokens")
  .addParam("amount", "desired balance")
  .addParam("threshold", "balance at which to initiate refill")
  .addParam("targets", "list of addresses to fund, separated by commas")
  .setAction(async (args, { ethers, w3f, deployments }) => {
    const amount = BigInt(args.amount);
    if (!amount) throw new Error("Topup: invalid amount");

    const threshold = BigInt(args.threshold);
    if (!threshold) throw new Error("Topup: invalid threshold");

    if (amount < threshold)
      throw new Error("verifyUserArgs: require amount >= threshold");

    const targets = (args.targets as string).split(" ");
    for (const target of targets) {
      if (!ethers.utils.isAddress(target))
        throw new Error("Topup: invalid target address");
    }

    // get contract deployment
    const forwarder = await deployments.get("FeeForwarder");

    // deploy W3F to IPFS
    console.log("Deploying W3F to IPFS.");

    const topupW3f = w3f.get("topup");
    const cid = await topupW3f.deploy();

    console.log(`Deployed W3F hash ${cid}.`);

    // create W3F task
    console.log("Creating W3F task.");

    const [deployer] = await ethers.getSigners();
    const chainId = await deployer.getChainId();

    const automate = new AutomateSDK(chainId, deployer);
    const proxy = await automate.getDedicatedMsgSender();

    const { taskId, tx } = await automate.createBatchExecTask({
      name: "Automated Topup",
      web3FunctionHash: cid,
      web3FunctionArgs: {
        proxy: proxy.address,
        forwarder: forwarder.address,
        amount: args.amount,
        threshold: args.threshold,
        targets: targets,
      },
      useTreasury: false,
    });

    await tx.wait();
    console.log(
      `Created topup task: https://beta.app.gelato.network/task/${taskId}?chainId=${chainId}`
    );
  });
