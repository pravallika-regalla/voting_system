async function main() {
    const [deployer] = await ethers.getSigners();

    console.log("Deploying contracts with the account:", deployer.address);

    const ElectionPhaseManager = await ethers.getContractFactory("ElectionPhaseManager");
    const contract = await ElectionPhaseManager.deploy();

    console.log("ElectionPhaseManager contract deployed to:", contract.address);
}

main()
    .then(() => process.exit(0))
    .catch(error => {
        console.error(error);
        process.exit(1);
    });
