import { useAccount } from 'wagmi';

enum STATUS {
  connected = 'connected',
  reconnecting = 'reconnecting',
  connecting = 'connecting',
  disconnected = 'disconnected',
}
const useAuth = (needStatus?: boolean | undefined) => {
  const { address, status } = useAccount();

  if (needStatus) {
    return status;
  }
  return !!address;
};

export default useAuth;
