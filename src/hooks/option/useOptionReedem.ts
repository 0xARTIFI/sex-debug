import { message } from '@/components';
import { exchangeContract } from '@/configs/common';
import { recoilOptionEpochIds } from '@/models/_global';
import { prepareWriteContract, writeContract } from '@wagmi/core';
import { useRequest } from 'ahooks';
import { useEffect } from 'react';
import { useRecoilValue } from 'recoil';
import useFetchOptionPositions from './useFetchOptionPositions';

const useOptionReedem = () => {
  const { startEpochId, endEpochId } = useRecoilValue(recoilOptionEpochIds);
  const { run: fetchOptionPositionRun } = useFetchOptionPositions();

  const redeem = async (epochIds: string | string[], productIds: string | string[]) => {
    const epo = Array.isArray(epochIds) ? epochIds : [epochIds];
    const pri = Array.isArray(productIds) ? productIds : [productIds];
    if (!endEpochId || !epochIds?.length || !productIds?.length) return null;

    const params = [epo, pri];

    console.log('params', params);

    try {
      const config = await prepareWriteContract({
        ...exchangeContract,
        functionName: 'traderClaimProfit',
        args: [...params],
      });
      console.log('config', config);
      const tx = await writeContract(config);
      const res = await tx.wait();
      fetchOptionPositionRun({ to: endEpochId });
      return res;
    } catch (e: any) {
      console.log('e', e?.message);
      throw Error(e?.message);
    }
  };

  const { run, loading, data, error } = useRequest(redeem, { manual: true });

  useEffect(() => {
    if (data) {
      message.success('Success');
    }
  }, [data]);

  useEffect(() => {
    if (error) {
      message.error(error?.message);
    }
  }, [error]);

  return { run, loading, data, error };
};
export default useOptionReedem;
