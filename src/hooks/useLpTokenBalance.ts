import { liquidityPoolContract } from '@/configs/common';
import { readContract } from '@wagmi/core';
import { useRequest } from 'ahooks';
import { useAccount } from 'wagmi';

const useLpTokenBalance = () => {
  const { address } = useAccount();

  const getLpTokenAmount = async () => {
    if (!address) throw Error('Invalid address');
    const amount = await readContract({
      ...liquidityPoolContract,
      functionName: 'tokenBalance',
      args: [address],
    });

    console.log('getLpTokenAmount', amount);
    return amount;
  };

  const { run, loading, data, error } = useRequest(getLpTokenAmount, {
    manual: true,
  });
  return { run, loading, data, error };
};

export default useLpTokenBalance;
