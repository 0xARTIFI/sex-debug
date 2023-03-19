/* eslint-disable no-confusing-arrow */
/* eslint-disable @typescript-eslint/indent */
/* eslint-disable no-nested-ternary */
import { IconModalError, IconModalSuccess } from '@/assets/icons/IconGroup';
import { Input, Modal, Pagination, Scrollbar, Select, Slider, Table, Tabs } from '@/components';
import { SmartButton } from '@/components/_global';
import TokenSelect from '@/components/_global/TokenSelect';
import TVChart from '@/components/_global/TradingView';
import { TRADE_DIRECTION_ENUM } from '@/configs/common';
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
import { filterThousands } from '@/utils/tools';
import { useBoolean, useCountDown, useInterval } from 'ahooks';
import BigNumber from 'bignumber.js';
import classNames from 'classnames';
import * as React from 'react';
import { useRecoilValue } from 'recoil';
import styled from 'styled-components';
import Confirm from './components/Confirm';
import Fields from './components/Fields';

const { TableHead, TableBody } = Table;

const Wrapper = styled.div<{ choose: 'CALL' | 'PUT' }>`
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
        min-width: 934px;
        p:nth-child(1) {
          flex: 1 0 148px;
          padding-left: 16px;
        }
        p:nth-child(2) {
          flex: 1 0 88px;
        }
        p:nth-child(3) {
          flex: 1 0 118px;
        }
        p:nth-child(4) {
          flex: 1 0 140px;
        }
        p:nth-child(5) {
          flex: 1 0 140px;
        }
        p:nth-child(6) {
          flex: 1 0 120px;
        }
        p:nth-child(7) {
          flex: 1 0 80px;
        }
        p:nth-child(8) {
          flex: 1 0 100px;
          padding-right: 16px;
        }
      }
      .tbody {
        .coin {
          margin-right: 8px;
          width: 16px;
          height: 16px;
          border-radius: 50%;
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
    .call {
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
    .put {
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
    .select {
      height: 40px;
      background: rgba(47, 50, 65, 0.5);
    }
    hr {
      margin: 24px 0 0 0;
      padding: 0;
      height: 1px;
      border: none;
      background: #34384c;
    }
    .extra {
      &.tab {
        text-transform: capitalize;
      }
      font-size: 14px;
      color: rgba(255, 255, 255, 0.85);
    }
    .limit {
      margin-top: 12px;
      font-weight: 500;
      font-size: 14px;
      line-height: 120%;
      color: #54678b;
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

const TimeSelect = styled.ul`
  margin: 4px 0;
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

type direction = 'call' | 'put';

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

  const [tabIndex, setTabIndex] = React.useState<'CALL' | 'PUT'>('CALL');

  const [tableIndex, setTableIndex] = React.useState<'active' | 'history' | 'settlement'>('active');

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

  // (totalPoolUSDCBalance - lockedUSDCBalance) / (1 - curOptionPrice)
  const limit = React.useMemo(
    () =>
      curOptionPrice
        ? BigNumber(BigNumber(totalPoolUSDCBalance).minus(lockedUSDCBalance))
            .div(1e6)
            .div(BigNumber(1).minus(curOptionPrice))
            .toFixed(0, BigNumber.ROUND_DOWN)
        : 0,
    [curOptionPrice, lockedUSDCBalance, totalPoolUSDCBalance],
  );

  const maxReturn = React.useMemo(() => {
    const temp = BigNumber(curOptionPrice);
    return temp.isZero() || temp.isNaN() ? 0 : BigNumber(100).div(curOptionPrice).toFixed(2, BigNumber.ROUND_DOWN);
  }, [curOptionPrice]);

  const totalCost = React.useMemo(
    () =>
      BigNumber(curOptionPrice || 0)
        .multipliedBy(inputAmount || 0)
        .toString(),
    [curOptionPrice, inputAmount],
  );

  React.useEffect(() => {
    optionPriceMapRun();
    setInterval(10000);
  }, []);

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

  const [modalVisible, setModalVisible] = React.useState<boolean>(false);
  const [modalType, setModalType] = React.useState<'success' | 'error'>('success');

  return (
    <React.Fragment>
      <Wrapper choose={tabIndex}>
        <div className="contract-declare">
          <div className="info row-start">
            <TokenSelect />
            <Scrollbar className="scroll-bar" suppressScrollX={false} suppressScrollY>
              <div className="row-between scroll-container">
                <div className="crux">
                  <p>24h Change</p>
                  <p className={filterColor(BigNumber(price.priceChangeRate).lt(0) ? 1 : 0)}>
                    {price?.priceChangeRate?.toString().toBFixed(2)}%
                  </p>
                </div>
                <div className="crux">
                  <p>24h High</p>
                  <p>{price?.priceHigh?.toString().toBFixed(2)}</p>
                </div>
                <div className="crux">
                  <p>24h Low</p>
                  <p>{price?.priceLow?.toString().toBFixed(2)}</p>
                </div>
                <div className="crux">
                  <p>Avbl. Amount</p>
                  <p className="row-start">
                    <img src="https://placehold.jp/24x24.png" alt="coin" />
                    <span>-</span>
                  </p>
                </div>
                <div className="crux">
                  <p>Index Price</p>
                  <p className="row-start">
                    <img src="https://placehold.jp/24x24.png" alt="coin" />
                    <span>{price?.indexPrice?.toString().toBFixed(2)}</span>
                  </p>
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
              suffix={
                tableIndex === 'settlement' &&
                needSettlementPosition?.length && (
                  <SmartButton
                    loading={redeemLoading}
                    onClick={handleSettlement}
                    disable={!needSettlementPosition?.length}
                    className="settlement-button"
                  >
                    Confirm Settlement
                  </SmartButton>
                )
              }
              items={[
                { name: 'Active', key: 'active' },
                { name: 'History', key: 'history' },
                { name: 'Settlement', key: 'settlement' },
              ]}
              onChange={(v) => setTableIndex(v)}
            />
            {tableIndex === 'active' && (
              <React.Fragment>
                <Table className="one" type={'end'} dataSource={activePosition}>
                  <TableHead>
                    <p>Product</p>
                    <p>Shares</p>
                    <p>Strike Price</p>
                    <p>Opening Price</p>
                    <p>Current Price</p>
                    <p>Expires In</p>
                    <p>PNL</p>
                    <p>PNL%</p>
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
            {tableIndex === 'history' && (
              <React.Fragment>
                <Table className="two" type={'end'} dataSource={settledPosition}>
                  <TableHead>
                    <p>Product</p>
                    <p>Shares</p>
                    <p>Strike Price</p>
                    <p>Opening Price</p>
                    <p>Current Price</p>
                    <p>Expires In</p>
                    <p>PNL</p>
                    <p>PNL%</p>
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
            {tableIndex === 'settlement' && (
              <React.Fragment>
                <Table className="one" type={'end'} dataSource={needSettlementPosition}>
                  <TableHead>
                    <p>Product</p>
                    <p>Shares</p>
                    <p>Strike Price</p>
                    <p>Opening Price</p>
                    <p>Current Price</p>
                    <p>Expires In</p>
                    <p>PNL</p>
                    <p>PNL%</p>
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
              <li onClick={() => setTabIndex('CALL')}>CALL</li>
              <li onClick={() => setTabIndex('PUT')}>PUT</li>
              <div className="bar" />
            </ul>
            {/* Exercise Date */}
            <div className="label row-between">
              <h6>Exercise Date</h6>
            </div>
            <Select
              className="select"
              size="lg"
              placeholder="请选择时间"
              overlay={activeExerciseDate ? <div>{activeExerciseDate?.label}</div> : undefined}
            >
              <TimeSelect>
                {exerciseDateList?.map((ele) => (
                  <li
                    className={classNames({
                      active: ele.value === activeExerciseDate?.value,
                      disabled: ele.disabled,
                    })}
                    key={ele.value}
                  >
                    {ele.label}
                  </li>
                ))}
              </TimeSelect>
            </Select>
            {/* Strike Prices */}
            <div className="label row-between">
              <h6>Strike Prices</h6>
              <Input className="input" size="lg" value={strikePrice} />
            </div>
            <Slider
              min={
                priceMapData?.putMin && priceMapData?.callMin
                  ? tabIndex === TRADE_DIRECTION_ENUM.PUT
                    ? +priceMapData?.putMin
                    : +priceMapData?.callMin
                  : 0
              }
              max={
                priceMapData?.putMax && priceMapData?.callMax
                  ? tabIndex === TRADE_DIRECTION_ENUM.PUT
                    ? +priceMapData?.putMax
                    : +priceMapData?.callMax
                  : 0
              }
              value={strikePrice}
              tooltip={`${filterThousands(strikePrice, 2)}`}
              onChange={handleStrikePriceAmount}
            />
            <hr />
            {/* Option Price */}
            <div className="label row-between">
              <h6>Option Price</h6>
              <p className="max">Max. Return: ~{maxReturn}%</p>
            </div>
            <Input
              className="input keep-style"
              disabled
              size="lg"
              suffix={<span className="extra">USDC</span>}
              value={curOptionPrice}
            />
            {/* Enter Amount */}
            <div className="label">
              <h6>Enter Amount</h6>
            </div>
            <Input
              onChange={handleInputAmount}
              className="input"
              size="lg"
              suffix={<span className="extra tab">{`${tabIndex.toLocaleLowerCase()}s`}</span>}
              value={inputAmount}
            />
            <p className="limit">Limit: {limit}</p>
          </div>
          <div className="detail">
            <h4>Trade Information</h4>
            <p className="info row-between">
              <span>Max Return</span>
              <span>~{maxReturn}%</span>
            </p>
            <p className="info row-between">
              <span>Time to Settlement</span>
              <span>
                {minutes}m {seconds}s
              </span>
            </p>
            <p className="info row-between">
              <span>Total Cost</span>
              <span>{totalCost} USDC</span>
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

Component.displayName = 'Option';
