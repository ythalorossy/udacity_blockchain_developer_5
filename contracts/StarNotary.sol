pragma solidity ^0.4.24;

// Criteria: Define and implement interface.
// Specification: Smart contract implements the ERC-721 or ERC721Token interface
import 'openzeppelin-solidity/contracts/token/ERC721/ERC721.sol';

contract StarNotary is ERC721 { 

    // Criteria: Add metadata to the star token
    // Specification: The star token should have these pieces of metadata added

    /** Star Coordinate Structure */
    struct StarCoordinates {
        string ra;
        string dec;
        string mag; 
    }

    /** Star Structure */
    struct Star {
        string name;
        string story;
        // Each star has coordinates
        StarCoordinates coordinates;
    }

    // Stores the relation between onwer and star
    mapping( uint256 => Star ) public tokenIdToStarInfo; 

    // Stores the uniqueness of the stars based on the coordinates
    mapping( bytes32 => bool ) public uniqueHashStar;

    // Stores stars for sale
    mapping(uint256 => uint256) public starsForSale;

    // Criteria: Configure uniqueness with the stars
    // Smart contract prevents stars with the same coordinates from being added
    
    /**
    * Check if star exists based on the coordinates.
    * https://solidity.readthedocs.io/en/latest/units-and-global-variables.html?highlight=abi.encode
    * 
    * @param _ra The ra of the star
    * @param _dec The dec of the star
    * @param _mag The mag of the star
    */
    function checkIfStarExist(
        string _ra, 
        string _dec, 
        string _mag
    ) public view returns (bool) 
    {
        return uniqueHashStar[keccak256(abi.encodePacked(_ra, _dec, _mag))];
    }

 
    // Criteria: Smart contract contains required functions
    // Specification: Smart contract implements all these functions:
    // createStar(), putStarUpForSale(), buyStar(), checkIfStarExist(), 
    // mint(), approve(), safeTransferFrom(), SetApprovalForAll(), getApproved(), 
    // isApprovedForAll(), ownerOf(), starsForSale(), tokenIdToStarInfo()

   /**
    * Create star
    *
    * @param _name The Star's name
    * @param _story The story
    * @param _ra The ra of the star
    * @param _dec The dec of the star
    * @param _mag The mag of the star
    */
    function createStar (
        string _name,
        string _story, 
        string _ra, 
        string _dec, 
        string _mag, 
        uint256 _tokenId // TODO: Is is need?
    ) 
    public returns (uint index) 
    {
        // Checks if the all coordinates were filled 
        require(keccak256(abi.encodePacked(_ra)) != keccak256(""));
        require(keccak256(abi.encodePacked(_dec)) != keccak256(""));
        require(keccak256(abi.encodePacked(_mag)) != keccak256(""));
        // Checks the uniqueness ot the star
        require(!checkIfStarExist(_ra, _dec, _mag));

        // Prepare the coordinates
        StarCoordinates memory coordinates = StarCoordinates(_ra, _dec, _mag);

        // Create the new star
        Star memory newStar = Star(_name, _story, coordinates);

        // Store 
        tokenIdToStarInfo[_tokenId] = newStar;

        _mint(msg.sender, _tokenId);

        uniqueHashStar[keccak256(abi.encodePacked(_ra, _dec, _mag))] = true;
        
        return 0;
    }

    function putStarUpForSale(uint256 _tokenId, uint256 _price) public 
    {
        require(_isApprovedOrOwner(msg.sender, _tokenId));

        starsForSale[_tokenId] = _price;
    }

    function buyStar(uint256 _tokenId) public payable 
    {

        require(starsForSale[_tokenId] > 0);

        uint256 starCost = starsForSale[_tokenId];
        address starOwner = this.ownerOf(_tokenId);
        
        require(msg.value >= starCost);

        _removeTokenFrom(starOwner, _tokenId);
        _addTokenTo(msg.sender, _tokenId);

        starOwner.transfer(starCost);

        if(msg.value > starCost) { 
            msg.sender.transfer(msg.value - starCost);
        }
    }

    function mint(uint256 _tokenId) public 
    {
        super._mint(msg.sender, _tokenId);
    }

    /**
    * Retrive the star information based on the tokenId
    * @param _tokenId uint256 token 
    */
    function tokenIdToStarInfo(uint256 _tokenId) public view returns (string, string, string, string, string) {
        return (
            tokenIdToStarInfo[_tokenId].name,
            tokenIdToStarInfo[_tokenId].story,
            tokenIdToStarInfo[_tokenId].coordinates.ra,
            tokenIdToStarInfo[_tokenId].coordinates.dec,
            tokenIdToStarInfo[_tokenId].coordinates.mag
        );
    }

}
