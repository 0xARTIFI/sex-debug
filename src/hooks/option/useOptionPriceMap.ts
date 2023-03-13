import { getOptionPriceMap } from '@/services';
import { useRequest } from 'ahooks';
import BigNumber from 'bignumber.js';

interface optionItems {
  value: string;
  index: number | string;
}

const useOptionPriceMap = () => {
  const optionPriceMap = async () => {
    try {
      const res = await getOptionPriceMap();
      if (!res?.call || !res?.put) return null;
      const callMap = res?.call;
      const putMap = res?.put;
      const callMax = BigNumber.max(...Object.keys(res?.call)).toString();
      const callMin = BigNumber.min(...Object.keys(res?.call)).toString();
      const putMax = BigNumber.max(...Object.keys(res?.put)).toString();
      const putMin = BigNumber.min(...Object.keys(res?.put)).toString();

      const callLen = Object.keys(res?.call).length;
      const putLen = Object.keys(res?.call).length;
      if (callLen !== putLen) {
        console.warn(`Invalid length, call length:${callLen}, put length:${putLen}`);
      }

      const newCallMap: any = {};
      const newPutMap: any = {};
      // 1472: 1000000 -> 1472: {value: 1000000, index: 0}
      Object.keys(callMap).forEach((i: any, index: any) => {
        if (!newCallMap[i]) {
          newCallMap[i] = {
            value: 0,
            index: -1,
          };
        }
        newCallMap[i] = {
          value: callMap[i],
          index: !index ? index : index * 2,
        };
      });
      Object.keys(putMap).forEach((i: any, index: any) => {
        if (!newPutMap[i]) {
          newPutMap[i] = {
            value: 0,
            index: -1,
          };
        }
        newPutMap[i] = {
          value: putMap[i],
          index: index * 2 + 1,
        };
      });

      // [call[0], put[0], ...] 拼接下标
      const priceMap = {
        call: newCallMap,
        put: newPutMap,
      };

      return {
        priceMap,
        callMax,
        callMin,
        putMax,
        putMin,
      };
    } catch (e) {
      return null;
    }
  };

  const props = useRequest(optionPriceMap, {
    manual: true,
  });
  return props;
};

export default useOptionPriceMap;
