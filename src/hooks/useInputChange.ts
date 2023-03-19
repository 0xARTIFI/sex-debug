import BigNumber from 'bignumber.js';
import { useState } from 'react';

// 如果外部传入callback则所有动作通过callback控制
const useInputChange = (props: {
  type?: string;
  max?: string | number;
  defaultValue?: any;
  callback?: (...props: any) => void;
}) => {
  const { defaultValue, callback, max, type } = props;
  const [value, setValue] = useState(defaultValue || '');
  const handleChange = (e: any) => {
    if (callback) {
      callback(e, setValue);
    } else {
      if (max && BigNumber(max).lte(e)) {
        setValue(BigNumber(max).toNumber());
        return;
      }
      if (type) {
        const amount = e.replace(/[^\d|.]/g, '');
        setValue(amount);
        return;
      }
      setValue(e);
    }
  };

  const handleMax = () => {
    if (!max) return null;
    handleChange(BigNumber(max).toNumber());
    return null;
  };

  return [value, handleChange, handleMax];
};
export default useInputChange;
