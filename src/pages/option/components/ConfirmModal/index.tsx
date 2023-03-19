import Modal from '@/components/Modal';
import { SmartButton } from '@/components/_global';
import usePurchaseOption from '@/hooks/option/usePurchaseOption';
import { useCountDown } from 'ahooks';
import BigNumber from 'bignumber.js';
import { useEffect, useState } from 'react';
import { styled } from 'styled-components';

const StyledModal = styled(Modal)`
  .inner-content {
    color: #54678b;
    max-width: 312px;
    font-weight: 400;
    font-size: 16px;
    line-height: 140%;
  }
  .inner-table {
    div {
      span:nth-of-type(1) {
        font-weight: 400;
        font-size: 16px;
        line-height: 120%;
        color: #9cadcd;
      }
      span:nth-of-type(2) {
        font-weight: 500;
        font-size: 16px;
        line-height: 120%;
        color: #e5e6ed;
      }
    }
  }
  .btn-container {
    margin-top: 12px;
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
    <StyledModal visible={visible} title="Confirm Trade" onCancel={onClose}>
      <div className="col-center gap-24">
        <span className="inner-content">
          Please confirm the order information below within 15 seconds, otherwise this transaction will be voided.
        </span>

        <div className="col-between full-width inner-table gap-16">
          <div className="row-between full-width">
            <span>Type</span>
            <span> ETH-{params?.tabIndex}</span>
          </div>
          <div className="row-between full-width">
            <span>Strike Price</span>
            <span>{params?.strikePrice}</span>
          </div>
          <div className="row-between full-width">
            <span>Option Price</span>
            <span>{params?.curOptionPrice}</span>
          </div>
          <div className="row-between full-width">
            <span>Total Cost</span>
            <span>{params?.totalCost} USDC</span>
          </div>
        </div>

        <div className="full-width btn-container">
          <SmartButton
            size="lg"
            loading={purchaseOptionLoading}
            onClick={handleConfirm}
            purchaseOptionLoading={purchaseOptionLoading}
          >
            Confirm&nbsp;({curCd ? BigNumber(curCd).div(1000).toFixed(0, BigNumber.ROUND_DOWN) : seconds}s)
          </SmartButton>
        </div>
      </div>
    </StyledModal>
  );
};

export default ConfirmModal;
