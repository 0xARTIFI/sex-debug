import { AllowancesEnum, BalancesEnum, exchangeContract, USDCContract, WETHContract } from '@/configs/common';
import { recoilAllowance, recoilBalances } from '@/models/_global';
import { Address, fetchBalance, multicall } from '@wagmi/core';
import { useRequest } from 'ahooks';
import { ethers } from 'ethers';
import { useCallback, useEffect } from 'react';
import { useSetRecoilState } from 'recoil';
import { useAccount } from 'wagmi';

// let hasRuned = false;

const useBalances = () => {
  const { address } = useAccount();
  const setBalances = useSetRecoilState(recoilBalances);
  const setAllowance = useSetRecoilState(recoilAllowance);

  const balancesCall = async () => {
    return Promise.all([
      multicall({
        contracts: [
          {
            ...USDCContract,
            functionName: 'balanceOf',
            args: [address as Address],
          },
          {
            ...WETHContract,
            functionName: 'balanceOf',
            args: [address as Address],
          },
          {
            ...exchangeContract,
            functionName: 'traderBalanceUSDC',
            args: [address],
          },
          {
            ...exchangeContract,
            functionName: 'traderBalanceWETH',
            args: [address],
          },
          {
            ...USDCContract,
            functionName: 'allowance',
            args: [address as Address, exchangeContract.address],
          },
          {
            ...WETHContract,
            functionName: 'allowance',
            args: [address as Address, exchangeContract.address],
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
  }, [loading, setBalances]);

  const saveBalances = useCallback(() => {
    if (!data?.length || !data[0]?.length) return;

    const usdcBalance = ethers.BigNumber.from(data[0][0]).toString();
    const wethBalance = ethers.BigNumber.from(data[0][1]).toString();
    const traderBalanceUSDC = ethers.BigNumber.from(data[0][2]).toString();
    const traderBalanceWETH = ethers.BigNumber.from(data[0][3]).toString();

    const usdcAllowance = ethers.BigNumber.from(data[0][4]).toString();
    const wethAllowance = ethers.BigNumber.from(data[0][5]).toString();

    const ethBalance = data[1]?.formatted;
    setBalances((old) => {
      const _old = JSON.parse(JSON.stringify(old));
      return {
        ..._old,
        [BalancesEnum.ETH_IN_WALLET]: ethBalance,
        [BalancesEnum.WETH_IN_WALLET]: wethBalance,
        [BalancesEnum.USDC_IN_WALLET]: usdcBalance,
        [BalancesEnum.WETH_IN_ACCOUNT]: traderBalanceWETH,
        [BalancesEnum.USDC_IN_ACCOUNT]: traderBalanceUSDC,
      };
    });

    setAllowance((old) => {
      const _old = JSON.parse(JSON.stringify(old));
      return {
        ..._old,
        [AllowancesEnum.USDC_IN_WALLET_ALLOWANCE]: usdcAllowance,
        [AllowancesEnum.WETH_IN_WALLET_ALLOWANCE]: wethAllowance,
      };
    });
  }, [data, setAllowance, setBalances]);

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

export default useBalances;
