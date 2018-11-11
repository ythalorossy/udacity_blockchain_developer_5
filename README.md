# Notarize Stars Service in Public Blockchain Network

This project provides a web application that interact with the Smart Contract deployed on the Rinkeby network blockchain. This application provides a way to claim stars, register and query using tokens. 

On this project was used the concept of the [ERC721](http://erc721.org/) non-fungible tokens. 

You can find informations about the Contract on:

- [Star Notary Contract - 0x900e8298676f6f2dd829c8351a73d3ab3c3f6006](https://rinkeby.etherscan.io/address/0x900e8298676f6f2dd829c8351a73d3ab3c3f6006)
- [Star Notary Creation Transactions - 0x127a884355f40f3c80695b0e8d57a82e7496f5821cf40ae5b789ffc3a4046297](https://rinkeby.etherscan.io/tx/0x127a884355f40f3c80695b0e8d57a82e7496f5821cf40ae5b789ffc3a4046297)


Contract:
0x900e8298676f6f2dd829c8351a73d3ab3c3f6006

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

To run and test the project is necessar have installed:
* [NodeJS](http://www.nodejs.org/en).
* [http-server](https://www.npmjs.com/package/http-server)

### Installing

Before install the project's dependencies is needs install the http-server as a global tool. Use the followinf command:

```
npm install -g http-server
```

To install all the dependecies of the project is necessary run the following command on the terminal on the same folder that are the package.json file: 

```
npm install
```

After run this command the project will be prepare to be started.

## Booting the project

On the same folder, where is located the index.html file, execute the following commando on the terminal:

```
http-server
```

## Testing 

After run the command http-server the application will be aavliable on the url http://localhost:8080.

### Claimina Star

[http://localhost:8000/](href='http://localhost:8000/')

On the Claim tab:
- Fill The required field (Star Name, Coordinates, Story and tokenId)
- The tokenID will be used to implement the [ERC721](http://erc721.org/) token and needs to be unique.
- Click on the Claim button.
- Wait for the dialog shown up with the information about the transaction.

On the Search tab:
- Fill the tokenID field and click on Search button
- Wait weither informations of the star found or the message not found.

## Built With

* [NodeJS](https://nodejs.org/en/)
* [Web3](https://web3js.readthedocs.io/en/1.0/)
* [Solidity](https://solidity.readthedocs.io/en/v0.4.24/index.html)

## Contributing

I am the only contributor.
For more details about my personal projects read [Ythalo Rossy](https://github.com/ythalorossy).

## Versioning

We use [SemVer](http://semver.org/) for versioning. For the versions available, see the [tags on this repository](https://github.com/ythalorossy/udacity_blockchain_developer_4/tags). 

## Authors

* **Ythalo Rossy S. Lira** - *Initial work* - [Udacity Blockchain Developer](https://github.com/ythalorossy/udacity_blockchain_developer_5)

See also the list of [contributors](https://github.com/ythalorossy/udacity_blockchain_developer_5/graphs/contributors) who participated in this project.

## License

This project is licensed under the MIT License - see the [https://opensource.org/licenses/MIT](https://opensource.org/licenses/MIT).

## Acknowledgments

* I am doing the Blockchain Developer course on Udacity
* I can see that the technology field is moving so quickly and inside that moviment are the Blockchain

