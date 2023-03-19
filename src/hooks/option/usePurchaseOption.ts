import { message } from '@/components';
import { exchangeContract } from '@/configs/common';
import { recoilOptionEpochIds } from '@/models/_global';
import { getOptionByPrice } from '@/services';
import { prepareWriteContract, writeContract } from '@wagmi/core';
import { useRequest } from 'ahooks';
import { useEffect } from 'react';
import { useRecoilValue } from 'recoil';
import useFetchOptionPositions from './useFetchOptionPositions';

const usePurchaseOption = () => {
  const { run: fetchOptionPositionsRun } = useFetchOptionPositions();
  const { startEpochId, endEpochId } = useRecoilValue(recoilOptionEpochIds);

  const pucharseOption = async (epoch_id: any, product_id: any, buySize: number) => {
    const data = await getOptionByPrice(epoch_id, product_id);
    const signature = data?.data;
    const params = [
      signature?.epochId,
      signature?.productId,
      +buySize,
      signature?.buyPrice,
      signature?.futurePrice,
      signature?.buyPriceGenerateTime,
      signature?.signature,
    ];

    try {
      const config = await prepareWriteContract({
        ...exchangeContract,
        functionName: 'traderBuyOption',
        args: [...params],
      });
      console.table(params);
      const tx = await writeContract(config);
      const res = await tx.wait();
      if (startEpochId && endEpochId) {
        fetchOptionPositionsRun({ from: startEpochId, to: endEpochId });
      }
      return res;
    } catch (e: any) {
      console.log('e', e?.message);
      throw Error(e?.message);
    }
  };

  const { run, loading, data, error } = useRequest(pucharseOption, {
    manual: true,
  });

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

export default usePurchaseOption;
