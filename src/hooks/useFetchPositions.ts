import { useRequest } from 'ahooks';
import BigNumber from 'bignumber.js';
import { ContractCallContext, Multicall } from 'ethereum-multicall';
import { ethers } from 'ethers';
import { createContext, useContext, useEffect, useMemo } from 'react';
import { useAccount } from 'wagmi';
import { futureLongContractAddr, futureShortContractAddr } from '../config';
import futureAbi from '../constants/abis/future.json';
import futureLongAbi from '../constants/abis/futureLong.json';
import { tradeDirection } from '../pages/future';

// 强平保证金率
const liqRate = 0.02;

export const useFetchPositionsInit = ({ futurePrice }: any) => {
  const { address: account } = useAccount();
  const multiCallUserInfo = async (account: any) => {
    const { ethereum } = window as any;

    const provider = new ethers.providers.Web3Provider(ethereum);
    // const multiCallProvider = new Provider(provider, cid);
    const multicall = new Multicall({
      ethersProvider: provider,
      tryAggregate: true,
    });

    const contractCallContext: ContractCallContext[] = [
      {
        reference: 'futureShortContract',
        contractAddress: futureShortContractAddr,
        abi: futureAbi,
        calls: [
          {
            reference: 'getUserBalance',
            methodName: 'getUserBalance',
            methodParameters: [account],
          },
          {
            reference: 'traderPosition',
            methodName: 'traderPosition',
            methodParameters: [account],
          },
        ],
      },
      {
        reference: 'futureLongContract',
        contractAddress: futureLongContractAddr,
        abi: futureLongAbi,
        calls: [
          {
            reference: 'getUserBalance',
            methodName: 'getUserBalance',
            methodParameters: [account],
          },
          {
            reference: 'traderPosition',
            methodName: 'traderPosition',
            methodParameters: [account],
          },
        ],
      },
    ];

    const multiCallResult = await multicall.call(contractCallContext);
    // 空单仓位
    const shortFutureContractRes = multiCallResult.results.futureShortContract.callsReturnContext;
    // 多单仓位
    const longFutureContractRes = multiCallResult.results.futureLongContract.callsReturnContext;

    // [开仓均价, 开仓数量, 保证金数量, side]
    const tempShort = shortFutureContractRes[1]?.returnValues;
    if (!tempShort.length || !tempShort[1] || !tempShort[2]) return;
    const entryPriceShort = ethers.BigNumber.from(tempShort[0]).toString();
    const tokenAmountShort = ethers.utils.formatUnits(tempShort[1], 0)?.toString();
    const marginAmountShort = ethers.utils.formatUnits(tempShort[2], 6)?.toString();
    const traderShortPosition = [entryPriceShort, tokenAmountShort, marginAmountShort, tradeDirection.SHORT];

    const tempLong = longFutureContractRes[1]?.returnValues;
    if (!tempLong.length || !tempLong[1] || !tempLong[2]) return;
    const entryPriceLong = ethers.BigNumber.from(tempLong[0]).toString();
    const tokenAmountLong = ethers.utils.formatUnits(tempLong[1], 0)?.toString();
    const marginAmountLong = ethers.utils.formatUnits(tempLong[2], 9)?.toString();
    const traderLongPosition = [entryPriceLong, tokenAmountLong, marginAmountLong, tradeDirection.LONG];

    return {
      [tradeDirection.LONG]: [...traderLongPosition],
      [tradeDirection.SHORT]: [...traderShortPosition],
    };
  };

  const { run, data } = useRequest(multiCallUserInfo, { manual: true, pollingInterval: 50000 });

  useEffect(() => {
    if (account) {
      run(account);
    }
  }, [account]);

  const longPosition = useMemo(() => data?.LONG, [data]);
  const shortPosition = useMemo(() => data?.SHORT, [data]);

  // [入场价, tokenAmount, marginAmount]
  const longPositionParams = useMemo(() => {
    if (
      !longPosition ||
      !longPosition?.length ||
      BigNumber(longPosition[1]).isNaN() ||
      BigNumber(longPosition[1]).lte(0) ||
      !futurePrice
    )
      return undefined;

    console.table(longPosition);
    const originCurrentPrice = BigNumber(futurePrice).multipliedBy(100).toString();
    const originEntryPrice = longPosition[0]; // U
    const originTokenAmount = longPosition[1]; // 张
    const originCollateral = longPosition[2]; // Collateral ETH
    const currenPrice = BigNumber(originCurrentPrice).div(100).toString();
    const entryPrice = BigNumber(originEntryPrice).div(100).toString();
    // const marginAmount = ethers.utils.formatUnits(longPosition[2], 9);

    // 张数*面值
    const sizePrice = BigNumber(originTokenAmount).multipliedBy(0.01);

    // 收益（ ETH个数）= 张数*面值 *（1/S1 -1/S2)
    const earnings = BigNumber(sizePrice).multipliedBy(
      BigNumber(1).div(entryPrice).minus(BigNumber(1).div(currenPrice)),
    );

    // 收益率 = 收益 / 保证金
    const earningRates = BigNumber(earnings).div(originCollateral).multipliedBy(100);

    // 总仓位价值（ETH个数） = 张数*面值 / S2;
    const totalPositionValue = BigNumber(sizePrice).div(currenPrice);

    // 用户权益（ETH个数）= 保证金 + 收益
    const userProfit = BigNumber(originCollateral).plus(earnings);

    // 当前杠杆 = 总仓位价值 / 用户权益
    const leverage = BigNumber(totalPositionValue).div(userProfit);

    // 强平价U =（1+0.02/（1/S1 + originCollateral /（张数*面值））
    const liqPrice = BigNumber(1 + liqRate).div(
      BigNumber(1).div(entryPrice).plus(BigNumber(originCollateral).div(sizePrice)),
    );

    const params = {
      leverage: leverage.toString(),
      netValue: userProfit.toString(),
      earnings: earnings.toString(),
      earningRates: earningRates.toString(),
      collateral: originCollateral,
      originEntryPrice,
      entryPrice,
      // 张数
      size: originTokenAmount,
      sizeValue: sizePrice.toString(),
      liqPrice: liqPrice.toString(),
      totalPositionValue: totalPositionValue.toString(),
      direction: tradeDirection.LONG,
    };

    console.table(params);

    return params;
  }, [futurePrice, longPosition]);

  const shortPositionParams = useMemo(() => {
    if (
      !shortPosition ||
      !shortPosition?.length ||
      BigNumber(shortPosition[1]).isNaN() ||
      BigNumber(shortPosition[1]).lte(0) ||
      !futurePrice
    )
      return undefined;
    console.table(shortPosition);
    const originCurrentPrice = BigNumber(futurePrice).multipliedBy(100).toString();
    const originEntryPrice = shortPosition[0]; // U
    const originTokenAmount = shortPosition[1]; // 张
    const originCollateral = shortPosition[2]; // Collateral ETH
    const currenPrice = BigNumber(originCurrentPrice).div(100).toString();
    const entryPrice = BigNumber(originEntryPrice).div(100).toString();
    // const marginAmount = ethers.utils.formatUnits(shortPosition[2], 9);

    // 张数*面值
    const sizePrice = BigNumber(originTokenAmount)
      // .multipliedBy(entryPrice)
      .multipliedBy(10e-5);

    // 收益（ U个数）= 张数*面值 *（S1 - S2)
    const earnings = BigNumber(sizePrice).multipliedBy(BigNumber(entryPrice).minus(currenPrice));

    // 收益率 = 收益 / 保证金
    const earningRates = BigNumber(earnings).div(originCollateral).multipliedBy(100);

    // 总仓位价值（U个数） = 张数*面值 * S2;
    const totalPositionValue = BigNumber(sizePrice).multipliedBy(currenPrice);

    // 用户权益（U个数）= 保证金 + 收益
    const userProfit = BigNumber(originCollateral).plus(earnings);

    // 当前杠杆 = 总仓位价值 / 用户权益
    const leverage = BigNumber(totalPositionValue).div(userProfit);

    // (S1 + n/N)/(1+ 强平保证金率)
    const liqPrice = BigNumber(BigNumber(entryPrice).plus(BigNumber(originCollateral).div(sizePrice))).div(
      BigNumber(1).plus(liqRate),
    );

    const params = {
      leverage: leverage.toString(),
      netValue: userProfit.toString(),
      earnings: earnings.toString(),
      earningRates: earningRates.toString(),
      collateral: originCollateral,
      originEntryPrice,
      entryPrice,
      // 张数
      size: originTokenAmount,
      sizeValue: sizePrice.toString(),
      liqPrice: liqPrice.toString(),
      totalPositionValue: totalPositionValue.toString(),
      direction: tradeDirection.SHORT,
    };

    console.table(params);

    return params;
  }, [futurePrice, shortPosition]);

  return {
    longPosition: longPositionParams,
    shortPosition: shortPositionParams,
    run,
  };
};

export const PositionCtx = createContext<any>(null);

export default () => {
  const ctx = useContext(PositionCtx);
  return ctx;
};
