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
    CountersUpgradeable.Counter private _voiceIdCounter;

    uint256 private constant ADD_ITEM_PRICE = 5 ether; // 5 matic
    uint256 private constant MINT_COMMISSION_RATE = 500; // 5%

    struct MintableItem {
        address royaltyReceiver;
        uint256 royaltyRate;
        uint256 price;
        string tokenURI;
        bool accepted;
    }

    mapping(uint256 => MintableItem) private _mintableItems;
    mapping(uint256 => uint256) private _voiceIds;

    event RoyaltiesSet(uint256 indexed tokenId, address indexed recipient, uint256 value);
    event SuccessRequestAddItem(address indexed royaltyReceiver, uint256 indexed voiceId);
    event SuccessMinted(uint256 indexed tokenId, uint256 indexed voiceId, string tokenURI);

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

    // ユーザーがmintableなアイテムを追加する
    function requestAddMintableItem(uint256 price, uint256 royaltyRate) public payable {
        require(royaltyRate <= 10000, "Royalty rate is too high"); // 10000 means 100%, as rate is in basis points
        require(msg.value == ADD_ITEM_PRICE, "invalid commison fee");
        payable(owner()).transfer(msg.value);

        uint256 voiceId = _voiceIdCounter.current();
        _voiceIdCounter.increment();
        _mintableItems[voiceId] = MintableItem(msg.sender, royaltyRate, price, '', false);

        emit SuccessRequestAddItem(msg.sender, voiceId);
    }

    // サービス側が準備後、承認する
    function acceptAddMintableItem(uint256 voiceId, string memory itemTokenURI) public onlyOwner {
        MintableItem memory item = _mintableItems[voiceId];
        item.accepted = true;
        item.tokenURI = itemTokenURI;
        _mintableItems[voiceId] = item;
    }

    // 承認出来ない場合、手数料を返金する
    function refundAddMintableItemFee(uint256 voiceId) public payable onlyOwner {
        MintableItem memory item = _mintableItems[voiceId];
        require(!item.accepted, "Item is already accepted");
        payable(item.royaltyReceiver).transfer(ADD_ITEM_PRICE);

        delete _mintableItems[voiceId];
    }

    // 情報を更新する
    function updateMintableItem(uint256 voiceId, uint256 royaltyRate, uint256 price) public {
        MintableItem memory item = _mintableItems[voiceId];
        require(item.royaltyReceiver == msg.sender, "Only royalty receiver can update");

        item.royaltyRate = royaltyRate;
        item.price = price;
        _mintableItems[voiceId] = item;
    }

    function calcMintPrice(uint256 price) internal pure returns (uint256) {
        uint256 royalty = (price * MINT_COMMISSION_RATE) / 10000;
        return price + royalty;
    }

    function getMintPrice(uint256 voiceId) public view returns (uint256) {
        MintableItem memory item = _mintableItems[voiceId];
        return calcMintPrice(item.price);
    } 

    function safeMint(address recipient, uint256 voiceId) public payable {
        MintableItem memory item = _mintableItems[voiceId];
        require(item.accepted, "Item is not accepted");
        require(msg.value == calcMintPrice(item.price), "Invalid price");
        
        uint256 tokenId = _tokenIdCounter.current();
        _tokenIdCounter.increment();
        _safeMint(recipient, tokenId);
        _setTokenURI(tokenId, item.tokenURI);
        _voiceIds[tokenId] = voiceId;

        emit RoyaltiesSet(tokenId, item.royaltyReceiver, item.royaltyRate);
        emit SuccessMinted(tokenId, voiceId, item.tokenURI);
    }

    function royaltyInfo(uint256 tokenId, uint256 salePrice) external view returns (address receiver, uint256 royaltyAmount) {
        uint256 voiceId = _voiceIds[tokenId];
        MintableItem memory item = _mintableItems[voiceId];
        uint256 royalty = (salePrice * item.royaltyRate) / 10000; // as royaltyRate is in basis points

        return (item.royaltyReceiver, royalty);
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