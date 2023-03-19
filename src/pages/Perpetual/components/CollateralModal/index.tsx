import { Input, Modal } from '@/components';
import { TRADE_DIRECTION_ENUM } from '@/configs/common';
import useInputChange from '@/hooks/useInputChange';
import { recoilBalances } from '@/models/_global';
import { SinglePositionInterface } from '@/typings/_global';
import React from 'react';
import { useRecoilValue } from 'recoil';
import { styled } from 'styled-components';

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

const CollateralModal = ({
  visible,
  onClose,
  onOk,
  ele,
  indexPrice,
  loading,
}: {
  visible: boolean;
  onClose: () => void;
  onOk: (direction: TRADE_DIRECTION_ENUM, marginAmount: string) => void;
  ele: SinglePositionInterface;
  indexPrice?: string;
  loading?: boolean;
}) => {
  const balances = useRecoilValue(recoilBalances);
  // const maxValue = useMemo(()=>{}, [

  // ])

  const [tabIndex, setTabIndex] = React.useState<TRADE_DIRECTION_ENUM.LONG | TRADE_DIRECTION_ENUM.SHORT>(
    TRADE_DIRECTION_ENUM.LONG,
  );
  const [inputAmount, handleInputAmount, handleInputMax] = useInputChange({ defaultValue: '', max: ele?.sizeValue });

  const handleConfirm = () => {
    onOk(tabIndex, inputAmount);
  };
  return (
    <Modal
      visible={visible}
      title="Manage Collateral"
      loading={loading}
      onCancel={onClose}
      disabled
      ok={true ? 'Confirm Edit' : 'Cannot Exceed Max. Leverage'}
      onOk={handleConfirm}
    >
      <ManageModal>
        <ul className={`tabs row-between ${tabIndex.toLowerCase()}`}>
          <li onClick={() => setTabIndex(TRADE_DIRECTION_ENUM.LONG)}>DEPOSIT</li>
          <li onClick={() => setTabIndex(TRADE_DIRECTION_ENUM.SHORT)}>WITHDRAW</li>
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
  );
};

export default CollateralModal;
