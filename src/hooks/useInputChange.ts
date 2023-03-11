import { useState } from 'react';

// 如果外部传入callback则所有动作通过callback控制
const useInputChange = (props: { defaultValue?: any; callback?: (...props: any) => void }) => {
  const { defaultValue, callback } = props;
  const [value, setValue] = useState(defaultValue || '');
  const handleChange = (e: any) => {
    if (callback) {
      callback(e, setValue);
    } else {
      setValue(e);
    }
  };

  return [value, handleChange];
};
export default useInputChange;
