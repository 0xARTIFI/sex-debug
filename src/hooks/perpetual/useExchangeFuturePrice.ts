import { exchangeContract } from '@/configs/common';
import { recoilExchangeFuturePrice } from '@/models/_global';
import { Address, fetchBalance, multicall } from '@wagmi/core';
import { useRequest } from 'ahooks';
import { ethers } from 'ethers';
import { useCallback, useEffect } from 'react';
import { useSetRecoilState } from 'recoil';
import { useAccount } from 'wagmi';

// let hasRuned = false;

const useExchangeFuturePrice = () => {
  const { address } = useAccount();
  const setPrices = useSetRecoilState(recoilExchangeFuturePrice);

  const balancesCall = async () => {
    return Promise.all([
      multicall({
        contracts: [
          {
            ...exchangeContract,
            functionName: 'getFuturePrice',
            args: [],
          },
        ],
      }),
      fetchBalance({
        address: address as Address,
      }),
    ]);
  };

  const { run, data, loading, cancel, error } = useRequest(() => balancesCall(), {
    manual: true,
  });

  useEffect(() => {
    if (loading) {
      setPrices((old) => {
        const _old = JSON.parse(JSON.stringify(old));
        return {
          ..._old,
          loading: true,
        };
      });
    } else {
      setPrices((old) => {
        const _old = JSON.parse(JSON.stringify(old));
        return {
          ..._old,
          loading: false,
        };
      });
    }
  }, [loading, setPrices]);

  const saveBalances = useCallback(() => {
    if (!data?.length || !data[0]?.length) return;

    const futurePrice = ethers.BigNumber.from(data[0][0]).toString();

    setPrices((old) => {
      const _old = JSON.parse(JSON.stringify(old));
      return {
        ..._old,
        futurePrice,
      };
    });
  }, [data, setPrices]);

  // useEffect(() => {
  //   if (address && !hasRuned) {
  //     hasRuned = true;
  //     run();
  //   }
  // }, [address, run]);

  useEffect(() => {
    if (data) {
      saveBalances();
    }
  }, [data, saveBalances]);

  // useUnmount(() => {
  //   cancel();
  //   hasRuned = false;
  // });

  return { run };
};

export default useExchangeFuturePrice;
