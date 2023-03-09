import { injectedConnector } from '@/configs/wallet';
import { useAccount, useConnect, useDisconnect } from 'wagmi';

const useAuth = (needStatus?: boolean | undefined) => {
  const { address, status, isConnected, isConnecting, isDisconnected } = useAccount();

  const { connect } = useConnect({
    connector: injectedConnector,
  });
  const { disconnect } = useDisconnect();

  if (needStatus) {
    return { address, status, isConnected, isConnecting, isDisconnected, disconnect, connect };
  }
  return { isConnected, connect, disconnect };
};

export default useAuth;
