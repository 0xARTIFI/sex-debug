import useLpTokenBalance from '@/hooks/lp/useLpTokenBalance';
import useFetchOptionPositions from '@/hooks/option/useFetchOptionPositions';
import useOptionsActiveEpochId from '@/hooks/option/useOptionsActiveEpochId';
import useExchangeFuturePrice from '@/hooks/perpetual/useExchangeFuturePrice';
import useFetchPerpetualPositions from '@/hooks/perpetual/useFetchPerpetualPositions';
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

  // public
  const { run: getOptionsActiveEpochId } = useOptionsActiveEpochId();
  const [interval, setInterval] = React.useState<undefined | number>(undefined);

  // option
  const [optionInterval, setOptionInterval] = React.useState<undefined | number>(undefined);
  const { run: fetchOptionPositionsRun } = useFetchOptionPositions();
  const { startEpochId, endEpochId } = useRecoilValue(recoilOptionEpochIds);

  // perpetual
  const { run: fetchPerpetualPositionsRun } = useFetchPerpetualPositions();
  const [perpetualInterval, setPerpetualInterval] = React.useState<undefined | number>(undefined);

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

  const perpetualBatchFetch = React.useCallback(() => {
    fetchPerpetualPositionsRun();
  }, [fetchPerpetualPositionsRun]);

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

  // perprtual
  React.useEffect(() => {
    if (pathname.includes('perpetual') && isConnected) {
      perpetualBatchFetch();
      setPerpetualInterval(20000);
    } else {
      setPerpetualInterval(undefined);
    }
  }, [isConnected, pathname, perpetualBatchFetch]);

  useInterval(() => {
    perpetualBatchFetch();
  }, perpetualInterval);

  return null;
};

export default Interval;
