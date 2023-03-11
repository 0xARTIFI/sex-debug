import { exchangeContract } from '@/configs/common';
import { recoilExchangeTokenPrice } from '@/models/_global';
import { getSignatureAndPrice } from '@/server';
import { Address, fetchBalance, multicall } from '@wagmi/core';
import { useRequest } from 'ahooks';
import { ethers } from 'ethers';
import { useCallback, useEffect } from 'react';
import { useSetRecoilState } from 'recoil';
import { useAccount } from 'wagmi';

// let hasRuned = false;

const useExchangeTokenPrice = () => {
  const { address } = useAccount();
  const setPrices = useSetRecoilState(recoilExchangeTokenPrice);

  const balancesCall = async () => {
    const signature = await getSignatureAndPrice();
    console.log('signature', signature);

    const params = [false, signature?.prices, signature?.time, signature?.sign];

    return Promise.all([
      multicall({
        contracts: [
          {
            ...exchangeContract,
            functionName: 'getTokenPrice',
            args: [...params],
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

    const tokenPrice = ethers.BigNumber.from(data[0][0]).toString();

    setPrices((old) => {
      const _old = JSON.parse(JSON.stringify(old));
      return {
        ..._old,
        tokenPrice,
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

export default useExchangeTokenPrice;
