import { Button } from '@/components';
import { BalancesEnum } from '@/configs/common';
import useAuth from '@/hooks/useAuth';
import useBalances from '@/hooks/useBalances';
import useFetchPositions from '@/hooks/useFetchPositions';
import { recoilBalances } from '@/models/_global';
import { ethers } from 'ethers';
import { useRecoilState } from 'recoil';
import styled from 'styled-components';
import { useAccount, useConnect, useDisconnect } from 'wagmi';
import { InjectedConnector } from 'wagmi/connectors/injected';

const Wrapper = styled.div`
  button {
    margin: 200px auto;
    width: 200px;
  }
`;

function WalletModal() {
  useAuth();
  const { address, isConnected } = useAccount();
  const { connect } = useConnect({
    connector: new InjectedConnector(),
  });
  const { disconnect } = useDisconnect();

  const [balances] = useRecoilState(recoilBalances);

  useBalances();

  const { longPosition, shortPosition, run } = useFetchPositions({ futurePrice: 0 });

  console.log('longPositionParams', longPosition, shortPosition);

  if (isConnected) {
    return (
      <Wrapper>
        Loading: {JSON.stringify(balances['loading'])}
        <br />
        ETH: {balances[BalancesEnum.ETH_IN_WALLET]}
        <br />
        USDC_IN_WALLET: {ethers.utils.formatUnits(balances[BalancesEnum.USDC_IN_WALLET], 18)}
        <br />
        WETH_IN_WALLET: {ethers.utils.formatUnits(balances[BalancesEnum.WETH_IN_WALLET], 18)}
        <br />
        <br />
        LONG: <br />
        {JSON.stringify(longPosition, null, 2)}
        <br />
        SHORT: <br />
        {JSON.stringify(shortPosition, null, 2)}
        <br />
        <br />
        Connected to {address}
        <Button style={{ color: '#fff' }} onClick={() => disconnect()}>
          Disconnect
        </Button>
      </Wrapper>
    );
  }
  return (
    <Wrapper>
      <Button style={{ color: '#fff' }} onClick={() => connect()}>
        Connect Wallet
      </Button>
    </Wrapper>
  );
}

export default WalletModal;
