import { AutomateSDK } from "@gelatonetwork/automate-sdk";
import { task } from "hardhat/config";

task("upkeep", "Automatically fund wallets/contracts with native tokens")
  .addParam("amount", "desired balance")
  .addParam("threshold", "balance at which to initiate upkeep")
  .addParam("targets", "list of addresses to fund, separated by commas")
  .setAction(async (args, { ethers, w3f, deployments }) => {
    const amount = BigInt(args.amount);
    if (!amount) throw new Error("Upkeep: invalid amount");

    const threshold = BigInt(args.threshold);
    if (!threshold) throw new Error("Upkeep: invalid threshold");

    if (amount < threshold)
      throw new Error("verifyUserArgs: require amount >= threshold");

    const targets = (args.targets as string).split(" ");
    for (const target of targets) {
      if (!ethers.utils.isAddress(target))
        throw new Error("Upkeep: invalid target address");
    }

    // get contract deployment
    const forwarder = await deployments.get("FeeForwarder");

    // deploy W3F to IPFS
    console.log("Deploying W3F to IPFS.");

    const upkeepW3f = w3f.get("upkeep");
    const cid = await upkeepW3f.deploy();

    console.log(`Deployed W3F hash ${cid}.`);

    // create W3F task
    console.log("Creating W3F task.");

    const [deployer] = await ethers.getSigners();
    const chainId = await deployer.getChainId();

    const automate = new AutomateSDK(chainId, deployer);
    const proxy = await automate.getDedicatedMsgSender();

    const { taskId, tx } = await automate.createBatchExecTask({
      name: "Automated Upkeep",
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
      `Created upkeep task: https://beta.app.gelato.network/task/${taskId}?chainId=${chainId}`
    );
  });
