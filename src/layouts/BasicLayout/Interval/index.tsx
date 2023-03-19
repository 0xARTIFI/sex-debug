import useLpTokenBalance from '@/hooks/lp/useLpTokenBalance';
import useFetchOptionPositions from '@/hooks/option/useFetchOptionPositions';
import useOptionsActiveEpochId from '@/hooks/option/useOptionsActiveEpochId';
import useExchangeFuturePrice from '@/hooks/perpetual/useExchangeFuturePrice';
import useAuth from '@/hooks/useAuth';
import useBalances from '@/hooks/useBalances';
import { recoilOptionEpochIds } from '@/models/_global';
import { useInterval } from 'ahooks';
import React from 'react';
import { useLocation } from 'react-router-dom';
import { useRecoilValue } from 'recoil';

const Interval = () => {
  const { pathname } = useLocation();
  const { isConnected, address } = useAuth(true);
  const { run: getBalances } = useBalances();
  const { run: getFuturePrice } = useExchangeFuturePrice();
  const { run: getLpBanlances } = useLpTokenBalance();

  // option
  const { run: getOptionsActiveEpochId } = useOptionsActiveEpochId();
  const [interval, setInterval] = React.useState<undefined | number>(undefined);
  const [optionInterval, setOptionInterval] = React.useState<undefined | number>(undefined);
  const { run: fetchOptionPositionsRun } = useFetchOptionPositions();
  const { startEpochId, endEpochId } = useRecoilValue(recoilOptionEpochIds);

  const publicBatchFetch = React.useCallback(() => {
    getLpBanlances();
    getBalances();
    getFuturePrice();
    if (endEpochId) {
      fetchOptionPositionsRun({ from: startEpochId, to: endEpochId });
    }
  }, [endEpochId, fetchOptionPositionsRun, getBalances, getFuturePrice, getLpBanlances, startEpochId]);

  const optionsBatchFetch = React.useCallback(() => {
    getOptionsActiveEpochId();
  }, [getOptionsActiveEpochId]);

  // public
  React.useEffect(() => {
    if (isConnected) {
      publicBatchFetch();
      setInterval(10000);
    } else {
      setInterval(undefined);
    }
  }, [isConnected, address, getBalances, getFuturePrice, publicBatchFetch]);

  useInterval(() => {
    publicBatchFetch();
  }, interval);

  // option
  React.useEffect(() => {
    if (pathname.includes('option')) {
      optionsBatchFetch();
      setOptionInterval(20000);
    } else {
      setOptionInterval(undefined);
    }
  }, [getOptionsActiveEpochId, optionsBatchFetch, pathname]);

  useInterval(() => {
    optionsBatchFetch();
  }, optionInterval);

  return null;
};

export default Interval;
