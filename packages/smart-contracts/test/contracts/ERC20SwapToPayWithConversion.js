const ethers = require('ethers');

const { expectEvent, expectRevert } = require('@openzeppelin/test-helpers');
const { expect } = require('chai');
const { BigNumber } = require('ethers');


const TestERC20 = artifacts.require('./TestERC20.sol');

const ERC20FeeProxy = artifacts.require('./ERC20FeeProxy.sol');

const ChainlinkConversionPath = artifacts.require('./ChainlinkConversionPath.sol');
const AggTest = artifacts.require('AggTest.sol');
const Erc20ConversionProxy = artifacts.require('./Erc20ConversionProxy.sol');

const FakeSwapRouter = artifacts.require('./FakeSwapRouter.sol');

const ERC20SwapToPayWithConversion = artifacts.require('./ERC20SwapToPayWithConversion.sol');

contract('ERC20SwapToPayWithConversion', function (accounts) {
  const admin = accounts[0];
  const from = accounts[1];
  const to = accounts[2];
  const builder = accounts[3];

  const USDhash = '0x775EB53d00DD0Acd3EC1696472105d579B9b386b';
  const exchangeRateOrigin = Math.floor(Date.now() / 1000);
  const referenceExample = '0xaaaa';

  let paymentNetworkErc20;
  let spendErc20;
  let erc20FeeProxy;
  let erc20ConversionProxy;
  let fakeSwapRouter;
  let testERC20SwapToPayWithConversion;
  let initialFromBalance;
  let chainlinkConversion;
  let aggTest;

  const fiatDecimal = BigNumber.from("100000000");
  const erc20Decimal = BigNumber.from("1000000000000000000");

  beforeEach(async () => {
    paymentNetworkErc20 = await TestERC20.new(erc20Decimal.mul(10000), {
      from: admin,
    });
    spendErc20 = await TestERC20.new(erc20Decimal.mul(1000), {
      from: admin,
    });

    erc20FeeProxy = await ERC20FeeProxy.new({
      from: admin,
    });

    // deploy fake chainlink conversion path
    chainlinkConversion= await ChainlinkConversionPath.new();
    aggTest = await AggTest.new();
    await chainlinkConversion.updateAggregator(
        USDhash, 
        paymentNetworkErc20.address,
        aggTest.address);

    // deploy conversion proxy
    erc20ConversionProxy= await Erc20ConversionProxy.new(
      erc20FeeProxy.address,
      chainlinkConversion.address);
    

    // Deploy a fake router and feed it with 200 payment ERC20 + 100 requested ERC20
    // The fake router fakes 2 payment ERC20 = 1 requested ERC20
    fakeSwapRouter = await FakeSwapRouter.new({
      from: admin,
    });
    await spendErc20.transfer(fakeSwapRouter.address, erc20Decimal.mul(100), {
      from: admin,
    });
    await paymentNetworkErc20.transfer(fakeSwapRouter.address, erc20Decimal.mul(200), {
      from: admin,
    });

    // give payer some token
    await spendErc20.transfer(from, erc20Decimal.mul(200), {
      from: admin,
    });

    testERC20SwapToPayWithConversion = await ERC20SwapToPayWithConversion.new(fakeSwapRouter.address, erc20ConversionProxy.address);

    initialFromBalance = await spendErc20.balanceOf(from);
    await spendErc20.approve(testERC20SwapToPayWithConversion.address, initialFromBalance, { from });
  });
  
  expectFromBalanceUnchanged = async () => {
    const finalFromBalance = await spendErc20.balanceOf(from);
    expect(finalFromBalance.toString()).to.equals(initialFromBalance.toString());
  };

  afterEach(async () => {
    // The contract should never keep any fund
    const contractPaymentCcyBalance = await paymentNetworkErc20.balanceOf(testERC20SwapToPayWithConversion.address);
    const contractRequestCcyBalance = await spendErc20.balanceOf(testERC20SwapToPayWithConversion.address);
    expect(contractPaymentCcyBalance.toNumber()).to.equals(0);
    expect(contractRequestCcyBalance.toNumber()).to.equals(0);
  });

  it('converts, swaps and pays the request', async function () {
    const beforePayerBalance = await spendErc20.balanceOf(from);

    let { tx } = await testERC20SwapToPayWithConversion.swapTransferWithReference(
      to,
      fiatDecimal.mul(10),
      erc20Decimal.mul(66),
      [spendErc20.address, paymentNetworkErc20.address], // _uniswapPath
      [USDhash, paymentNetworkErc20.address], // _chainlinkPath
      referenceExample,
      fiatDecimal.mul(1),
      builder,
      exchangeRateOrigin + 100, // _uniswapDeadline
      0, // _chainlinkMaxRateTimespan
      { from },
    );

    await expectEvent.inTransaction(tx, Erc20ConversionProxy, 'TransferWithConversionAndReference', {
      amount: fiatDecimal.mul(10).toString(),
      currency: USDhash,
      paymentReference: ethers.utils.keccak256(referenceExample),
      feeAmount: fiatDecimal.mul(1).toString(),
      maxRateTimespan: '0',
    });

    await expectEvent.inTransaction(tx, ERC20FeeProxy, 'TransferWithReferenceAndFee', {
      tokenAddress: paymentNetworkErc20.address,
      to,
      amount: erc20Decimal.mul(10).mul(3).toString(),
      paymentReference: ethers.utils.keccak256(referenceExample),
      feeAmount: erc20Decimal.mul(1).mul(3).toString(),
      feeAddress: builder,
    });

    const finalBuilderBalance = await paymentNetworkErc20.balanceOf(builder);
    const finalIssuerBalance = await paymentNetworkErc20.balanceOf(to);
    expect(finalBuilderBalance.toString(), 'builder balance is wrong').to.equals(erc20Decimal.mul(3).toString());
    expect(finalIssuerBalance.toString(), 'issuer balance is wrong').to.equals(erc20Decimal.mul(30).toString());

    const finalPayerBalance = await spendErc20.balanceOf(from);
    expect(beforePayerBalance.sub(finalPayerBalance).toString(), 'payer balance is wrong').to.equals(erc20Decimal.mul(66).toString());
  });

  it('does not pay anyone if I swap 0', async function () {
    let {
      tx,
      receipt: { gasUsed },
    } = await testERC20SwapToPayWithConversion.swapTransferWithReference(
      to,
      0,
      0,
      [spendErc20.address, paymentNetworkErc20.address], // _uniswapPath
      [USDhash, paymentNetworkErc20.address], // _chainlinkPath
      referenceExample,
      0,
      builder,
      exchangeRateOrigin + 100, // _uniswapDeadline
      0, // _chainlinkMaxRateTimespan
      { from },
    );

    await expectEvent.inTransaction(tx, Erc20ConversionProxy, 'TransferWithConversionAndReference', {
      amount: '0',
      currency: USDhash,
      paymentReference: ethers.utils.keccak256(referenceExample),
      feeAmount: '0',
      maxRateTimespan: '0',
    });

    await expectEvent.inTransaction(tx, ERC20FeeProxy, 'TransferWithReferenceAndFee', {
      tokenAddress: paymentNetworkErc20.address,
      to,
      amount: '0',
      paymentReference: ethers.utils.keccak256(referenceExample),
      feeAmount: '0',
      feeAddress: builder,
    });

    const finalBuilderBalance = await paymentNetworkErc20.balanceOf(builder);
    const finalIssuerBalance = await paymentNetworkErc20.balanceOf(to);
    expect(finalBuilderBalance.toNumber()).to.equals(0);
    expect(finalIssuerBalance.toNumber()).to.equals(0);
  });

  it('cannot swap if too few payment tokens', async function () {
    await expectRevert.unspecified(
      testERC20SwapToPayWithConversion.swapTransferWithReference(
        to,
        fiatDecimal.mul(10),
        erc20Decimal.mul(50),
        [spendErc20.address, paymentNetworkErc20.address], // _uniswapPath
        [USDhash, paymentNetworkErc20.address], // _chainlinkPath
        referenceExample,
        fiatDecimal.mul(1),
        builder,
        exchangeRateOrigin + 100, // _uniswapDeadline
        0, // _chainlinkMaxRateTimespan
        { from },
      ),
    );
    await expectFromBalanceUnchanged();
  });

  it('cannot swap with a past deadline', async function () {
    await expectRevert.unspecified(
      testERC20SwapToPayWithConversion.swapTransferWithReference(
        to,
        fiatDecimal.mul(10),
        erc20Decimal.mul(66),
        [spendErc20.address, paymentNetworkErc20.address], // _uniswapPath
        [USDhash, paymentNetworkErc20.address], // _chainlinkPath
        referenceExample,
        fiatDecimal.mul(1),
        builder,
        exchangeRateOrigin - 15, // _unisapDeadline
        0, // _chainlinkMaxRateTimespan
        { from },
      ),
    );
    await expectFromBalanceUnchanged();
  });


  it('cannot swap more tokens than liquidity', async function () {
    await spendErc20.approve(testERC20SwapToPayWithConversion.address, erc20Decimal.mul(6600), { from });

    await expectRevert.unspecified(
      testERC20SwapToPayWithConversion.swapTransferWithReference(
        to,
        fiatDecimal.mul(1000),
        erc20Decimal.mul(6600),
        [spendErc20.address, paymentNetworkErc20.address], // _uniswapPath
        [USDhash, paymentNetworkErc20.address], // _chainlinkPath
        referenceExample,
        fiatDecimal.mul(100),
        builder,
        exchangeRateOrigin + 100, // _uniswapDeadline
        0, // _chainlinkMaxRateTimespan
        { from },
      ),
    );
    await expectFromBalanceUnchanged();
  });

  it('cannot swap more tokens than balance', async function () {
    await spendErc20.approve(testERC20SwapToPayWithConversion.address, erc20Decimal.mul(60), { from });

    await expectRevert.unspecified(
      testERC20SwapToPayWithConversion.swapTransferWithReference(
        to,
        fiatDecimal.mul(10),
        erc20Decimal.mul(66),
        [spendErc20.address, paymentNetworkErc20.address], // _uniswapPath
        [USDhash, paymentNetworkErc20.address], // _chainlinkPath
        referenceExample,
        fiatDecimal.mul(1),
        builder,
        exchangeRateOrigin + 100, // _unisapDeadline
        0, // _chainlinkMaxRateTimespan
        { from },
      ),
    );
    await expectFromBalanceUnchanged();
  });

});