import { expect } from 'chai';
import 'mocha';

import Utils from '@requestnetwork/utils';
import RequestDataAccessBlock from '../src/block';
import * as RequestEnum from '../src/enum';
import * as Types from '../src/types';

const CURRENT_VERSION = '0.1.0';
const transactionMock1 = { attribut1: 'plop', attribut2: 'value' };
const transactionHash1 = Utils.crypto.normalizeKeccak256Hash(transactionMock1);
const transactionMock2 = { attribut1: 'foo', attribut2: 'bar' };
const transactionHash2 = Utils.crypto.normalizeKeccak256Hash(transactionMock2);
const signatureMock = {
  method: RequestEnum.REQUEST_DATA_ACCESS_SIGNATURE_METHOD.ECDSA,
  value: '0x12345',
};
const signedTransaxtionMock1: Types.IRequestDataAccessTransaction = {
  data: transactionMock1,
  signature: signatureMock,
};
const signedTransaxtionMock2: Types.IRequestDataAccessTransaction = {
  data: transactionMock2,
  signature: signatureMock,
};

const arbitraryIndex1 = 'Oxaaaaaa';
const arbitraryIndex2 = 'Oxccccccccccc';

const emptyblock = RequestDataAccessBlock.createEmptyBlock();
const blockWith1tx = RequestDataAccessBlock.pushTransaction(
  emptyblock,
  signedTransaxtionMock1,
  [arbitraryIndex1, arbitraryIndex2],
);
const blockWith2tx = RequestDataAccessBlock.pushTransaction(
  blockWith1tx,
  signedTransaxtionMock2,
  [arbitraryIndex2],
);

/* tslint:disable:no-unused-expression */
describe('block', () => {
  describe('createEmptyBlock', () => {
    it('can create an empty block', () => {
      const emptyblock1 = RequestDataAccessBlock.createEmptyBlock();
      expect(emptyblock1.header, 'header is wrong').to.be.deep.equal({
        index: {},
        version: CURRENT_VERSION,
      });
      expect(
        emptyblock1.transactions,
        'transactions are wrong',
      ).to.be.deep.equal([]);
    });
  });

  describe('pushTransaction', () => {
    it('can pushTransaction with index an empty block', () => {
      const newBlock = RequestDataAccessBlock.pushTransaction(
        emptyblock,
        signedTransaxtionMock1,
        [arbitraryIndex1, arbitraryIndex2],
      );
      // empty block mush remain empty
      expect(
        emptyblock.header,
        'previous header must not change',
      ).to.be.deep.equal({
        index: {},
        version: CURRENT_VERSION,
      });
      expect(
        emptyblock.transactions,
        'previous transactions must not change',
      ).to.be.deep.equal([]);

      // new block
      const indexExpected: any = {};
      indexExpected[transactionHash1] = [0];
      indexExpected[arbitraryIndex1] = [0];
      indexExpected[arbitraryIndex2] = [0];

      expect(newBlock.header, 'header is wrong').to.be.deep.equal({
        index: indexExpected,
        version: CURRENT_VERSION,
      });
      expect(newBlock.transactions, 'transactions are wrong').to.be.deep.equal([
        signedTransaxtionMock1,
      ]);
    });
    it('can pushTransaction with index a NOT empty block', () => {
      const previousBlock = RequestDataAccessBlock.pushTransaction(
        emptyblock,
        signedTransaxtionMock1,
      );

      const newBlock = RequestDataAccessBlock.pushTransaction(
        previousBlock,
        signedTransaxtionMock2,
        [arbitraryIndex1, arbitraryIndex2],
      );
      // empty block mush remain empty

      const previousIndexExpected: any = {};
      previousIndexExpected[transactionHash1] = [0];

      expect(
        previousBlock.header,
        'previous header must not change',
      ).to.be.deep.equal({
        index: previousIndexExpected,
        version: CURRENT_VERSION,
      });
      expect(
        previousBlock.transactions,
        'transactions are wrong',
      ).to.be.deep.equal([signedTransaxtionMock1]);

      // new block
      const indexExpected: any = {};
      indexExpected[transactionHash1] = [0];
      indexExpected[transactionHash2] = [1];
      indexExpected[arbitraryIndex1] = [1];
      indexExpected[arbitraryIndex2] = [1];

      expect(newBlock.header, 'header is wrong').to.be.deep.equal({
        index: indexExpected,
        version: CURRENT_VERSION,
      });
      expect(newBlock.transactions, 'transactions are wrong').to.be.deep.equal([
        signedTransaxtionMock1,
        signedTransaxtionMock2,
      ]);
    });
    it('can pushTransaction without index on an empty block', () => {
      const newBlock = RequestDataAccessBlock.pushTransaction(
        emptyblock,
        signedTransaxtionMock1,
      );
      // empty block mush remain empty
      expect(
        emptyblock.header,
        'previous header must not change',
      ).to.be.deep.equal({
        index: {},
        version: CURRENT_VERSION,
      });
      expect(
        emptyblock.transactions,
        'previous transactions must not change',
      ).to.be.deep.equal([]);

      // new block
      const indexExpected: any = {};
      indexExpected[transactionHash1] = [0];

      expect(newBlock.header, 'header is wrong').to.be.deep.equal({
        index: indexExpected,
        version: CURRENT_VERSION,
      });
      expect(newBlock.transactions, 'transactions are wrong').to.be.deep.equal([
        signedTransaxtionMock1,
      ]);
    });
    it('can pushTransaction without index on a NOT empty block', () => {
      const previousBlock = RequestDataAccessBlock.pushTransaction(
        emptyblock,
        signedTransaxtionMock1,
      );
      const newBlock = RequestDataAccessBlock.pushTransaction(
        previousBlock,
        signedTransaxtionMock2,
      );
      // empty block mush remain empty

      const previousIndexExpected: any = {};
      previousIndexExpected[transactionHash1] = [0];

      expect(
        previousBlock.header,
        'previous header must not change',
      ).to.be.deep.equal({
        index: previousIndexExpected,
        version: CURRENT_VERSION,
      });
      expect(
        previousBlock.transactions,
        'transactions are wrong',
      ).to.be.deep.equal([signedTransaxtionMock1]);

      // new block
      const indexExpected: any = {};
      indexExpected[transactionHash1] = [0];
      indexExpected[transactionHash2] = [1];

      expect(newBlock.header, 'header is wrong').to.be.deep.equal({
        index: indexExpected,
        version: CURRENT_VERSION,
      });
      expect(newBlock.transactions, 'transactions are wrong').to.be.deep.equal([
        signedTransaxtionMock1,
        signedTransaxtionMock2,
      ]);
    });
    it('can pushTransaction with index with index already existing', () => {
      const newBlock = RequestDataAccessBlock.pushTransaction(
        blockWith1tx,
        signedTransaxtionMock2,
        [arbitraryIndex2],
      );
      // empty block mush remain empty

      const previousIndexExpected: any = {};
      previousIndexExpected[transactionHash1] = [0];
      previousIndexExpected[arbitraryIndex1] = [0];
      previousIndexExpected[arbitraryIndex2] = [0];

      expect(
        blockWith1tx.header,
        'previous header must not change',
      ).to.be.deep.equal({
        index: previousIndexExpected,
        version: CURRENT_VERSION,
      });
      expect(
        blockWith1tx.transactions,
        'transactions are wrong',
      ).to.be.deep.equal([signedTransaxtionMock1]);

      // new block
      const indexExpected: any = {};
      indexExpected[transactionHash1] = [0];
      indexExpected[transactionHash2] = [1];
      indexExpected[arbitraryIndex1] = [0];
      indexExpected[arbitraryIndex2] = [0, 1];

      expect(newBlock.header, 'header is wrong').to.be.deep.equal({
        index: indexExpected,
        version: CURRENT_VERSION,
      });
      expect(newBlock.transactions, 'transactions are wrong').to.be.deep.equal([
        signedTransaxtionMock1,
        signedTransaxtionMock2,
      ]);
    });
  });

  describe('getAllTransactions', () => {
    it('can getAllTransactions on empty block', () => {
      const allTxs = RequestDataAccessBlock.getAllTransactions(emptyblock);
      expect(allTxs, 'transactions must be empty').to.be.deep.equal([]);
    });
    it('can getAllTransactions on NOT empty block', () => {
      let newBlock = RequestDataAccessBlock.pushTransaction(
        emptyblock,
        signedTransaxtionMock1,
        [arbitraryIndex1, arbitraryIndex2],
      );
      newBlock = RequestDataAccessBlock.pushTransaction(
        newBlock,
        signedTransaxtionMock2,
      );
      const allTxs = RequestDataAccessBlock.getAllTransactions(newBlock);
      expect(allTxs, 'transactions must be empty').to.be.deep.equal([
        signedTransaxtionMock1,
        signedTransaxtionMock2,
      ]);
    });
  });

  describe('getAllIndex', () => {
    it('can getAllIndex on empty block', () => {
      const allIndexes = RequestDataAccessBlock.getAllIndex(emptyblock);
      expect(allIndexes, 'transactions must be empty').to.be.deep.equal({});
    });
    it('can getAllIndex on NOT empty block', () => {
      const indexExpected: any = {};
      indexExpected[transactionHash1] = [0];
      indexExpected[transactionHash2] = [1];
      indexExpected[arbitraryIndex1] = [0];
      indexExpected[arbitraryIndex2] = [0, 1];

      const allIndexes = RequestDataAccessBlock.getAllIndex(blockWith2tx);
      expect(allIndexes, 'transactions must be empty').to.be.deep.equal(
        indexExpected,
      );
    });
  });

  describe('getTransactionFromPosition', () => {
    it('can getTransactionFromPosition on an empty block', () => {
      const tx = RequestDataAccessBlock.getTransactionFromPosition(
        emptyblock,
        0,
      );
      expect(tx, 'tx must be undefined').to.be.undefined;
    });
    it('can getTransactionFromPosition with transaction existing', () => {
      const tx = RequestDataAccessBlock.getTransactionFromPosition(
        blockWith1tx,
        0,
      );

      expect(tx, 'transactions is wrong').to.be.deep.equal(
        signedTransaxtionMock1,
      );
    });
  });

  describe('getTransactionPositionByIndex', () => {
    it('can getTransactionPositionByIndex on an empty block', () => {
      const txIndex = RequestDataAccessBlock.getTransactionPositionByIndex(
        emptyblock,
        arbitraryIndex1,
      );
      expect(txIndex, 'txIndex is wrong').to.be.deep.equal([]);
    });
    it('can getTransactionPositionByIndex with index existing', () => {
      const txIndex = RequestDataAccessBlock.getTransactionPositionByIndex(
        blockWith1tx,
        arbitraryIndex1,
      );
      expect(txIndex, 'txIndex is wrong').to.be.deep.equal([0]);
    });
    it('can getTransactionPositionByIndex with index used twice ', () => {
      const txIndex = RequestDataAccessBlock.getTransactionPositionByIndex(
        blockWith2tx,
        arbitraryIndex2,
      );
      expect(txIndex, 'txIndex is wrong').to.be.deep.equal([0, 1]);
    });
  });

  describe('getTransactionsByPositions', () => {
    it('can getTransactionsByPositions on an empty block', () => {
      const txs = RequestDataAccessBlock.getTransactionsByPositions(
        emptyblock,
        [0, 1],
      );
      expect(txs, 'txs must be empty').to.be.deep.equal([]);
    });
    it('can getTransactionsByPositions on missing transaction', () => {
      const txs = RequestDataAccessBlock.getTransactionsByPositions(
        blockWith1tx,
        [0, 1],
      );
      expect(txs, 'txs is wrong').to.be.deep.equal([signedTransaxtionMock1]);
    });
    it('can getTransactionsByPositions on more than one transaction', () => {
      const txs = RequestDataAccessBlock.getTransactionsByPositions(
        blockWith2tx,
        [0, 1],
      );
      expect(txs, 'txs is wrong').to.be.deep.equal([
        signedTransaxtionMock1,
        signedTransaxtionMock2,
      ]);
    });
    it('can getTransactionsByPositions on more than one transaction with array not sorted', () => {
      const txs = RequestDataAccessBlock.getTransactionsByPositions(
        blockWith2tx,
        [1, 0],
      );
      expect(txs, 'txs is wrong').to.be.deep.equal([
        signedTransaxtionMock1,
        signedTransaxtionMock2,
      ]);
    });
    it('can getTransactionsByPositions on more than one transaction with array duplication', () => {
      const txs = RequestDataAccessBlock.getTransactionsByPositions(
        blockWith2tx,
        [1, 1, 0, 1, 0, 0],
      );
      expect(txs, 'txs is wrong').to.be.deep.equal([
        signedTransaxtionMock1,
        signedTransaxtionMock2,
      ]);
    });
  });

  describe('getIndexes', () => {
    it('can getIndexes on an empty block', () => {
      const txs = RequestDataAccessBlock.getIndexes(emptyblock, [
        transactionHash1,
        transactionHash2,
      ]);
      expect(txs, 'txs must be empty').to.be.deep.equal([]);
    });
    it('can getIndexes on missing transaction', () => {
      const txs = RequestDataAccessBlock.getIndexes(blockWith1tx, [
        transactionHash1,
        transactionHash2,
      ]);
      expect(txs, 'txs is wrong').to.be.deep.equal([0]);
    });
    it('can getIndexes on more than one transaction', () => {
      const txs = RequestDataAccessBlock.getIndexes(blockWith2tx, [
        transactionHash1,
        transactionHash2,
      ]);
      expect(txs, 'txs is wrong').to.be.deep.equal([0, 1]);
    });
    it('can getIndexes on more than one transaction with array not sorted', () => {
      const txs = RequestDataAccessBlock.getIndexes(blockWith2tx, [
        transactionHash2,
        transactionHash1,
      ]);
      expect(txs, 'txs is wrong').to.be.deep.equal([0, 1]);
    });
    it('can getIndexes on more than one transaction with array duplication', () => {
      const txs = RequestDataAccessBlock.getIndexes(blockWith2tx, [
        transactionHash2,
        transactionHash1,
        transactionHash2,
        transactionHash2,
        transactionHash1,
        transactionHash1,
        transactionHash1,
      ]);
      expect(txs, 'txs is wrong').to.be.deep.equal([0, 1]);
    });
    it('can getIndexes with index use twice', () => {
      const txs = RequestDataAccessBlock.getIndexes(blockWith2tx, [
        arbitraryIndex2,
      ]);
      expect(txs, 'txs is wrong').to.be.deep.equal([0, 1]);
    });
    it('can getIndexes with index use twice and duplication', () => {
      const txs = RequestDataAccessBlock.getIndexes(blockWith2tx, [
        arbitraryIndex2,
        transactionHash2,
        transactionHash1,
        arbitraryIndex1,
      ]);
      expect(txs, 'txs is wrong').to.be.deep.equal([0, 1]);
    });
  });

  describe('can use JSON', () => {
    it('can use JSON.stringify and JSON.parse', () => {
      const block = RequestDataAccessBlock.pushTransaction(
        blockWith1tx,
        signedTransaxtionMock2,
        [arbitraryIndex2],
      );
      const strExpected: string = `{"header":{"index":{"Oxaaaaaa":[0],"Oxccccccccccc":[0,1],"0xe53f3ea2f5a8e5f2ceb89609a9c2fa783181e70f1a7508dccf5b770b846a6a8d":[0],"0x320728cd4063b523cb1b4508c6e1627f497bde5cbd46b03430e438289c6e1d23":[1]},"version":"${CURRENT_VERSION}"},"transactions":[{"data":{"attribut1":"plop","attribut2":"value"},"signature":{"method":"ecdsa","value":"0x12345"}},{"data":{"attribut1":"foo","attribut2":"bar"},"signature":{"method":"ecdsa","value":"0x12345"}}]}`;
      expect(JSON.stringify(block), 'Error stringify-ing a block').to.be.equal(
        strExpected,
      );

      expect(JSON.parse(strExpected), 'Error parsing a block').to.be.deep.equal(
        block,
      );
    });
  });
});
