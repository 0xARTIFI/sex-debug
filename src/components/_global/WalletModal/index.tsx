import useBalances from '@/hooks/useBalances';
import { recoilBalances } from '@/models/_global';
import { BalancesEnum } from '@/configs/common';
import { useRecoilState } from 'recoil';
import { useAccount, useConnect, useDisconnect } from 'wagmi';
import { InjectedConnector } from 'wagmi/connectors/injected';

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
      <div>
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
        <button style={{ color: '#fff' }} onClick={() => disconnect()}>
          Disconnect
        </button>
      </div>
    );
  }
  return (
    <button style={{ color: '#fff' }} onClick={() => connect()}>
      Connect Wallet
    </button>
  );
}

export default WalletModal;
