import { useState } from 'react';

const useInputChange = (props: { defaultValue?: any; callback?: any }) => {
  const { defaultValue, callback } = props;
  const [value, setAmount] = useState(defaultValue);
  const handleChange = (e: any) => {
    setAmount(e);
    if (callback) {
      callback(e);
    }
  };

  return [value, handleChange];
};
export default useInputChange;
