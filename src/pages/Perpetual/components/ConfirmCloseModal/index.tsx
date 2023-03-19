import { Button, Input, Modal } from '@/components';
import { TRADE_DIRECTION_ENUM } from '@/configs/common';
import useInputChange from '@/hooks/useInputChange';
import { SinglePositionInterface } from '@/typings/_global';
import { styled } from 'styled-components';

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

const ConfirmCloseModal = ({
  visible,
  onClose,
  onOk,
  ele,
  indexPrice,
  loading,
}: {
  visible: boolean;
  onClose: () => void;
  onOk: (sizeValue?: any) => void;
  ele: SinglePositionInterface;
  indexPrice?: string;
  loading?: boolean;
}) => {
  const [inputAmount, handleInputAmount, handleInputMax] = useInputChange({ defaultValue: '', max: ele?.sizeValue });

  const handleConfirm = () => {
    onOk(inputAmount);
  };
  return (
    <Modal
      loading={loading}
      visible={visible}
      title="Close Position"
      // loading={loading}
      onCancel={onClose}
      ok="Confirm"
      onOk={handleConfirm}
    >
      <CloseModal>
        <p className="info row-between">
          <span>Mark Price</span>
          <span>${indexPrice?.toBFixed(2)}</span>
        </p>
        <p className="info row-between">
          <span>Entry Price</span>
          <span>${ele?.entryPrice.toBFixed(2)}</span>
        </p>
        <p className="info row-between">
          <span>Liq.Price</span>
          <span>${ele?.liqPrice.toBFixed(2)}</span>
        </p>
        <hr />
        <div className="label">
          <h6>Price</h6>
        </div>
        <Input
          value={indexPrice?.toBFixed(2)}
          className="input"
          placeholder="$0000.00"
          size="lg"
          disabled
          suffix={<span className="extra">Market Price</span>}
        />
        <div className="label">
          <h6>Amount</h6>
        </div>
        <Input
          onChange={handleInputAmount}
          value={inputAmount}
          className="input keep-style"
          size="lg"
          suffix={
            <p className="extra row-end">
              <Button onClick={handleInputMax}>Max</Button>
              <span>USD</span>
            </p>
          }
        />
        <hr />
        <p className="info row-between">
          <span>Size</span>
          <span>${ele.sizeValue.toBFixed(2)}</span>
        </p>
        <p className="info row-between">
          <span>PNL</span>
          <span>${ele.earnings.toBFixed(2)}</span>
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
  );
};

export default ConfirmCloseModal;
