// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract CandidateRegistry {
    struct Candidate {
        string name;
        string party;
        uint age;
        string qualification;
        address addedBy;
    }

    mapping(uint => Candidate) public candidates;
    uint public candidateCount;

    event CandidateAdded(uint candidateId, string name, string party, uint age, string qualification, address addedBy);

    function addCandidate(string memory _name, string memory _party, uint _age, string memory _qualification) public {
        candidateCount++;
        candidates[candidateCount] = Candidate(_name, _party, _age, _qualification, msg.sender);
        emit CandidateAdded(candidateCount, _name, _party, _age, _qualification, msg.sender);
    }

    function getCandidate(uint _candidateId) public view returns (string memory, string memory, uint, string memory, address) {
        Candidate memory candidate = candidates[_candidateId];
        return (candidate.name, candidate.party, candidate.age, candidate.qualification, candidate.addedBy);
    }
}
