// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract ElectionPhaseManager {
    address public admin;
    struct Candidate {
        uint id;
        string name;
        string party;
    }

    event PhaseChanged(uint electionId, string newPhase, uint timestamp);
    event CandidateAdded(uint electionId, uint candidateId, string name, string party);

    mapping(uint => Candidate[]) public electionCandidates;

    modifier onlyAdmin() {
        require(msg.sender == admin, "Only the admin can perform this action");
        _;
    }

    constructor() {
        admin = msg.sender; // The admin is the contract deployer
    }

    function changePhase(uint electionId, string memory newPhase) public onlyAdmin {
        emit PhaseChanged(electionId, newPhase, block.timestamp);
    }

    function addCandidate(uint electionId, string memory name, string memory party) public onlyAdmin {
        uint candidateId = electionCandidates[electionId].length + 1;
        electionCandidates[electionId].push(Candidate(candidateId, name, party));

        emit CandidateAdded(electionId, candidateId, name, party);
    }

    function getCandidates(uint electionId) public view returns (Candidate[] memory) {
        return electionCandidates[electionId];
    }
}
