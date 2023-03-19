/* eslint-disable no-confusing-arrow */
/* eslint-disable @typescript-eslint/indent */
/* eslint-disable no-nested-ternary */
import { IconModalError, IconModalSuccess, IconGlobalMore } from '@/assets/icons/IconGroup';
import { Button, Input, Modal, Pagination, Scrollbar, Slider, Table, Tabs, Select } from '@/components';
import { SmartButton } from '@/components/_global';
import TokenSelect from '@/components/_global/TokenSelect';
import TVChart from '@/components/_global/TradingView';
import useOptionExerciseDate from '@/hooks/option/useOptionExerciseDate';
import useOptionPriceMap from '@/hooks/option/useOptionPriceMap';
import useOptionReedem from '@/hooks/option/useOptionReedem';
import useInputChange from '@/hooks/useInputChange';
import {
  recoilKlinePrice,
  recoilOptionEpochIds,
  recoilPoolBalances,
  recoilSettledOptionPositions,
  recoilUnsettledOptionPositions,
} from '@/models/_global';
import { useBoolean, useCountDown, useInterval } from 'ahooks';
import BigNumber from 'bignumber.js';
import * as React from 'react';
import { useRecoilValue } from 'recoil';
import styled from 'styled-components';
import Confirm from './components/Confirm';
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

const CloseModal = styled.div`
  padding: 24px;
  width: 360px;
  .info {
    span:nth-child(1) {
      font-size: 16px;
      line-height: 120%;
      color: #9cadcd;
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
  hr {
    margin: 24px 0;
    padding: 0;
    height: 1px;
    border: none;
    background: #34384c;
  }
  .label {
    margin: 16px 0 12px 0;
    h6 {
      font-weight: 600;
      font-size: 16px;
      line-height: 120%;
      color: #54678b;
    }
  }
  .extra {
    font-size: 14px;
    color: rgba(255, 255, 255, 0.85);
    button {
      margin-right: 6px;
      padding: 0 12px;
    }
  }
`;

const ManageModal = styled.div`
  padding: 24px;
  width: 360px;
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
      color: #ffffff;
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
      color: #e5e6ed;
      &:hover {
        background: rgba(47, 50, 65, 0.5);
      }
    }
    .bar {
      left: 0;
      background: #0e4bc3;
      border-radius: 20px 0px 0px 20px;
    }
  }
  .short {
    li:nth-child(1) {
      color: #e5e6ed;
      &:hover {
        background: rgba(47, 50, 65, 0.5);
      }
    }
    .bar {
      left: 50%;
      background: #0e4bc3;
      border-radius: 0px 20px 20px 0px;
    }
  }
  .label {
    margin: 24px 0 12px 0;
    .input {
      flex: 1;
      input {
        width: 100%;
      }
    }
    h6 {
      margin-left: 16px;
      font-weight: 600;
      font-size: 20px;
      line-height: 120%;
      color: #e5e6ed;
    }
  }
  .max {
    margin-top: 12px;
    padding-left: 20px;
    font-size: 14px;
    line-height: 120%;
    color: #9cadcd;
  }
  h4 {
    margin: 24px 0;
    font-weight: 600;
    font-size: 16px;
    line-height: 120%;
    color: #e5e6ed;
  }
  .info {
    span:nth-child(1) {
      font-size: 16px;
      line-height: 120%;
      color: #9cadcd;
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

  const filterColor = React.useCallback((params: 0 | 1 | 2) => {
    if (params === 0) {
      return 'up';
    }
    if (params === 1) {
      return 'down';
    }
    return 'initial';
  }, []);

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

  const [tabIndex, setTabIndex] = React.useState<'LONG' | 'SHORT'>('LONG');

  const [tableIndex, setTableIndex] = React.useState<'position' | 'orders' | 'history'>('position');

  const [purchaseParam, setPurchaseParam] = React.useState(null);
  const [visible, { setTrue, setFalse }] = useBoolean(false);

  // position
  const optionPosition = useRecoilValue(recoilUnsettledOptionPositions);
  const settledPosition = useRecoilValue(recoilSettledOptionPositions);
  const { totalPoolUSDCBalance, lockedUSDCBalance } = useRecoilValue(recoilPoolBalances);

  const activePosition = React.useMemo(() => optionPosition?.filter((i) => !i?.canRedeem), [optionPosition]);
  const needSettlementPosition = React.useMemo(() => optionPosition?.filter((i) => i?.canRedeem), [optionPosition]);

  // OPTION
  const { startEpochId, endEpochId } = useRecoilValue(recoilOptionEpochIds);
  const [interval, setInterval] = React.useState<undefined | number>(undefined);
  const { run: optionPriceMapRun, data: priceMapData } = useOptionPriceMap();

  const [strikePrice, handleStrikePriceAmount] = useInputChange({
    defaultValue: '0',
  });
  const [inputAmount, handleInputAmount] = useInputChange({});

  const [countdown, formattedRes] = useCountDown({
    targetDate: activeExerciseDate?.value,
  });
  const { minutes, seconds } = formattedRes;

  const curOptionProduct = React.useMemo(() => {
    const dir = tabIndex.toLowerCase() as direction;
    return priceMapData?.priceMap[dir][strikePrice];
  }, [priceMapData?.priceMap, strikePrice, tabIndex]);

  const curOptionPrice = React.useMemo(
    () =>
      BigNumber(curOptionProduct?.value || '0')
        .div(1e6)
        .toString(),
    [curOptionProduct?.value],
  );

  const totalCost = React.useMemo(
    () =>
      BigNumber(curOptionPrice || 0)
        .multipliedBy(inputAmount || 0)
        .toString(),
    [curOptionPrice, inputAmount],
  );

  // React.useEffect(() => {
  //   optionPriceMapRun();
  //   setInterval(10000);
  // }, []);

  useInterval(() => {
    optionPriceMapRun();
  }, interval);

  const handleConfirm = () => {
    setPurchaseParam({
      tabIndex,
      strikePrice,
      totalCost,
      curOptionPrice,
      endEpochId,
      curOptionProductIndex: curOptionProduct?.index,
      inputAmount,
    });
    setTrue();
  };

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
                  <p>$5820.42</p>
                </div>
                <div className="crux">
                  <p>24h Change</p>
                  <p className={filterColor(1)}>-6.25%</p>
                </div>
                <div className="crux">
                  <p>24h Volume</p>
                  <p>1600.24</p>
                </div>
                <div className="crux">
                  <p>Index Price</p>
                  <p className="row-start">
                    <img src="https://placehold.jp/24x24.png" alt="coin" />
                    <span>1155.50</span>
                  </p>
                </div>
                <div className="crux">
                  <p>Fee</p>
                  <p>--</p>
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
                    {activePosition.map((ele) => (
                      <Fields priceMapData={priceMapData} key={ele.epochId + ele.productId} ele={ele} />
                    ))}
                  </TableBody>
                </Table>
                <Pagination current={tablePage} total={tableTotal} onChange={(v) => setTablePage(v)} />
              </React.Fragment>
            )}
            {tableIndex === 'orders' && (
              <React.Fragment>
                <Table className="two" type={'end'} dataSource={(1, 2, 3)}>
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
                    {settledPosition.map((ele) => (
                      <Fields priceMapData={priceMapData} key={ele.epochId + ele.productId} ele={ele} />
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
                    {needSettlementPosition.map((ele) => (
                      <Fields priceMapData={priceMapData} key={ele.epochId + ele.productId} ele={ele} />
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
              <li onClick={() => setTabIndex('LONG')}>LONG</li>
              <li onClick={() => setTabIndex('SHORT')}>SHORT</li>
              <div className="bar" />
            </ul>
            <div className="label">
              <h6>Exercise Date</h6>
            </div>
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
            <hr />
            <div className="label">
              <h6>Pay</h6>
            </div>
            <Input
              className="input keep-style"
              size="lg"
              suffix={
                <p className="extra row-end">
                  <Button>Max</Button>
                  <span>ETH</span>
                </p>
              }
              value={curOptionPrice}
            />
            <div className="label">
              <h6>Long</h6>
            </div>
            <Input
              onChange={handleInputAmount}
              className="input"
              size="lg"
              suffix={<span className="extra">ETH</span>}
              value={inputAmount}
            />
            <div className="label row-between">
              <h6>Leverage Slider</h6>
              <Input className="input" size="lg" value={strikePrice} />
            </div>
            <Slider
              min={1}
              max={50}
              marks={10}
              value={strikePrice}
              tooltip={`${strikePrice}x`}
              onChange={handleStrikePriceAmount}
            />
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
              <span>$0.00</span>
            </p>
            <p className="info row-between">
              <span>Liq.Price</span>
              <span>$0.00</span>
            </p>
            <p className="info row-between">
              <span>Leverage</span>
              <span>38x</span>
            </p>
            <p className="info row-between">
              <span>Borrow Fee</span>
              <span>$0.00</span>
            </p>
            <p className="info row-between">
              <span>Trade Fee</span>
              <span>$0.00</span>
            </p>
            <SmartButton onClick={handleConfirm} disabled={!inputAmount || !totalCost} size="lg">
              Confirm
            </SmartButton>
          </div>
          <p className="jump">User Guidance</p>
        </div>
      </Wrapper>
      <Confirm visible={visible} onClose={setFalse} params={purchaseParam} />
      <Modal
        visible={modalVisible}
        title="Close Position"
        // loading={loading}
        onCancel={() => {}}
        ok="Confirm"
        onOk={() => {
          setModalVisible(false);
        }}
      >
        <CloseModal>
          <p className="info row-between">
            <span>Mark Price</span>
            <span>$0000.00</span>
          </p>
          <p className="info row-between">
            <span>Entry Price</span>
            <span>$0000.00</span>
          </p>
          <p className="info row-between">
            <span>Liq.Price</span>
            <span>$0000.00</span>
          </p>
          <hr />
          <div className="label">
            <h6>Price</h6>
          </div>
          <Input
            onChange={handleInputAmount}
            className="input"
            placeholder="$0000.00"
            size="lg"
            suffix={<span className="extra">Market Price</span>}
            value={inputAmount}
          />
          <div className="label">
            <h6>Amount</h6>
          </div>
          <Input
            className="input keep-style"
            size="lg"
            suffix={
              <p className="extra row-end">
                <Button>Max</Button>
                <span>USD</span>
              </p>
            }
            value={curOptionPrice}
          />
          <hr />
          <p className="info row-between">
            <span>Size</span>
            <span>$0000.00</span>
          </p>
          <p className="info row-between">
            <span>PNL</span>
            <span>$0000.00</span>
          </p>
          <p className="info row-between">
            <span>Fees</span>
            <span>$0000.00</span>
          </p>
          <p className="info row-between">
            <span>Receive</span>
            <span>0.00 Crypto1 ($0.00)</span>
          </p>
        </CloseModal>
      </Modal>
      <Modal
        visible={modalVisible}
        title="Manage Collateral"
        // loading={loading}
        onCancel={() => {}}
        disabled
        ok={false ? 'Confirm Edit' : 'Cannot Exceed Max. Leverage'}
        onOk={() => {
          setModalVisible(false);
        }}
      >
        <ManageModal>
          <ul className={`tabs row-between ${tabIndex.toLowerCase()}`}>
            <li onClick={() => setTabIndex('LONG')}>LONG</li>
            <li onClick={() => setTabIndex('SHORT')}>SHORT</li>
            <div className="bar" />
          </ul>
          <div className="label row-between">
            <Input onChange={handleInputAmount} className="input" placeholder="0.00" size="lg" value={inputAmount} />
            <h6>ETH</h6>
          </div>
          <p className="max">Max: 000.00</p>
          <h4>Your Position</h4>
          <p className="info row-between">
            <span>Collateral</span>
            <span>$0.00</span>
          </p>
          <p className="info row-between">
            <span>Size</span>
            <span>$0.00</span>
          </p>
          <p className="info row-between">
            <span>Leverage</span>
            <span>0.00x</span>
          </p>
          <p className="info row-between">
            <span>Liquidation Price</span>
            <span>$0.00</span>
          </p>
          <p className="info row-between">
            <span>Management Fee</span>
            <span>$0.00</span>
          </p>
        </ManageModal>
      </Modal>
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
