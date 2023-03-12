import { optionContract } from '@/configs/common';
import { recoilOptionEpochIds } from '@/models/_global';
import { multicall } from '@wagmi/core';
import { useRequest } from 'ahooks';
import BigNumber from 'bignumber.js';
import dayjs from 'dayjs';
import { useEffect } from 'react';
import { useRecoilValue } from 'recoil';

const useOptionExerciseDate = () => {
  const { endEpochId } = useRecoilValue(recoilOptionEpochIds);

  const getCurrentExerciseDate = async (currentId: number | string) => {
    if (!currentId || !BigNumber(currentId).isInteger()) return { curExerciseTime: 0, fakeList: [] };
    const multicallRes = await multicall({
      contracts: [
        {
          ...optionContract,
          functionName: 'strikeTimeRecords',
          args: [BigNumber(currentId).toNumber()],
        },
      ],
    });

    if (!multicallRes[0]?.toString()) return { curExerciseTime: 0, fakeList: [] };

    const curExerciseTime = +dayjs.unix(+multicallRes[0]?.toString());

    const fackHourList = [0, 0.5, 1, 1.5, 2, 3, 4, 6, 8, 12, 16, 24];
    const fakeList = fackHourList.map((i) => ({
      label: dayjs(curExerciseTime).add(i, 'hour').format('YYYY/MM/DD HH:mm'),
      value: dayjs(curExerciseTime).add(i, 'hour').format('YYYY/MM/DD HH:mm'),
      disabled: !!i,
    }));

    return { curExerciseTime, fakeList };
  };

  useEffect(() => {
    if (endEpochId) {
      props.run(endEpochId);
    }
  }, [endEpochId]);

  const props = useRequest(getCurrentExerciseDate, { manual: true });
  return { ...props, curExerciseTime: props?.data?.curExerciseTime, exerciseDateList: props?.data?.fakeList };
};

export default useOptionExerciseDate;
