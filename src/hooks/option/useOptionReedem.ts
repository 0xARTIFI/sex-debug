import { exchangeContract } from '@/configs/common';
import { recoilOptionEpochIds } from '@/models/_global';
import { prepareWriteContract, writeContract } from '@wagmi/core';
import { useRequest } from 'ahooks';
import { useRecoilValue } from 'recoil';
import useFetchOptionPositions from './useFetchOptionPositions';

const useOptionReedem = () => {
  const { startEpochId, endEpochId } = useRecoilValue(recoilOptionEpochIds);
  const { run } = useFetchOptionPositions();

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
      run({ to: endEpochId });
      return res;
    } catch (e: any) {
      console.log('e', e?.message);
      throw Error(e);
    }
  };

  const props = useRequest(redeem, { manual: true });
  return props;
};
export default useOptionReedem;
