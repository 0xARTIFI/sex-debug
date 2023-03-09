import { injectedConnector } from '@/configs/wallet';
import useAuth from '@/hooks/useAuth';
import useBalances from '@/hooks/useBalances';
import useChainWatcher from '@/hooks/useChainWatcher';
import { recoilBalances } from '@/models/_global';
import { useRecoilState } from 'recoil';
import styled from 'styled-components';
import { useAccount, useConnect, useDisconnect, useNetwork } from 'wagmi';
import SmartButton from '../SmartButton';

const Wrapper = styled.div`
  button {
    width: 200px;
  }
  .gap {
    gap: 20px;
  }
`;

function WalletModal() {
  useAuth();
  const { address, isConnected } = useAccount();
  const { chain, chains } = useNetwork();
  const { setupNetwork, unsupported } = useChainWatcher();

  const { connect } = useConnect({
    connector: injectedConnector,
  });
  const { disconnect } = useDisconnect();

  const [balances] = useRecoilState(recoilBalances);

  useBalances();

  // const { longPosition, shortPosition, run } = useFetchPositions({ futurePrice: 0 });

  // console.log('longPositionParams', longPosition, shortPosition);

  if (isConnected) {
    return (
      <Wrapper className="full-width col-center">
        <div className="row-between gap">
          <SmartButton style={{ color: '#fff' }} onClick={() => disconnect()}>
            Disconnect
          </SmartButton>
          {unsupported ? (
            <SmartButton style={{ color: '#fff' }} onClick={setupNetwork}>
              Switch
            </SmartButton>
          ) : null}
        </div>
        <br />
        <span>Connected to {address}</span>
        <br />
        <span>ChainId {chain?.id}</span>
      </Wrapper>
    );
  }
  return (
    <Wrapper>
      <SmartButton style={{ color: '#fff' }} onClick={() => connect()}>
        Connect Wallet
      </SmartButton>
    </Wrapper>
  );
}

export default WalletModal;
