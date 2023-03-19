import { message } from '@/components';
import { getFaucet } from '@/services';
import { useRequest } from 'ahooks';
import useAuth from './useAuth';

const useFetchFaucet = () => {
  const { address } = useAuth(true);

  const claimFaucet = async () => {
    if (!address) return;
    try {
      const tempRes = await getFaucet(address);
      const httpCode = tempRes?.status;
      if (tempRes?.detail) {
        message.error(tempRes?.detail || 'Fail to claim');
        throw new Error(tempRes?.detail || 'Fail to claim');
      }
      console.log('httpCode', tempRes, httpCode);
      if (tempRes === 'success') {
        message.success('Successfully Claimed');
      } else {
        message.error('Fail to claim');
        throw new Error('Fail to claim');
      }
    } catch (err: any) {
      throw new Error('Fail to claim');
    }
  };

  const props = useRequest(claimFaucet, {
    manual: true,
  });
  return props;
};

export default useFetchFaucet;
