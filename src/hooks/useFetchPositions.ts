import { LeverageLongContaact, LeverageShortContract, TRADE_DIRECTION_ENUM } from '@/configs/common';
import { recoilPositions } from '@/models/_global';
import { PositionsInterface } from '@/typings/_global';
import { multicall } from '@wagmi/core';
import { useRequest } from 'ahooks';
import BigNumber from 'bignumber.js';
import { ethers } from 'ethers';
import { useEffect, useMemo } from 'react';
import { useSetRecoilState } from 'recoil';
import { useAccount } from 'wagmi';

// 强平保证金率
const liqRate = 0.02;
let hasRuned = false;

const useFetchPositions = ({ futurePrice = 0 }: any) => {
  const setPositions = useSetRecoilState(recoilPositions);
  const { address } = useAccount();

  // multicall 方法
  const multiCallUserInfo = async () => {
    // const multicall = new Multicall({
    //   ethersProvider: provider,
    //   tryAggregate: true,
    // });

    const positionMultiCallResult: any = await multicall({
      contracts: [
        {
          ...LeverageLongContaact,
          functionName: 'traderPosition',
          args: [address],
        },
        {
          ...LeverageShortContract,
          functionName: 'traderPosition',
          args: [address],
        },
      ],
    });

    if (!positionMultiCallResult?.length) return null;

    // 多单仓位
    const longFutureContractRes: any[] = positionMultiCallResult[0];
    // 空单仓位
    const shortFutureContractRes: any[] = positionMultiCallResult[1];

    // [开仓均价, 开仓数量, 保证金数量, side]
    if (!longFutureContractRes.length || !longFutureContractRes[1] || !longFutureContractRes[2]) return;
    const entryPriceLong = ethers.BigNumber.from(longFutureContractRes[0])?.toString();
    const tokenAmountLong = ethers.utils.formatUnits(longFutureContractRes[1], 0)?.toString();
    const marginAmountLong = ethers.utils.formatUnits(longFutureContractRes[2], 9)?.toString();
    const traderLongPosition = [entryPriceLong, tokenAmountLong, marginAmountLong, TRADE_DIRECTION_ENUM.LONG];

    if (!shortFutureContractRes.length || !shortFutureContractRes[1] || !shortFutureContractRes[2]) return;
    const entryPriceShort = ethers.BigNumber.from(shortFutureContractRes[0])?.toString();
    const tokenAmountShort = ethers.utils.formatUnits(shortFutureContractRes[1], 0)?.toString();
    const marginAmountShort = ethers.utils.formatUnits(shortFutureContractRes[2], 6)?.toString();
    const traderShortPosition = [entryPriceShort, tokenAmountShort, marginAmountShort, TRADE_DIRECTION_ENUM.SHORT];

    return {
      [TRADE_DIRECTION_ENUM.LONG]: [...traderLongPosition],
      [TRADE_DIRECTION_ENUM.SHORT]: [...traderShortPosition],
    };
  };

  const { run, data } = useRequest(multiCallUserInfo, { manual: true });

  // 数据处理
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
    ) {
      return undefined;
    }

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
      direction: TRADE_DIRECTION_ENUM.LONG,
    };

    console.table(params);

    setPositions((old: PositionsInterface) => {
      const _old = JSON.parse(JSON.stringify(old));
      return {
        ..._old,
        [TRADE_DIRECTION_ENUM.LONG]: params,
      };
    });

    return params;
  }, [futurePrice, longPosition]);

  const shortPositionParams = useMemo(() => {
    if (
      !shortPosition ||
      !shortPosition?.length ||
      BigNumber(shortPosition[1]).isNaN() ||
      BigNumber(shortPosition[1]).lte(0) ||
      !futurePrice
    ) {
      return undefined;
    }
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
      direction: TRADE_DIRECTION_ENUM.SHORT,
    };

    console.table(params);

    setPositions((old: PositionsInterface) => {
      const _old = JSON.parse(JSON.stringify(old));
      return {
        ..._old,
        [TRADE_DIRECTION_ENUM.SHORT]: params,
      };
    });

    return params;
  }, [futurePrice, shortPosition]);

  useEffect(() => {
    if (address && !hasRuned) {
      hasRuned = true;
      run();
    }
  }, [address, run]);

  // useUnmount(() => {
  //   hasRuned = false;
  // });

  return {
    longPosition: longPositionParams,
    shortPosition: shortPositionParams,
    run,
  };
};

export default useFetchPositions;
