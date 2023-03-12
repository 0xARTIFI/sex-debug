import { exchangeContract } from '@/configs/common';
import { recoilOptionEpochIds } from '@/models/_global';
import { getOptionByPrice } from '@/server';
import { prepareWriteContract, writeContract } from '@wagmi/core';
import { useRequest } from 'ahooks';
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
      // console.log('config', config);
      console.table(params);
      const tx = await writeContract(config);
      const res = await tx.wait();
      if (startEpochId && endEpochId) {
        fetchOptionPositionsRun(startEpochId, endEpochId);
      }
      return res;
    } catch (e: any) {
      console.log('e', e?.message);
      throw Error(e);
    }
  };

  const props = useRequest(pucharseOption, {
    manual: true,
  });

  return props;
};

export default usePurchaseOption;
