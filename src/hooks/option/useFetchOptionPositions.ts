import { optionContract } from '@/configs/common';
import {
  recoilAllOptionPositions,
  recoilOptionCurEpochIdExerciseTime,
  recoilOptionEpochIds,
  recoilSettledOptionPositions,
  recoilUnsettledOptionPositions,
} from '@/models/_global';
import { OptionPositionItem } from '@/typings/_global';
import { readContract } from '@wagmi/core';
import { useRequest } from 'ahooks';
import BigNumber from 'bignumber.js';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import useAuth from '../useAuth';

// todo 欠缺redeem时间
const useFetchOptionPositions = () => {
  const { endEpochId } = useRecoilValue(recoilOptionEpochIds);
  const setOptionPosition = useSetRecoilState(recoilAllOptionPositions);
  const setSettledOptionPositions = useSetRecoilState(recoilSettledOptionPositions);
  const setUnsettledOptionPositions = useSetRecoilState(recoilUnsettledOptionPositions);
  const { exerciseTime } = useRecoilValue(recoilOptionCurEpochIdExerciseTime);

  const { address } = useAuth(true);
  const fetchPosition = async ({ from, to }: { from?: number | string; to: number | string }) => {
    console.log('startEpoch', BigNumber.max(0, BigNumber(to).minus(35)).toNumber(), to);

    try {
      const res: any = await readContract({
        ...optionContract,
        functionName: 'getUserOptionData',
        args: [BigNumber.max(0, BigNumber(to).minus(35)).toNumber(), BigNumber(to).toNumber()],
        overrides: { from: address },
      });

      if (!res?.length) throw Error('Invalid');

      const positionLength = res[4].toString();

      const position: OptionPositionItem[] = [];
      for (let i = 0; i < positionLength; i++) {
        const epochId = res[0][i]?.toString();
        const productId = res[1][i]?.toString();
        const res2 = {
          isCall: res[2][i]?.isCall,
          strikePrice: res[2][i]?.strikePrice?.toString(),
        };
        const res3 = {
          isSettle: !!res[3][i]?.isSettle,
          totalCost: res[3][i]?.totalCost?.toString(),
          totalCostOrigin: res[3][i]?.totalCost,
          totalSize: res[3][i]?.totalSize?.toString(),
        };

        const canRedeem = endEpochId ? BigNumber(endEpochId).gt(epochId) : false;
        const redeemTime = canRedeem ? 0 : exerciseTime || 9999999999;

        position.push({
          epochId,
          productId,
          ...res2,
          ...res3,
          canRedeem,
          redeemTime,
        });
      }

      console.table(position);
      setOptionPosition(position);
      setSettledOptionPositions(position.filter((i) => i?.isSettle));
      setUnsettledOptionPositions(position.filter((i) => !i?.isSettle));
      return position;
    } catch (e: any) {
      console.log('e,', e);
      throw new Error(e?.message);
    }
  };

  const { run, loading, data, error } = useRequest(fetchPosition, { manual: true });

  // useEffect(() => {
  //   if (data) {
  //     message.success('Success');
  //   }
  // }, [data]);

  // useEffect(() => {
  //   if (error) {
  //     message.error(error?.message);
  //   }
  // }, [error]);

  return { run, loading, data, error };
};
export default useFetchOptionPositions;
