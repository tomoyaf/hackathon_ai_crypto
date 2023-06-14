// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts-upgradeable/token/ERC721/ERC721Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC721/extensions/ERC721EnumerableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC721/extensions/ERC721URIStorageUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/utils/CountersUpgradeable.sol";

contract VoiceToken is Initializable, ERC721Upgradeable, ERC721EnumerableUpgradeable, ERC721URIStorageUpgradeable, OwnableUpgradeable {
    using CountersUpgradeable for CountersUpgradeable.Counter;

    CountersUpgradeable.Counter private _tokenIdCounter;

    mapping(uint256 => address) private _royaltyReceivers;
    mapping(uint256 => uint256) private _royaltyRates;

    event RoyaltiesSet(uint256 indexed tokenId, address indexed recipient, uint256 value);

    /// @custom:oz-upgrades-unsafe-allow constructor
    constructor() {
        _disableInitializers();
    }

    function initialize() initializer public {
        __ERC721_init("VoiceToken", "VT");
        __ERC721Enumerable_init();
        __ERC721URIStorage_init();
        __Ownable_init();
    }

    function safeMint(address to, string memory uri, address royaltyReceiver, uint256 royaltyRate) public onlyOwner {
        uint256 tokenId = _tokenIdCounter.current();
        _tokenIdCounter.increment();
        _safeMint(to, tokenId);
        _setTokenURI(tokenId, uri);
        _setRoyalties(tokenId, royaltyReceiver, royaltyRate);
    }

    function _setRoyalties(uint256 tokenId, address royaltyReceiver, uint256 royaltyRate) internal {
        require(royaltyRate <= 10000, "Royalty rate is too high"); // 10000 means 100%, as rate is in basis points
        _royaltyReceivers[tokenId] = royaltyReceiver;
        _royaltyRates[tokenId] = royaltyRate;

        emit RoyaltiesSet(tokenId, royaltyReceiver, royaltyRate);
    }

    function royaltyInfo(uint256 tokenId, uint256 salePrice) external view returns (address receiver, uint256 royaltyAmount) {
        uint256 royaltyRate = _royaltyRates[tokenId];
        uint256 royalty = (salePrice * royaltyRate) / 10000; // as royaltyRate is in basis points

        return (_royaltyReceivers[tokenId], royalty);
    }

    function _beforeTokenTransfer(address from, address to, uint256 tokenId, uint256 batchSize)
        internal
        override(ERC721Upgradeable, ERC721EnumerableUpgradeable)
    {
        super._beforeTokenTransfer(from, to, tokenId, batchSize);
    }

    function _burn(uint256 tokenId)
        internal
        override(ERC721Upgradeable, ERC721URIStorageUpgradeable)
    {
        super._burn(tokenId);
    }

    function tokenURI(uint256 tokenId)
        public
        view
        override(ERC721Upgradeable, ERC721URIStorageUpgradeable)
        returns (string memory)
    {
        return super.tokenURI(tokenId);
    }

    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721Upgradeable, ERC721EnumerableUpgradeable, ERC721URIStorageUpgradeable)
        returns (bool)
    {
        return super.supportsInterface(interfaceId) || interfaceId == 0x2a55205a; // 0x2a55205a is the interface ID for ERC2981
    }
}