import { liquidityPoolContract } from '@/configs/common';
import { recoilPoolBalances } from '@/models/_global';
import { multicall } from '@wagmi/core';
import { useRequest } from 'ahooks';
import { ethers } from 'ethers';
import { useSetRecoilState } from 'recoil';
import { Address, useAccount } from 'wagmi';

const useLpTokenBalance = () => {
  const { address } = useAccount();
  const setLpBalances = useSetRecoilState(recoilPoolBalances);

  const getLpTokenAmount = async () => {
    // const amount = await readContract({
    //   ...liquidityPoolContract,
    //   functionName: 'tokenBalance',
    //   args: [address],
    // });

    const amount = await multicall({
      contracts: [
        {
          ...liquidityPoolContract,
          functionName: 'tokenBalance',
          args: [address as Address],
        },
        {
          ...liquidityPoolContract,
          functionName: 'totalToken',
          args: [],
        },
        {
          ...liquidityPoolContract,
          functionName: 'totalUSDC',
          args: [],
        },
        {
          ...liquidityPoolContract,
          functionName: 'totalWETH',
          args: [],
        },
      ],
    });

    if (!amount?.length) throw new Error('Invalid amount');
    const userTokenBalance = ethers.BigNumber.from(amount[0]).toString();
    const totalTokenBalance = ethers.BigNumber.from(amount[1]).toString();
    const totalUSDCBalance = ethers.BigNumber.from(amount[2]).toString();
    const totalWETHBalance = ethers.BigNumber.from(amount[3]).toString();

    setLpBalances({
      loading: false,
      userPoolBalance: userTokenBalance,
      totalPoolBalance: totalTokenBalance,
      totalPoolUSDCBalance: totalUSDCBalance,
      totalPoolWETHBalance: totalWETHBalance,
    });

    return {
      userPoolBalance: userTokenBalance,
      totalPoolBalance: totalTokenBalance,
      totalPoolUSDCBalance: totalUSDCBalance,
      totalPoolWETHBalance: totalWETHBalance,
    };
  };

  const { run, loading, data, error } = useRequest(getLpTokenAmount, {
    manual: true,
  });
  return { run, loading, data, error };
};

export default useLpTokenBalance;
