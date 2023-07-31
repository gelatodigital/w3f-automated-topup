import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";
import { GELATO_ADDRESSES } from "@gelatonetwork/automate-sdk";

const name = "FeeForwarder";

const func: DeployFunction = async (hre: HardhatRuntimeEnvironment) => {
  const { deployments, network, ethers } = hre;
  const [deployer] = await ethers.getSigners();
  const { deploy } = deployments;

  console.log(`Deploying ${name} to ${network.name}.`);

  const chainId = await deployer.getChainId();
  const automate = GELATO_ADDRESSES[chainId].automate;

  const { address } = await deploy(name, {
    from: deployer.address,
    args: [automate],
  });

  console.log(`Deployed ${name} at ${address}.`);
};

func.tags = [name];

export default func;
