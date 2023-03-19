import { Modal } from '@/components';
import usePurchaseOption from '@/hooks/option/usePurchaseOption';
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

const ConfirmModal = ({
  params,
  visible,
  onClose,
}: {
  visible: boolean;
  onClose: () => void;
  params: null | {
    tabIndex: string;
    strikePrice: string | number;
    totalCost: string | number;
    curOptionPrice: string | number;
    endEpochId: string | number;
    curOptionProductIndex: string | number;
    inputAmount: string | number;
  };
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

  const {
    run: purchaseOptionRun,
    loading: purchaseOptionLoading,
    data: purchaseOptionData,
    error: purchaseOptionError,
  } = usePurchaseOption();

  useEffect(() => {
    if (purchaseOptionError) {
      setCD(curCd);
      setCurCD(undefined);
    }
  }, [purchaseOptionError]);

  useEffect(() => {
    if (purchaseOptionData) {
      onClose();
    }
  }, [purchaseOptionData]);

  const handleConfirm = () => {
    if (!params) return;
    setCurCD(countdown);
    purchaseOptionRun(params?.endEpochId, params?.curOptionProductIndex, +params?.inputAmount);
  };
  return (
    <Modal
      visible={visible}
      title="Confirm Trade"
      loading={purchaseOptionLoading}
      onCancel={onClose}
      ok={`Confirm (${curCd ? new BigNumber(curCd).div(1000).toFixed(0, BigNumber.ROUND_DOWN) : seconds})s`}
      onOk={handleConfirm}
    >
      <InternalModal>
        <p className="trade row-between">
          <span>Pay</span>
          <span>0.0000 Crypto1 ($0.00)</span>
        </p>
        <img src={require('@/assets/images/perpetual/arrow.svg')} alt="icon" />
        <p className="trade row-between">
          <span>Position Size</span>
          <span>0.0000 Crypto2 ($0.00)</span>
        </p>
        <p className="info row-between">
          <span>Leverage</span>
          <span>0.00x</span>
        </p>
        <p className="info row-between">
          <span>Entry Price</span>
          <span>$0000.0000</span>
        </p>
        <p className="info row-between">
          <span>Liquidation Price</span>
          <span>$0000.0000</span>
        </p>
        <p className="info row-between">
          <span>Borrow Fee</span>
          <span>0.00%/Hour</span>
        </p>
        <p className="info row-between">
          <span>Trade Fee</span>
          <span>$0.00</span>
        </p>
      </InternalModal>
    </Modal>
  );
};

export default ConfirmModal;
