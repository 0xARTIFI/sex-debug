/* eslint-disable no-nested-ternary */
import Button from '@/components/Button';
import useAuth from '@/hooks/useAuth';
import useChainWatcher from '@/hooks/useChainWatcher';

const SmartButton = ({ children, onClick, loading, ...props }: any) => {
  const { setupNetwork, unsupported, isLoading } = useChainWatcher();
  const { isConnected, connect } = useAuth();

  const handleClick = () => {
    if (!isConnected) {
      connect();
      return;
    }
    if (unsupported) {
      setupNetwork();
      return;
    }
    onClick && onClick();
  };
  return (
    <Button {...props} onClick={handleClick} loading={isLoading || loading}>
      {!isConnected ? 'Conenct' : unsupported ? 'Switch Network' : children}
    </Button>
  );
};

export default SmartButton;
