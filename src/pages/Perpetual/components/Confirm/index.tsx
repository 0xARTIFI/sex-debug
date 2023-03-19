import { Modal } from '@/components';
import { TRADE_DIRECTION_ENUM } from '@/configs/common';
import useOpenPosition from '@/hooks/perpetual/useOpenPosition';
import { useCountDown } from 'ahooks';
import BigNumber from 'bignumber.js';
import { useEffect, useState } from 'react';
import { styled } from 'styled-components';

const InternalModal = styled.div`
  padding: 24px;
  width: 440px;
  .trade {
    span:nth-child(1) {
      font-weight: 600;
      font-size: 20px;
      line-height: 120%;
      color: #9cadcd;
    }
    span:nth-child(2) {
      flex: 1;
      text-align: right;
      font-weight: 600;
      font-size: 20px;
      line-height: 120%;
      color: #e5e6ed;
    }
  }
  img {
    margin: 12px 6px 12px auto;
    width: 15px;
    height: 22px;
  }
  .trade + .info {
    margin-top: 28px;
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

const formatUnit = (inputAmount: any, unit = 4) => {
  return BigNumber(inputAmount || '0').toFixed(unit, BigNumber.ROUND_DOWN);
};

export interface TradePerpetualInformation {
  direction: TRADE_DIRECTION_ENUM.LONG | TRADE_DIRECTION_ENUM.SHORT;
  leverage: string;
  liqPrice: string;
  borrowFee: string;
  tradeFee: string;
  entryPrice: string;
  baseToken: string;
  inputAmount: string;
  inputAmountValue: string;
  totalCostValue: string;
  totalCost: string;
}

const ConfirmModal = ({
  params,
  visible,
  onClose,
}: {
  visible: boolean;
  onClose: () => void;
  params: null | TradePerpetualInformation;
}) => {
  const [cd, setCD] = useState<undefined | number>(undefined);
  const [curCd, setCurCD] = useState<undefined | number>(undefined);

  useEffect(() => {
    if (visible) {
      setCD(15 * 1000);
    } else {
      setCD(undefined);
    }
  }, [visible]);

  const [countdown, { seconds }] = useCountDown({
    leftTime: curCd ? undefined : cd,
    onEnd: () => {
      onClose();
    },
  });

  // direction: TRADE_DIRECTION_ENUM.LONG | TRADE_DIRECTION_ENUM.SHORT,
  // input: string,
  // leverage: string | number,
  const {
    run: openPositionRun,
    loading: openPositionLoading,
    data: openPositionData,
    error: openPositionError,
  } = useOpenPosition();

  useEffect(() => {
    if (openPositionError) {
      setCD(curCd);
      setCurCD(undefined);
    }
  }, [openPositionError]);

  useEffect(() => {
    if (openPositionData) {
      onClose();
    }
  }, [openPositionData]);

  const handleConfirm = () => {
    if (!params || !params?.direction) return;
    setCurCD(countdown);
    openPositionRun(params?.direction, params?.inputAmount, params?.leverage);
  };

  return (
    <>
      <Modal
        visible={visible}
        title="Confirm Trade"
        loading={openPositionLoading}
        onCancel={onClose}
        ok={`Confirm (${curCd ? new BigNumber(curCd).div(1000).toFixed(0, BigNumber.ROUND_DOWN) : seconds}s)`}
        onOk={handleConfirm}
      >
        <InternalModal>
          <p className="trade row-between">
            <span>Pay</span>
            <span>
              {formatUnit(params?.inputAmount)} {params?.baseToken || '-'} ($
              {formatUnit(params?.inputAmountValue, 2)})
            </span>
          </p>
          <img src={require('@/assets/images/perpetual/arrow.svg')} alt="icon" />
          <p className="trade row-between">
            <span>Position Size</span>
            <span>
              {formatUnit(params?.totalCost)} {params?.baseToken || '-'} (${formatUnit(params?.totalCostValue, 2)})
            </span>
          </p>
          <p className="info row-between">
            <span>Leverage</span>
            <span>{params?.leverage}x</span>
          </p>
          <p className="info row-between">
            <span>Entry Price</span>
            <span>${formatUnit(params?.entryPrice)}</span>
          </p>
          <p className="info row-between">
            <span>Liquidation Price</span>
            <span>${formatUnit(params?.liqPrice)}</span>
          </p>
          <p className="info row-between">
            <span>Borrow Fee</span>
            <span>{formatUnit(params?.borrowFee, 2)}%/Hour</span>
          </p>
          <p className="info row-between">
            <span>Trade Fee</span>
            <span>${formatUnit(params?.tradeFee, 2)}</span>
          </p>
        </InternalModal>
      </Modal>
    </>
  );
};

export default ConfirmModal;
