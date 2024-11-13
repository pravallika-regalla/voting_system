async function main() {
    // Get the contract factory and deploy it
    const Voting = await ethers.getContractFactory("Voting");
    const voting = await Voting.deploy();

    console.log("Voting contract deployed to:", voting.address);
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
