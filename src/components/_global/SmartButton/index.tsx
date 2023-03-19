/* eslint-disable no-nested-ternary */
import Button from '@/components/Button';
import useAuth from '@/hooks/useAuth';
import useChainWatcher from '@/hooks/useChainWatcher';
import { useMemo } from 'react';

const SmartButton = ({ children, onClick, loading, disabled, ...props }: any) => {
  const { setupNetwork, unsupported, isLoading } = useChainWatcher();
  const { isConnected, connect } = useAuth();

  const handleClick = (e: any) => {
    if (!isConnected) {
      connect();
      return;
    }
    if (unsupported) {
      setupNetwork();
      return;
    }
    onClick && onClick(e);
  };

  const curDisabled = useMemo(() => {
    if (!isConnected) return false;
    return disabled;
  }, [disabled, isConnected]);
  return (
    <Button {...props} onClick={handleClick} loading={isLoading || loading} disabled={curDisabled}>
      {!isConnected ? 'Conenct' : unsupported ? 'Switch Network' : children}
    </Button>
  );
};

export default SmartButton;
