/* eslint-disable @iceworks/best-practices/recommend-polyfill */
/* eslint-disable function-paren-newline */
/* eslint-disable no-confusing-arrow */
/* eslint-disable @typescript-eslint/indent */
/* eslint-disable no-nested-ternary */
import { IconModalError, IconModalSuccess } from '@/assets/icons/IconGroup';
import { Button, Input, Modal, Pagination, Scrollbar, Select, Slider, Table, Tabs } from '@/components';
import { SmartButton } from '@/components/_global';
import TokenSelect from '@/components/_global/TokenSelect';
import TVChart from '@/components/_global/TradingView';
import { TRADE_DIRECTION_ENUM, TRADE_TOKEN } from '@/configs/common';
import useOptionExerciseDate from '@/hooks/option/useOptionExerciseDate';
import useOptionPriceMap from '@/hooks/option/useOptionPriceMap';
import useOptionReedem from '@/hooks/option/useOptionReedem';
import useInputChange from '@/hooks/useInputChange';
import {
  recoilBalances,
  recoilKlinePrice,
  recoilOptionEpochIds,
  recoilPerpetualPositions,
  recoilPoolBalances,
  recoilSettledOptionPositions,
  recoilUnsettledOptionPositions,
} from '@/models/_global';
import { PositionsInterface, SinglePositionInterface } from '@/typings/_global';
import { filterColor, getLiqPrice } from '@/utils/tools';
import { useBoolean, useCountDown, useInterval } from 'ahooks';
import BigNumber from 'bignumber.js';
import { ethers } from 'ethers';
import * as React from 'react';
import { useRecoilValue } from 'recoil';
import styled from 'styled-components';
import Confirm, { TradePerpetualInformation } from './components/Confirm';
import Fields from './components/Fields';

const { TableHead, TableBody } = Table;

const Wrapper = styled.div`
  display: flex;
  align-items: stretch;
  padding: 24px;
  min-width: 1280px;
  min-height: calc(100vh - 72px);
  .contract-declare {
    display: flex;
    flex-direction: column;
    gap: 24px;
    width: calc(100% - 366px);
  }
  .contract-dominate {
    display: flex;
    flex-direction: column;
    gap: 24px;
    margin-left: 24px;
    width: 342px;
  }
  .contract-declare > .info {
    gap: 34px;
    padding: 24px;
    background: #1e1f25;
    border-radius: 16px;
    .select {
      border: none;
      .inside {
        padding: 0;
      }
    }
    .coin {
      width: 154px;
      img {
        margin-right: 8px;
        width: 24px;
        height: 24px;
        border-radius: 50%;
      }
      span {
        font-weight: 500;
        font-size: 20px;
      }
    }
    .scroll-container {
      gap: 24px;
    }
    .crux {
      p:nth-child(1) {
        margin-bottom: 12px;
        font-size: 14px;
        line-height: 120%;
        color: #54678b;
        white-space: nowrap;
      }
      p:nth-child(2) {
        font-weight: 600;
        font-size: 20px;
        line-height: 120%;
        color: #e5e6ed;
      }
      img {
        margin-right: 8px;
        width: 24px;
        height: 24px;
        border-radius: 50%;
      }
    }
  }
  .contract-declare > .chart {
    padding: 24px;
    background: #1e1f25;
    border-radius: 16px;
    min-height: 500px;
  }
  .contract-declare > .order {
    padding: 24px;
    background: #1e1f25;
    border-radius: 16px;
    min-height: 486px;
    .tabs {
      .tab {
        gap: 8px;
      }
      li {
        position: relative;
        padding: 0 16px;
        height: 32px;
        line-height: 32px;
        font-weight: 600;
        font-size: 16px;
        z-index: 2;
        &.active {
          color: #e5e6ed;
        }
        &.default {
          color: #54678b;
        }
      }
      .bar {
        height: 32px;
        background: #34384c;
        border-radius: 16px;
      }
    }
    .table {
      .thead {
        justify-content: flex-start;
        height: 50px;
        border-bottom: 1px solid #34384c;
        p {
          white-space: nowrap;
          font-weight: 500;
          font-size: 14px;
          line-height: 120%;
          color: #54678b;
        }
      }
      .tbody {
        min-height: 460px;
        p {
          border-bottom: 1px solid transparent;
          white-space: nowrap;
          font-weight: 500;
          font-size: 14px;
          line-height: 50px;
          color: #e5e6ed;
        }
        li:first-child {
          p {
            border-top: 1px solid transparent;
          }
        }
        li + li {
          p {
            border-top: 1px solid #34384c;
          }
        }
      }
      /* p:not(:nth-child(1)) {
        text-align: right;
      } */
    }
    .one,
    .two {
      .thead,
      .tbody {
        /* 每一个单独设置*/
        min-width: 988px;
        p:nth-child(1) {
          flex: 1 0 148px;
          padding-left: 16px;
        }
        p:nth-child(2) {
          flex: 1 0 100px;
        }
        p:nth-child(3) {
          flex: 1 0 90px;
        }
        p:nth-child(4) {
          flex: 1 0 110px;
        }
        p:nth-child(5) {
          flex: 1 0 120px;
        }
        p:nth-child(6) {
          flex: 1 0 120px;
        }
        p:nth-child(7) {
          flex: 1 0 100px;
        }
        p:nth-child(8) {
          flex: 1 0 100px;
        }
        .action {
          flex: 1 0 100px;
        }
      }
      .tbody {
        .coin {
          margin-right: 8px;
          width: 16px;
          height: 16px;
          border-radius: 50%;
        }
        .action {
          gap: 16px;
          .close {
            padding: 0 8px;
            width: max-content;
          }
          .more {
            padding: 0;
            width: 24px;
            height: 24px;
            border-radius: 50%;
            svg:hover {
              fill: #316ed8;
            }
          }
          svg {
            width: 16px;
            height: 17px;
            fill: #e5e6ed;
            transition: all 0.3s ease-in-out;
          }
        }
        .select {
          border: none;
          .inside {
            padding: 0;
          }
        }
      }
    }
  }
  .contract-dominate > .panel {
    padding: 24px;
    background: #1e1f25;
    border-radius: 16px;
    .tabs {
      position: relative;
      height: 40px;
      background: #242731;
      border: 1px solid #34384c;
      box-shadow: 0px 2px 0px rgba(0, 0, 0, 0.02);
      border-radius: 20px;
      overflow: hidden;
      li {
        flex: 1;
        position: relative;
        height: 100%;
        text-align: center;
        font-weight: 600;
        font-size: 16px;
        line-height: 38px;
        color: #e5e6ed;
        user-select: none;
        cursor: pointer;
        z-index: 1;
        transition: all 0.3s ease-in-out;
      }
      .bar {
        position: absolute;
        width: 50%;
        height: 40px;
        transition: all 0.3s ease-in-out;
      }
    }
    .long {
      li:nth-child(2) {
        color: rgba(229, 230, 237, 0.75);
        &:hover {
          background: rgba(47, 50, 65, 0.5);
        }
      }
      .bar {
        left: 0;
        background: #13b0a7;
        border-radius: 20px 0px 0px 20px;
      }
    }
    .short {
      li:nth-child(1) {
        color: rgba(229, 230, 237, 0.75);
        &:hover {
          background: rgba(47, 50, 65, 0.5);
        }
      }
      .bar {
        left: 50%;
        background: #d9224f;
        border-radius: 0px 20px 20px 0px;
      }
    }
    .label {
      margin: 24px 0 12px 0;
      h6 {
        font-weight: 600;
        font-size: 16px;
        line-height: 120%;
        color: #54678b;
      }
      .input {
        width: 96px;
        input {
          width: 100%;
          text-align: center;
        }
      }
      .max {
        font-size: 14px;
        line-height: 120%;
        color: #54678b;
      }
      .leverage-size {
        color: #e5e6ed;
      }
    }
    .norm {
      gap: 12px;
      margin: 24px 0;
      p {
        padding: 0 16px;
        height: 32px;
        border-radius: 16px;
        white-space: nowrap;
        font-weight: 500;
        font-size: 16px;
        line-height: 32px;
        color: rgba(255, 255, 255, 0.25);
        user-select: none;
        cursor: pointer;
        transition: all 0.3s ease-in-out;
      }
      .active {
        color: #e5e6ed;
        background: #34384c;
      }
      .default {
        color: #54678b;
        transition: all 0.3s ease-in-out;
        &:hover {
          color: #e5e6ed;
          background: #34384c;
        }
      }
    }
    .select {
      border: none;
      p {
        margin-right: 8px;
        padding: 0;
        color: #54678b;
      }
      .inside {
        padding: 0 16px;
      }
      /* &.visible, */
      &.ticket,
      &:hover {
        background: #34384c;
        p {
          color: #e5e6ed;
        }
      }
    }
    hr {
      margin: 24px 0 0 0;
      padding: 0;
      height: 1px;
      border: none;
      background: #34384c;
    }
    .extra {
      font-size: 14px;
      color: rgba(255, 255, 255, 0.85);
      button {
        margin-right: 6px;
        padding: 0 12px;
      }
    }
    .marks {
      margin-top: 4px;
      /* width: calc(100% + 20px); */
      /* transform: translateX(-10px); */
      span {
        width: 20px;
        font-size: 12px;
        line-height: 120%;
        text-align: center;
        color: #54678b;
      }
    }
  }
  .contract-dominate > .detail {
    padding: 24px;
    background: #1e1f25;
    border-radius: 16px;
    h4 {
      margin-bottom: 24px;
      font-weight: 600;
      font-size: 16px;
      line-height: 120%;
      color: #e5e6ed;
    }
    .info {
      span:nth-child(1) {
        font-size: 16px;
        line-height: 120%;
        color: #54678b;
      }
      span:nth-child(2) {
        font-weight: 500;
        font-size: 16px;
        line-height: 120%;
        color: #e5e6ed;
      }
    }
    .info + .info {
      margin-top: 16px;
    }
    button {
      margin-top: 24px;
    }
  }
  .contract-dominate > .jump {
    text-align: right;
    text-decoration: underline;
    font-weight: 500;
    font-size: 16px;
    color: #316ed8;
    user-select: none;
    cursor: pointer;
    transition: all 0.3s ease-in-out;
    &:hover {
      color: #0e4bc3;
    }
  }

  .settlement-button {
    span {
      font-size: 12px;
    }
  }
`;

const StopSelect = styled.ul`
  margin: 4px 0;
  li {
    width: 148px;
    white-space: nowrap;
  }
`;

const InternalModal = styled.div`
  padding: 24px;
  width: 360px;
  svg {
    display: block;
    margin: 0 auto;
    width: 96px;
    height: 128px;
  }
  p {
    font-size: 16px;
    line-height: 140%;
    color: #9cadcd;
    span {
      color: #316ed8;
    }
    .reset {
      user-select: none;
      cursor: pointer;
      transition: all 0.3s ease-in-out;
      &:hover {
        color: #0e4bc3;
      }
    }
  }
`;

type direction = 'long' | 'short';

interface NormParams {
  [x: string]: { name: string; value: 0 | 1 | 2 | 3 };
}

const NORM_TYPE_MAPS: NormParams = {
  limit: { name: 'Market', value: 0 as const },
  market: { name: 'Limit', value: 1 as const },
  stopLimit: { name: 'Stop Limit', value: 2 as const },
  stopMarket: { name: 'Stop Market', value: 3 as const },
};

export function Component() {
  const { exerciseDateList } = useOptionExerciseDate();

  const [activeExerciseDate, setActiveExerciseDate] = React.useState<{
    label: string;
    value: string;
    disabled: boolean;
  }>();

  React.useEffect(() => {
    if (exerciseDateList && exerciseDateList?.length) {
      setActiveExerciseDate(exerciseDateList[0]);
    }
  }, [exerciseDateList]);

  const [tabIndex, setTabIndex] = React.useState<TRADE_DIRECTION_ENUM.LONG | TRADE_DIRECTION_ENUM.SHORT>(
    TRADE_DIRECTION_ENUM.LONG,
  );

  const [tableIndex, setTableIndex] = React.useState<'position' | 'orders' | 'history'>('position');

  const [purchaseParam, setPurchaseParam] = React.useState<null | TradePerpetualInformation>(null);
  const [visible, { setTrue, setFalse }] = useBoolean(false);

  // position
  const optionPosition = useRecoilValue(recoilUnsettledOptionPositions);
  const settledPosition = useRecoilValue(recoilSettledOptionPositions);
  const { totalPoolUSDCBalance, lockedUSDCBalance } = useRecoilValue(recoilPoolBalances);

  const needSettlementPosition = React.useMemo(() => optionPosition?.filter((i) => i?.canRedeem), [optionPosition]);

  // OPTION
  const { startEpochId, endEpochId } = useRecoilValue(recoilOptionEpochIds);
  const [interval, setInterval] = React.useState<undefined | number>(undefined);
  const { run: optionPriceMapRun, data: priceMapData } = useOptionPriceMap();

  const [leverage, handleLeverage] = useInputChange({
    defaultValue: '1',
  });
  const [inputAmount, handleInputAmount] = useInputChange({});

  const [countdown, formattedRes] = useCountDown({
    targetDate: activeExerciseDate?.value,
  });
  const { minutes, seconds } = formattedRes;

  const curOptionProduct = React.useMemo(() => {
    const dir = tabIndex.toLowerCase() as direction;
    return priceMapData?.priceMap[dir][leverage];
  }, [priceMapData?.priceMap, leverage, tabIndex]);

  const curOptionPrice = React.useMemo(
    () =>
      BigNumber(curOptionProduct?.value || '0')
        .div(1e6)
        .toString(),
    [curOptionProduct?.value],
  );

  // React.useEffect(() => {
  //   optionPriceMapRun();
  //   setInterval(10000);
  // }, []);

  useInterval(() => {
    optionPriceMapRun();
  }, interval);

  // prices
  const price = useRecoilValue(recoilKlinePrice);

  // redeem
  const { run: redeem, loading: redeemLoading } = useOptionReedem();
  const handleSettlement = () => {
    const epochIds = needSettlementPosition.map((i) => i.epochId);
    const productIds = needSettlementPosition.map((i) => i.productId);
    redeem(epochIds, productIds);
  };

  const [tableTotal, setTableTotal] = React.useState<number>(20);
  const [tablePage, setTablePage] = React.useState<number>(0);

  const [normIndex, setNormIndex] = React.useState<NormParams[string]>({ name: 'Market', value: 0 });
  const [normInterim, setNormInterim] = React.useState<NormParams[string]>({
    name: 'Stop Limit',
    value: 2,
  }); // 页面显示暂存 | 不做数据使用

  const [modalVisible, setModalVisible] = React.useState<boolean>(false);
  const [modalType, setModalType] = React.useState<'success' | 'error'>('success');

  // ********************
  // 03.19 added 合约数据
  // 切换tab初始化
  React.useEffect(() => {
    if (tabIndex) {
      initInputAndSlider();
    }
  }, [tabIndex]);

  const initInputAndSlider = () => {
    handleInputPayAmount('');
    handleLeverage('1');
  };

  const { WETH_IN_ACCOUNT, USDC_IN_ACCOUNT } = useRecoilValue(recoilBalances);
  const wethReadable = React.useMemo(() => ethers.utils.formatUnits(WETH_IN_ACCOUNT, 18), [WETH_IN_ACCOUNT]);
  const usdcReadable = React.useMemo(() => ethers.utils.formatUnits(USDC_IN_ACCOUNT, 6), [USDC_IN_ACCOUNT]);
  // 输入pay
  const [inputPayAmount, handleInputPayAmount, handleInputPayMax] = useInputChange({
    defaultValue: '',
    max: tabIndex === 'LONG' ? wethReadable : usdcReadable,
  });

  // 总价值 pay*leverage
  const totalCost = React.useMemo(() => {
    if (!inputPayAmount || !leverage) return '';
    return BigNumber(leverage).multipliedBy(inputPayAmount).toString();
  }, [inputPayAmount, leverage]);

  const liqPrice = React.useMemo(
    () =>
      getLiqPrice({
        S1: price?.indexPrice?.toString(),
        n: inputPayAmount,
        N: totalCost,
        dir: tabIndex.toUpperCase(),
      }),
    [inputPayAmount, price?.indexPrice, tabIndex, totalCost],
  );

  const borrowFee = React.useMemo(() => '0.00', []);
  const tradeFee = React.useMemo(() => '0.00', []);
  const entryPrice = React.useMemo(() => price?.indexPrice?.toString(), [price?.indexPrice]);
  const curDirBaseToken = React.useMemo(
    () => (tabIndex === TRADE_DIRECTION_ENUM.LONG ? TRADE_TOKEN.ETH : TRADE_TOKEN.USDC),
    [tabIndex],
  );

  const handleConfirm = () => {
    setPurchaseParam({
      direction: tabIndex,
      inputAmount: inputPayAmount,
      inputAmountValue: BigNumber(inputPayAmount)
        .multipliedBy(tabIndex === TRADE_DIRECTION_ENUM.LONG ? entryPrice : 1)
        .toString(),
      leverage,
      liqPrice,
      borrowFee,
      tradeFee,
      entryPrice,
      baseToken: curDirBaseToken,
      totalCost,
      totalCostValue: BigNumber(totalCost)
        .multipliedBy(tabIndex === TRADE_DIRECTION_ENUM.LONG ? entryPrice : 1)
        .toString(),
    });

    setTrue();
  };

  // 仓位
  const positions: PositionsInterface = useRecoilValue(recoilPerpetualPositions);
  const activePosition = React.useMemo(
    () => Object.values(positions).filter((i: SinglePositionInterface) => BigNumber(i.size).gt(0)),
    [positions],
  );

  return (
    <React.Fragment>
      <Wrapper>
        <div className="contract-declare">
          <div className="info row-start">
            <TokenSelect />
            <Scrollbar className="scroll-bar" suppressScrollX={false} suppressScrollY>
              <div className="row-between scroll-container">
                <div className="crux">
                  <p>Price</p>
                  <p>${price?.currentPrice?.toString().toBFixed(2)}</p>
                </div>
                <div className="crux">
                  <p>24h Change</p>
                  <p className={filterColor(BigNumber(price.priceChangeRate).lt(0) ? 1 : 0)}>
                    {price?.priceChangeRate?.toString().toBFixed(2)}%
                  </p>
                </div>
                <div className="crux">
                  <p>24h Volume</p>
                  <p>-</p>
                </div>
                <div className="crux">
                  <p>Index Price</p>
                  <p className="row-start">
                    <img src="https://placehold.jp/24x24.png" alt="coin" />
                    <span>{price?.indexPrice?.toString().toBFixed(2)}</span>
                  </p>
                </div>
                <div className="crux">
                  <p>Fee</p>
                  <p>-</p>
                </div>
              </div>
            </Scrollbar>
          </div>
          <div className="chart">
            <TVChart />
          </div>
          <div className="order">
            <Tabs
              className="tabs"
              underline={false}
              items={[
                { name: 'Position', key: 'position' },
                { name: 'Orders', key: 'orders' },
                { name: 'History', key: 'history' },
              ]}
              onChange={(v) => setTableIndex(v)}
            />
            {tableIndex === 'position' && (
              <React.Fragment>
                <Table className="one" type={'end'} dataSource={activePosition}>
                  <TableHead>
                    <p>Position</p>
                    <p>Net Value</p>
                    <p>Size</p>
                    <p>Collateral</p>
                    <p>Entry Price</p>
                    <p>Mark Price</p>
                    <p>Liq.Price</p>
                    <p>Action</p>
                  </TableHead>
                  <TableBody>
                    {activePosition.map((ele, index) => (
                      <Fields key={index} ele={ele} indexPrice={entryPrice} />
                    ))}
                  </TableBody>
                </Table>
                <Pagination current={tablePage} total={tableTotal} onChange={(v) => setTablePage(v)} />
              </React.Fragment>
            )}
            {tableIndex === 'orders' && (
              <React.Fragment>
                <Table className="two" type={'end'} dataSource={[]}>
                  <TableHead>
                    <p>Position</p>
                    <p>Net Value</p>
                    <p>Size</p>
                    <p>Collateral</p>
                    <p>Entry Price</p>
                    <p>Mark Price</p>
                    <p>Liq.Price</p>
                    <p>Action</p>
                  </TableHead>
                  <TableBody>
                    {settledPosition.map((ele, index) => (
                      <Fields key={index} ele={ele} />
                    ))}
                  </TableBody>
                </Table>
                <Pagination current={tablePage} total={tableTotal} onChange={(v) => setTablePage(v)} />
              </React.Fragment>
            )}
            {tableIndex === 'history' && (
              <React.Fragment>
                <Table className="one" type={'end'} dataSource={needSettlementPosition}>
                  <TableHead>
                    <p>Position</p>
                    <p>Net Value</p>
                    <p>Size</p>
                    <p>Collateral</p>
                    <p>Entry Price</p>
                    <p>Mark Price</p>
                    <p>Liq.Price</p>
                    <p>Action</p>
                  </TableHead>
                  <TableBody>
                    {needSettlementPosition.map((ele, index) => (
                      <Fields key={index} ele={ele} />
                    ))}
                  </TableBody>
                </Table>
                <Pagination current={tablePage} total={tableTotal} onChange={(v) => setTablePage(v)} />
              </React.Fragment>
            )}
          </div>
        </div>
        <div className="contract-dominate">
          <div className="panel">
            <ul className={`tabs row-between ${tabIndex.toLowerCase()}`}>
              <li onClick={() => setTabIndex(TRADE_DIRECTION_ENUM.LONG)}>LONG</li>
              <li onClick={() => setTabIndex(TRADE_DIRECTION_ENUM.SHORT)}>SHORT</li>
              <div className="bar" />
            </ul>

            <div className="norm row-start">
              <p
                className={normIndex.value === 0 ? 'active' : 'default'}
                onClick={() => setNormIndex(NORM_TYPE_MAPS.limit)}
              >
                {NORM_TYPE_MAPS.limit.name}
              </p>
              <p
                className={normIndex.value === 1 ? 'active' : 'default'}
                onClick={() => setNormIndex(NORM_TYPE_MAPS.market)}
              >
                {NORM_TYPE_MAPS.market.name}
              </p>
              <Select
                className={`select ${![0, 1].includes(normIndex.value) ? 'ticket' : ''}`}
                placement="right"
                overlay={<p>Stop</p>}
                follow
              >
                <StopSelect>
                  <li
                    className={`${normIndex.value === 2 ? 'active' : ''}`.trimEnd()}
                    onClick={() => {
                      setNormIndex(NORM_TYPE_MAPS.stopLimit);
                      setNormInterim(NORM_TYPE_MAPS.stopLimit);
                    }}
                  >
                    {NORM_TYPE_MAPS.stopLimit.name}
                  </li>
                  <li
                    className={`${normIndex.value === 3 ? 'active' : ''}`.trimEnd()}
                    onClick={() => {
                      setNormIndex(NORM_TYPE_MAPS.stopMarket);
                      setNormInterim(NORM_TYPE_MAPS.stopMarket);
                    }}
                  >
                    {NORM_TYPE_MAPS.stopMarket.name}
                  </li>
                </StopSelect>
              </Select>
            </div>
            {/* <hr /> */}
            <div className="label">
              <h6>Pay</h6>
            </div>
            <Input
              className="input keep-style"
              size="lg"
              suffix={
                <p className="extra row-end">
                  <Button onClick={handleInputPayMax}>Max</Button>
                  <span>{curDirBaseToken}</span>
                </p>
              }
              onChange={handleInputPayAmount}
              value={inputPayAmount}
            />
            <div className="label">
              <h6 className="capitalize">{tabIndex?.toLocaleLowerCase()}</h6>
            </div>
            <Input
              className="input"
              size="lg"
              suffix={<span className="extra">{curDirBaseToken}</span>}
              value={totalCost}
            />
            <div className="label row-between">
              <h6>Leverage Slider</h6>
              <Input className="input" size="lg" value={leverage} suffix={<span className="leverage-size">x</span>} />
            </div>
            <Slider min={1} max={50} marks={10} value={leverage} tooltip={`${leverage}x`} onChange={handleLeverage} />
            <p className="marks row-between">
              {[...Array(10).keys()].map((ele) => (
                <span key={ele}>{ele * 5 + 5}x</span>
              ))}
            </p>
          </div>
          <div className="detail">
            <h4>Trade Information</h4>
            <p className="info row-between">
              <span>Entry Price</span>
              <span>${BigNumber(entryPrice).toFixed(2, BigNumber.ROUND_DOWN)}</span>
            </p>
            <p className="info row-between">
              <span>Liq.Price</span>
              <span>${BigNumber(liqPrice).toFixed(2, BigNumber.ROUND_DOWN)}</span>
            </p>
            <p className="info row-between">
              <span>Leverage</span>
              <span>{leverage}x</span>
            </p>
            <p className="info row-between">
              <span>Borrow Fee</span>
              <span>${borrowFee}</span>
            </p>
            <p className="info row-between">
              <span>Trade Fee</span>
              <span>${tradeFee}</span>
            </p>
            <SmartButton onClick={handleConfirm} disabled={!inputPayAmount || !totalCost} size="lg">
              Confirm
            </SmartButton>
          </div>
          <p className="jump">User Guidance</p>
        </div>
      </Wrapper>
      <Confirm visible={visible} onClose={setFalse} params={purchaseParam} />

      {/* 状态modal */}
      <Modal
        visible={modalVisible}
        // loading={loading}
        closable={false}
        ok="Back"
        onOk={() => {
          setModalVisible(false);
        }}
      >
        <InternalModal>
          {modalType === 'success' && (
            <React.Fragment>
              <IconModalSuccess />
              <p>
                You have purchased <span>0000.00</span> shares of Simple Option at the price of <span>$0.00</span>. Go
                back to position for more detail.
              </p>
            </React.Fragment>
          )}
          {modalType === 'success' && (
            <React.Fragment>
              <IconModalError />
              <p>
                Transaction failed. xxxxxxxxxxxx xxxxxx xxxxxx. <span className="reset">Try again</span>.
              </p>
            </React.Fragment>
          )}
        </InternalModal>
      </Modal>
    </React.Fragment>
  );
}

Component.displayName = 'Perpetual';
