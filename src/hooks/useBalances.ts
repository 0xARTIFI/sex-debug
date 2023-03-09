/* eslint-disable @typescript-eslint/no-shadow */
import { USDCContract, WETHContract } from '@/configs/common';
import { recoilBalances } from '@/models/_global';
import { BalancesEnum } from '@/typings/_global';
import { Address, fetchBalance, multicall } from '@wagmi/core';
import { useRequest } from 'ahooks';
import { ethers } from 'ethers';
import { useCallback, useEffect } from 'react';
import { useRecoilState } from 'recoil';
import { useAccount } from 'wagmi';

const useBalances = () => {
  const { address } = useAccount();
  const [, setBalances] = useRecoilState(recoilBalances);
  const balancesCall = async (innerAccount: Address) => {
    return Promise.all([
      multicall({
        contracts: [
          {
            ...USDCContract,
            functionName: 'balanceOf',
            args: [innerAccount],
          },
          {
            ...WETHContract,
            functionName: 'balanceOf',
            args: [innerAccount],
          },
        ],
      }),
      fetchBalance({
        address: innerAccount,
      }),
    ]);
  };

  const { run, data, loading, error } = useRequest((account) => balancesCall(account), {
    manual: true,
  });

  useEffect(() => {
    if (loading) {
      setBalances((old) => {
        const _old = JSON.parse(JSON.stringify(old));
        return {
          ..._old,
          loading: true,
        };
      });
    } else {
      setBalances((old) => {
        const _old = JSON.parse(JSON.stringify(old));
        return {
          ..._old,
          loading: false,
        };
      });
    }
  }, [loading]);
  useEffect(() => {
    if (address) {
      run(address);
    }
  }, [address]);

  const saveBalances = useCallback(() => {
    if (!data?.length || !data[0]?.length) return;

    const wethBalance = ethers.BigNumber.from(data[0][0]).toString();
    const usdcBalance = ethers.BigNumber.from(data[0][1]).toString();

    const ethBalance = data[1]?.formatted;
    setBalances((old) => {
      const _old = JSON.parse(JSON.stringify(old));
      return {
        ..._old,
        [BalancesEnum.ETH_IN_WALLET]: ethBalance,
        [BalancesEnum.WETH_IN_WALLET]: wethBalance,
        [BalancesEnum.USDC_IN_WALLET]: usdcBalance,
      };
    });
  }, [data]);

  useEffect(() => {
    if (data) {
      saveBalances();
    }
  }, [data]);

  console.log('data', data);

  return null;
};
export default useBalances;
