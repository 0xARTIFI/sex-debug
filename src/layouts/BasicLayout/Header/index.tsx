/* eslint-disable react/no-danger */
import { IconLayoutCopy, IconLayoutLogout, IconLayoutStopcock } from '@/assets/icons/IconGroup';
import { Button, Select } from '@/components';
import TransferModal from '@/components/_global/TransferModal';
import useAuth from '@/hooks/useAuth';
import useFetchFaucet from '@/hooks/useFetchFaucet';
import { recoilBalances, recoilExchangeFuturePrice } from '@/models/_global';
import { generateAvatar } from '@/utils/jazzIcon';
import { filterHideText, filterThousands } from '@/utils/tools';
import { useBoolean } from 'ahooks';
import BigNumber from 'bignumber.js';
import clipboard from 'copy-to-clipboard';
import { ethers } from 'ethers';
import * as React from 'react';
import { NavLink } from 'react-router-dom';
import { useRecoilValue } from 'recoil';
import styled from 'styled-components';

const Wrapper = styled.header`
  position: sticky;
  right: 0;
  top: 0;
  left: 0;
  padding: 0 48px;
  height: 72px;
  background: rgba(20, 21, 24, 0.65);
  backdrop-filter: blur(5px);
  z-index: 5;
  .logo {
    margin-right: 40px;
    width: 36px;
    height: 36px;
  }
  nav {
    gap: 16px;
    a {
      padding: 0 16px;
      height: 40px;
      border-radius: 20px;
      user-select: none;
      font-weight: 600;
      font-size: 16px;
      line-height: 40px;
      transition: all 0.3s ease-in-out;
      &:not(.disabled):hover {
        background: #323a4f;
        color: #e5e6ed;
      }
    }
    .active {
      background: #323a4f;
      color: #e5e6ed;
    }
    .default {
      color: #54678b;
    }
    .disabled {
      color: rgba(255, 255, 255, 0.25);
      cursor: not-allowed;
    }
  }
  .right {
    gap: 16px;
  }
  .stopcock {
    padding: 0;
    width: 40px;
    border-radius: 50%;
    svg {
      fill: #e5e6ed;
      transition: all 0.3s ease-in-out;
      &:hover {
        fill: #316ed8;
      }
    }
  }
  .select {
    z-index: 3;
    .inside {
      padding: 0 12px;
    }
  }
  .wallet {
    .balance {
      font-size: 14px;
    }
    .address {
      margin: 0 8px;
      padding: 0 8px;
      height: 28px;
      background: rgba(255, 255, 255, 0.08);
      border-radius: 14px;
      img {
        margin-right: 6px;
        width: 16px;
        height: 16px;
        border-radius: 50%;
      }
      span {
        font-weight: 500;
        font-size: 14px;
        color: #e5e6ed;
      }
    }
  }
`;

const InternalSelect = styled.div`
  padding: 0 16px;
  width: 300px;
  .address {
    padding: 20px 0;
    span {
      font-size: 16px;
      line-height: 120%;
      color: #e5e6ed;
    }
    svg {
      margin-left: 12px;
      fill: #54678b;
      user-select: none;
      cursor: pointer;
      transition: all 0.3s ease-in-out;
      &:hover {
        opacity: 0.6;
      }
    }
  }
  hr {
    margin: 0;
    padding: 0;
    height: 1px;
    border: none;
    background: #34384c;
  }
  .tips {
    margin: 16px 0 12px 0;
    font-size: 14px;
    line-height: 120%;
    color: #54678b;
  }
  .balance {
    margin-bottom: 16px;
    font-weight: 500;
    font-size: 20px;
    line-height: 120%;
    color: #e5e6ed;
  }
  .label {
    margin: 16px 0 12px 0;
    font-size: 14px;
    line-height: 120%;
    color: #54678b;
  }
  .info {
    font-size: 16px;
    line-height: 120%;
    color: #e5e6ed;
  }
  .info + .info {
    margin-top: 8px;
  }
  .more {
    margin: 12px 0 16px 0;
    font-size: 14px;
    line-height: 120%;
    color: #316ed8;
    user-select: none;
    cursor: pointer;
    transition: all 0.3s ease-in-out;
    &:hover {
      color: #0e4bc3;
    }
  }
  .button {
    gap: 8px;
    padding: 16px 0;
    button {
      flex: 1;
      padding: 0 8px;
    }
  }
  .logout {
    margin: 8px 0;
    svg {
      margin-right: 4px;
    }
  }
`;

function Header() {
  const { address, isConnected, disconnect, connect } = useAuth(true);

  const balances = useRecoilValue(recoilBalances);
  const { futurePrice } = useRecoilValue(recoilExchangeFuturePrice);
  const { WETH_IN_ACCOUNT, USDC_IN_ACCOUNT } = balances;

  const wethReadable = React.useMemo(() => ethers.utils.formatUnits(WETH_IN_ACCOUNT, 18), [WETH_IN_ACCOUNT]);
  const usdcReadable = React.useMemo(() => ethers.utils.formatUnits(USDC_IN_ACCOUNT, 6), [USDC_IN_ACCOUNT]);
  const totalAssetsPrice = React.useMemo(
    () =>
      BigNumber(wethReadable)
        .plus(BigNumber(usdcReadable).div(BigNumber(futurePrice).div(100)))
        .toFixed(8, BigNumber.ROUND_DOWN),
    [futurePrice, usdcReadable, wethReadable],
  );

  const [transferModalVisible, { setTrue, setFalse }] = useBoolean(false);
  const { run: fetchFaucetRun, loading: fetchFaucetLoading } = useFetchFaucet();

  return (
    <>
      <Wrapper className="row-between">
        <div className="left row-start">
          <img className="logo" src={require('@/assets/images/layout/logo.svg')} alt="icon" />
          <nav className="row-start">
            <NavLink className={({ isActive }) => (isActive ? 'active' : 'default')} to="/">
              Home
            </NavLink>
            <NavLink className={({ isActive }) => (isActive ? 'active' : 'default')} to="/option">
              Option
            </NavLink>
            <NavLink className={({ isActive }) => (isActive ? 'active' : 'default')} to="/perpetual">
              Perpetual
            </NavLink>
            <NavLink className={({ isActive }) => (isActive ? 'active' : 'default')} to="/stake-earn">
              Stake & Earn
            </NavLink>
            <a className="disabled">Dashboard</a>
            <a className="disabled">Doc</a>
          </nav>
        </div>
        <div className="right row-end">
          {!isConnected && (
            <Button type="solid" size="lg" onClick={() => connect()}>
              Connect Wallet
            </Button>
          )}
          {isConnected && (
            <React.Fragment>
              {/* <Button className="otc-container stopcock" type="solid" size="lg">
              OTC
            </Button> */}
              {address ? (
                <Button
                  disabled={fetchFaucetLoading}
                  onClick={fetchFaucetRun}
                  className="stopcock"
                  type="solid"
                  size="lg"
                  suffix={<IconLayoutStopcock />}
                />
              ) : null}
              <Select
                className="select"
                size="lg"
                placement="right"
                overlay={
                  <div className="wallet row-end">
                    <p className="balance">≈ {totalAssetsPrice.toBFixed(2)} ETH</p>
                    <p className="address row-end">
                      <img src={generateAvatar(address as string, 200)} alt="icon" />
                      <span>{filterHideText(address as string, 6)}</span>
                    </p>
                  </div>
                }
                follow
              >
                <InternalSelect>
                  <p className="address row-start">
                    <span>Hi, {filterHideText(address as string, 6)}</span>
                    <IconLayoutCopy
                      onClick={() => {
                        clipboard(address as string);
                        // message.success('successfully');
                      }}
                    />
                  </p>
                  <hr />
                  <p className="tips">Your Substance Asset Value </p>
                  <p className="balance row-between">
                    <span>≈ {filterThousands(totalAssetsPrice, 8)}</span>
                    <span>ETH</span>
                  </p>
                  <hr />
                  <p className="label">Detail</p>
                  <p className="info row-between">
                    <span>{filterThousands(wethReadable, 4)}</span>
                    <span>ETH</span>
                  </p>
                  <p className="info row-between">
                    <span>{filterThousands(usdcReadable, 4)}</span>
                    <span>USDC</span>
                  </p>
                  <p className="info row-between">
                    <span>{filterThousands(0.0, 4)}</span>
                    <span>SEX Token</span>
                  </p>
                  <p className="more">and more</p>
                  <hr />
                  <div className="button row-between">
                    <Button>Buy Token</Button>
                    <Button onClick={setTrue}>Transfer</Button>
                    <Button disabled>Swap</Button>
                  </div>
                  <hr />
                  <Button className="logout" type="text" prefix={<IconLayoutLogout />} onClick={() => disconnect()}>
                    Disconnect
                  </Button>
                </InternalSelect>
              </Select>
            </React.Fragment>
          )}
        </div>
      </Wrapper>
      <TransferModal visible={transferModalVisible} onCancel={setFalse} onOk={setFalse} />
    </>
  );
}

export default Header;
