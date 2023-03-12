import { useRequest } from 'ahooks';
import Toast from '../components/Toast';
import { futureLongContractAddr, futureShortContractAddr } from '../config';
import futureShortAbi from '../constants/abis/future.json';
import futureLongAbi from '../constants/abis/futureLong.json';
import { tradeDirection } from '../pages/future';
import ToastRetryContainer from '../pages/future/ToastRetryContainer';
import { useContract } from './useContract';

const useAdjustMargin = ({ direction }: { direction: string }) => {
  const futureContract = useContract(
    direction === tradeDirection.SHORT ? futureShortContractAddr : futureLongContractAddr,
    direction === tradeDirection.SHORT ? futureShortAbi : futureLongAbi,
  );

  // marginAmount为调整的保证金的数量，永远 >= 0，inc为是增是减, true=增, false=减
  const adjustMargin = async (marginAmount: any, inc: any) => {
    if (!futureContract || !marginAmount) return null;
    const params = [marginAmount, inc];
    console.log('调整保证金参数', params);
    try {
      const res = await futureContract.userAdjustMarginAmount(...params);
      const confirmation = await res.wait();
      if (confirmation?.status) {
        Toast.success('Transaction processed successfully.');
      }
      console.log('tx', confirmation);
      return confirmation;
    } catch (e) {
      // @ts-ignore
      const { code, action, reason } = e;
      console.log('code, action, reason', code, action, reason);
      Toast.error(<ToastRetryContainer message={reason} onClick={() => adjustMargin(marginAmount, inc)} />);
      return null;
    }
  };

  const {
    loading: adjustMarginLoading,
    run: adjustMarginRun,
    data: adjustMarginData,
  } = useRequest(adjustMargin, { manual: true });

  return {
    adjustMarginLoading,
    adjustMarginRun,
    adjustMarginData,
  };
};

export default useAdjustMargin;
