import { useRecoilState } from 'recoil';
import useBalances from '@/hooks/useBalances';
import { recoilBalances } from '@/models/_global';
import { BalancesEnum } from '@/configs/common';
import { useAccount, useConnect, useDisconnect } from 'wagmi';
import { InjectedConnector } from 'wagmi/connectors/injected';
import { Button } from '@/components';
import styled from 'styled-components';

const Wrapper = styled.div`
  button {
    margin: 200px auto;
    width: 200px;
  }
`;

function WalletModal() {
  const { address, isConnected } = useAccount();
  const { connect } = useConnect({
    connector: new InjectedConnector(),
  });
  const { disconnect } = useDisconnect();

  const [balances] = useRecoilState(recoilBalances);

  useBalances();

  if (isConnected) {
    return (
      <Wrapper>
        Loading: {JSON.stringify(balances['loading'])}
        <br />
        ETH: {balances[BalancesEnum.ETH_IN_WALLET]}
        <br />
        USDC: {balances[BalancesEnum.USDC_IN_WALLET]}
        <br />
        WETH: {balances[BalancesEnum.WETH_IN_WALLET]}
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
