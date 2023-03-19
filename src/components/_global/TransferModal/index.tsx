/* eslint-disable no-confusing-arrow */
import Button from '@/components/Button';
import Input from '@/components/Input';
import Modal from '@/components/Modal';
import { IconArrowDown } from '@/components/_icons';
import useTraderDeposit from '@/hooks/account/useTraderDeposit';
import useAuth from '@/hooks/useAuth';
import useInputChange from '@/hooks/useInputChange';
import { recoilAllowance, recoilBalances } from '@/models/_global';
import BigNumber from 'bignumber.js';
import { ethers } from 'ethers';
import { useEffect, useMemo } from 'react';
import { useRecoilValue } from 'recoil';
import { styled } from 'styled-components';
import SmartButton from '../SmartButton';
import TokenSelect from '../TokenSelect';

const StyledModal = styled(Modal)`
  .inner-modal {
    width: 360px;
    background: #242731;
    box-shadow: 0px 6px 16px rgba(0, 0, 0, 0.08), 0px 3px 6px -4px rgba(0, 0, 0, 0.12),
      0px 9px 28px 8px rgba(0, 0, 0, 0.05);
    border-radius: 20px;
    .header {
      border-color: #34384c;
      h4 {
        padding-left: 16px;
        text-align: left;
        color: rgba(255, 255, 255, 0.85);
      }
    }

    .disabled-input-container {
      .md {
        color: #34384c;
        padding: 0 20px;

        input {
          font-weight: 500;
          font-size: 16px;
          line-height: 120%;
          color: #e5e6ed;
        }
        label {
          background: rgba(47, 50, 65, 0.5);
          border-radius: 20px;
        }
      }
    }

    .coin {
      gap: 8px;
    }

    .select {
      width: 100%;
      img {
        width: 20px;
        height: 20px;
      }
      .lg {
        background: rgba(47, 50, 65, 1);
      }
    }
    .content {
      padding: 24px;
    }
    .account-container {
      padding: 0px 0 24px;
    }
    .available-balances {
      align-self: flex-start;
      color: #9cadcd;
      font-weight: 400;
      font-size: 14px;
      line-height: 120%;
      padding-left: 16px;
    }

    .available-input {
      padding: 0px 20px;
      input {
        color: #e5e6ed;
        padding-right: 4px;
        font-weight: 500;
        font-size: 16px;
        line-height: 120%;
        position: relative;
        z-index: 1;
      }
      .max-button {
        border-radius: 16px;
        padding: 7.5px 16px;
        width: auto;
        position: relative;
        z-index: 1;
      }
      label {
        background: rgba(47, 50, 65, 0.5);
        border: 1px solid #34384c;
        border-radius: 20px;
      }
    }

    .confirm {
      height: 40px;
      border-radius: 20px;
    }
  }
`;

const basicTokenListData = [
  {
    value: 'WETH',
    label: 'ETH',
    image: require('@/assets/images/tokens/eth.svg'),
  },
  {
    value: 'USDC',
    label: 'USDC',
    image: require('@/assets/images/tokens/usdc.svg'),
  },
];

const TransferModal = ({ visible, onCancel, onOk }: { visible: boolean; onCancel: () => void; onOk: () => void }) => {
  const [currentToken, handleChangeCurrentToken] = useInputChange({ defaultValue: basicTokenListData[0] });
  const balances = useRecoilValue(recoilBalances);
  const allowances = useRecoilValue(recoilAllowance);

  const availableBalance = useMemo(
    () =>
      currentToken?.value === 'WETH'
        ? ethers.utils.formatUnits(balances.WETH_IN_WALLET, 18).toString()
        : ethers.utils.formatUnits(balances.USDC_IN_WALLET, 18).toString(),
    [balances, currentToken],
  );

  const currentAllowance = useMemo(
    () =>
      currentToken?.value === 'WETH'
        ? ethers.utils.formatUnits(allowances.WETH_IN_WALLET_ALLOWANCE, 18).toString()
        : ethers.utils.formatUnits(allowances.USDC_IN_WALLET_ALLOWANCE, 18).toString(),
    [allowances.USDC_IN_WALLET_ALLOWANCE, allowances.WETH_IN_WALLET_ALLOWANCE, currentToken?.value],
  );

  const [value, onChange, handleMax] = useInputChange({ max: availableBalance, type: 'number' });

  useEffect(() => {
    onChange('');
  }, [availableBalance]);

  const { isConnected } = useAuth();

  const { run: depositRun, loading: depositLoading, data: depositData, error: depositError } = useTraderDeposit();

  const handleDeposit = () => {
    if (!currentToken?.value) return;

    depositRun(currentToken?.value.toUpperCase(), value);
  };

  return (
    <StyledModal title="Transfer" visible={visible} onOk={onOk} onCancel={onCancel}>
      <div className="col-start full-width" style={{ gap: '12px' }}>
        <div className="account-container col-start full-width" style={{ gap: '24px' }}>
          <div className="disabled-input-container col-start full-width" style={{ gap: '16px' }}>
            <Input type="text" className="full-width" value="Your Wallet" disabled />
            <IconArrowDown />
            <Input className="full-width" value="Option Account" disabled />
          </div>
          <TokenSelect onChange={handleChangeCurrentToken} list={basicTokenListData} baseCoin={false} />
          <div className="col-start full-width" style={{ gap: '8px' }}>
            <Input
              className="available-input full-width"
              onChange={onChange}
              value={value}
              suffix={
                <Button onClick={handleMax} className="max-button">
                  Max
                </Button>
              }
            />
            <span className="available-balances">{availableBalance} Available</span>
          </div>
        </div>

        <SmartButton
          loading={depositLoading}
          onClick={handleDeposit}
          disabled={isConnected && !value}
          className="confirm"
        >
          {BigNumber(currentAllowance).gte(value) ? 'Confirm' : 'Approve'}
        </SmartButton>
      </div>
    </StyledModal>
  );
};

export default TransferModal;
