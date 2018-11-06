const StarNotary = artifacts.require('StarNotary');

function errorIsRevert(error) {
    // return error.message.startsWith("VM Exception while processing transaction: revert")
    return error.message.indexOf("revert") !== -1;
}

contract('StarNotary', accounts => {

    let [user0, user1, user2] = [accounts[0], accounts[1], accounts[2]];

    let starName = 'YRoss Star';
    let starStory = 'I found it when I was walking alone'
    let starRa = 'ra_032.155';
    let starDec = 'dec_121.874';
    let starMag = 'mag_245.978';

    // Before each test a contrct will be created
    beforeEach(async function () {
        this.contract = await StarNotary.new({ from: user0 });
    })

    describe('Create a Star', () => {

        it('can create a star and get information', async function () {

            let tokenId = 1;

            await this.contract.createStar(
                starName, starStory, starRa, starDec, starMag, tokenId, { from: user0 });

            const tokenIdToStarInfo = await this.contract.tokenIdToStarInfo(tokenId);

            assert.equal(tokenIdToStarInfo[0], starName);
            assert.equal(tokenIdToStarInfo[1], starStory);
            assert.equal(tokenIdToStarInfo[2], starRa);
            assert.equal(tokenIdToStarInfo[3], starDec);
            assert.equal(tokenIdToStarInfo[4], starMag);
        });

        it('can check if star exists based on coordinates', async function () {

            let tokenId = 1;

            await this.contract.createStar(
                starName, starStory, starRa, starDec, starMag, tokenId, { from: user0 });

            let exists = await this.contract.checkIfStarExist(
                starRa, starDec, starMag, { from: user0 });

            assert.equal(exists, true);
        });
    })

    describe('Selling and Buying stars', () => {

        let tokenId = 1;
        let starPrice = web3.toWei(.01, "ether");

        beforeEach(async function () {
            await this.contract.createStar(starName, starStory, starRa, starDec, starMag, tokenId, { from: user1 });
        })

        describe('User1 selling a star', () => {

            it('can user1 put up their star for sale', async function () {

                await this.contract.putStarUpForSale(tokenId, starPrice, { from: user1 });

                assert.equal(await this.contract.starsForSale(tokenId), starPrice, 'Star Price is different after sell');
            });

            it('can user1 get the funds after selling a star', async function () {

                // Star price to sell
                let starPrice = web3.toWei(.05, 'ether');

                // Put Star to sell
                await this.contract.putStarUpForSale(tokenId, starPrice, { from: user1 });

                // Store balance before the sale transaction
                let balanceOfUser1BeforeSaleTransaction = web3.eth.getBalance(user1);

                // User 2 buy a star sold for User 1
                await this.contract.buyStar(tokenId, { from: user2, value: starPrice });

                // Store balance after the sale transaction
                let balanceOfUser1AfterSaleTransaction = web3.eth.getBalance(user1);

                assert.equal(balanceOfUser1BeforeSaleTransaction.add(starPrice).toNumber(),
                    balanceOfUser1AfterSaleTransaction.toNumber());
            });
        });

        describe('User2 buying a star that was put up for sale', () => {

            let tokenId = 1;

            beforeEach(async function () {
                await this.contract.putStarUpForSale(tokenId, starPrice, { from: user1 })
            })

            it('can user2 is the owner of the star after bought it', async function () {
                await this.contract.buyStar(tokenId, { from: user2, value: starPrice })
                assert.equal(await this.contract.ownerOf(tokenId), user2)
            })

            it('can user2 correctly has their balance changed when overpaid', async function () {

                let overpaidAmount = web3.toWei(.05, 'ether')

                const balanceOfUser2BeforeTransaction = web3.eth.getBalance(user2)
                await this.contract.buyStar(tokenId, { from: user2, value: overpaidAmount, gasPrice: 0 })
                const balanceAfterUser2BuysStar = web3.eth.getBalance(user2)

                assert.equal(balanceOfUser2BeforeTransaction.sub(balanceAfterUser2BuysStar), starPrice)
            })
        })
    })

    describe('Minting Token', () => {

        let tokenId = 1;

        it('can mint token', async function () {
            await this.contract.mint(tokenId, { from: user0 })
            assert.equal(await this.contract.ownerOf(tokenId), user0)
        })

        describe('Duplicating mint token', () => {
            const mintId = 10
            const mintFrom = user1
            const mintDupeFrom = user2

            beforeEach(async function () {
                await this.contract.mint(mintId, { from: mintFrom })
            })

            it('cant mint already minted tokenId', async function () {
                try {
                    await this.contract.mint(mintId, { from: mintDupeFrom })
                } catch (error) {
                    assert(errorIsRevert(error))
                }
                assert.equal(await this.contract.ownerOf(mintId), mintFrom)
            })
        })
    })

    describe('Approval', () => {

        let tokenId = 1
        let tx

        beforeEach(async function () {
            await this.contract.mint(tokenId, { from: user1 })
            tx = await this.contract.approve(user2, tokenId, { from: user1 })
        })

        it('User1 sets User 2 as an approved address', async function () {
            assert.equal(await this.contract.getApproved(tokenId), user2)
        })

        it('User2 (approved) can now transfer', async function () {
            await this.contract.transferFrom(user1, user2, tokenId, { from: user2 })
            assert.equal(await this.contract.ownerOf(tokenId), user2)
        })

        it('Emits the correct event Approval', async function () {
            assert.equal(tx.logs[0].event, 'Approval')
        })
    });

    describe('Safe Transfer From', () => {

        let tokenId = 1;
        let tx;

        beforeEach(async function () {
            await this.contract.createStar(
                starName, starStory, starRa, starDec, starMag, tokenId, { from: user0 });
        });

        it('can user0 transfer token to user1', async function () {
            tx = await this.contract.safeTransferFrom(user0, user1, tokenId, { from: user0 });
            assert.equal(await this.contract.ownerOf(tokenId), user1);
        });

        it('Emits the correct event Transfer', async function () {
            assert.equal(tx.logs[0].event, 'Transfer')
        })

    });

    describe('Set Approval for all', () => {

        let tokenId = 1;
        let starPrice = web3.toWei(.01, "ether");
        let operator = user1;

        beforeEach(async function () {
            await this.contract.createStar(
                starName, starStory, starRa, starDec, starMag, tokenId, { from: user0 });
        });

        it('can user0 approval token for all', async function () {
            let tx = await this.contract.setApprovalForAll(operator, true, { from: user0 });
            assert.equal(tx.logs[0].event, 'ApprovalForAll')

            let isApproved = await this.contract.isApprovedForAll(user0, operator, { from: user0 });
            assert.equal(isApproved, true);

        });

        it('can user1 behalf user0 put up their star for sale ', async function () {

            let tx = await this.contract.setApprovalForAll(operator, true, { from: user0 });
            assert.equal(tx.logs[0].event, 'ApprovalForAll')

            await this.contract.putStarUpForSale(tokenId, starPrice, { from: operator });

            assert.equal(await this.contract.starsForSale(tokenId), starPrice, 'Star Price is different after sell');
        });

        it('can user1 behalf user0 transfer token to user2', async function () {

            let tx = await this.contract.setApprovalForAll(operator, true, { from: user0 });
            assert.equal(tx.logs[0].event, 'ApprovalForAll')

            tx = await this.contract.safeTransferFrom(user0, user2, tokenId, { from: operator });
            assert.equal(await this.contract.ownerOf(tokenId), user2);
            assert.equal(tx.logs[0].event, 'Transfer')
        });

        it('can user1 behalf user0 transfer token to user2', async function () {

            let tx = await this.contract.setApprovalForAll(operator, true, { from: user0 });
            assert.equal(tx.logs[0].event, 'ApprovalForAll')

            tx = await this.contract.safeTransferFrom(user0, user2, tokenId, { from: operator });
            assert.equal(await this.contract.ownerOf(tokenId), user2);
            assert.equal(tx.logs[0].event, 'Transfer')
        });

        it('can check if user1 is approved', async function () {

            let tx = await this.contract.approve(operator, tokenId, { from: user0 });
            assert.equal(tx.logs[0].event, 'Approval');

            let approvedAddress = await this.contract.getApproved(tokenId, { from: user0 });

            assert.equal(approvedAddress, operator);

        });

    });

    describe('Owners', function () {

        let tokenId = 1;
        let starPrice = web3.toWei(.01, "ether");
        let operator = user1;

        beforeEach(async function () {
            await this.contract.createStar(
                starName, starStory, starRa, starDec, starMag, tokenId, { from: user0 });
        });

        it('User0 is the owner of star', async function () {
            assert.equal(await this.contract.ownerOf( tokenId , { from : user0 } ), user0 );
        })

        it('can user0 transfer token to user1 and validate that user1 is owner', async function () {
            await this.contract.safeTransferFrom(user0, user1, tokenId, { from: user0 });
            assert.equal(await this.contract.ownerOf(tokenId), user1);
        });

    })

});