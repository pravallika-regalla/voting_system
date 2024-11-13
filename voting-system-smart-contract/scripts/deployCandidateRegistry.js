async function main() {
    const CandidateRegistry = await ethers.getContractFactory("CandidateRegistry");
    const candidateRegistry = await CandidateRegistry.deploy();


    console.log("CandidateRegistry deployed to:", candidateRegistry.address);
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
