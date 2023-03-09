import { MAX_ALLOWANCE, TRADE_TOKEN, USDCContract, WETHContract } from '@/configs/common';
import { Address, prepareWriteContract, readContract, writeContract } from '@wagmi/core';
import { useRequest } from 'ahooks';
import { ethers } from 'ethers';
import { useAccount } from 'wagmi';

const useApprove = () => {
  const { address } = useAccount();

  const handleDeposit = async (
    inputToken: TRADE_TOKEN.USDC | TRADE_TOKEN.WETH,
    spender: Address,
    needAllowance?: number | string,
  ) => {
    const currentContract = inputToken === TRADE_TOKEN.USDC ? USDCContract : WETHContract;
    if (!address) throw Error('Invalid address');
    const allowance = await readContract({
      ...currentContract,
      functionName: 'allowance',
      args: [address, spender],
    });
    // 若存在needAllowance 则检查needAllowance
    if (needAllowance) {
      // 如果allowance > needAllowance 则无需approve
      if (ethers.BigNumber.from(allowance).gt(needAllowance)) {
        return true;
      }
    }

    // 若不存在needAllowance 则检查如果allowance是否存在即可
    if (ethers.BigNumber.from(allowance).gt(0)) {
      return true;
    }

    try {
      const config = await prepareWriteContract({
        ...currentContract,
        functionName: 'approve',
        args: [spender, ethers.BigNumber.from(MAX_ALLOWANCE)],
      });
      const tx = await writeContract(config);
      const res = await tx.wait();
      return res;
    } catch (e: any) {
      console.log('e', e?.message);
      throw Error(e);
    }
  };

  const { run, loading, data, error } = useRequest(handleDeposit, {
    manual: true,
  });
  return { run, loading, data, error };
};

export default useApprove;
