import { Modal } from '@/components';
import usePurchaseOption from '@/hooks/option/usePurchaseOption';
import { useCountDown } from 'ahooks';
import BigNumber from 'bignumber.js';
import { useEffect, useState } from 'react';
import { styled } from 'styled-components';

const InternalModal = styled.div`
  padding: 24px;
  width: 360px;
  .tips {
    margin-bottom: 24px;
    font-size: 16px;
    line-height: 140%;
    color: #54678b;
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
        <p className="tips">
          Please confirm the order information below within 15 seconds, otherwise this transaction will be voided.
        </p>
        <p className="info row-between">
          <span>Type</span>
          <span>ETH-{params?.tabIndex}</span>
        </p>
        <p className="info row-between">
          <span>Strike Price</span>
          <span>{params?.strikePrice}</span>
        </p>
        <p className="info row-between">
          <span>Option Price</span>
          <span>{params?.curOptionPrice}</span>
        </p>
        <p className="info row-between">
          <span>Total Cost</span>
          <span>{params?.totalCost} USDC</span>
        </p>
      </InternalModal>
    </Modal>
  );
};

export default ConfirmModal;
