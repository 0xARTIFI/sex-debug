/* eslint-disable no-multi-assign */
/* eslint-disable no-extend-native */
import { TRADE_DIRECTION_ENUM } from '@/configs/common';
import BigNumber from 'bignumber.js';
import dayjs from 'dayjs';
import UTC from 'dayjs/plugin/utc';
import { uniq, uniqBy } from 'lodash-es';
import { Address } from 'wagmi';

dayjs.extend(UTC);

type FormatType = 'DD/MM/YYYY' | 'DD/MM/YYYY HH:mm:ss' | 'HH:mm:ss' | 'MM/DD' | 'MM/DD HH:mm';

// UTC本地时间格式化
export const filterTime = (value: string | number, format: FormatType = 'DD/MM/YYYY') => {
  const stamp = typeof value === 'number' ? value : Number(value);
  return dayjs.utc(stamp).local().format(format);
};

// 首字母大写
export const filterTitleCase = (value: string) => {
  return value.toLowerCase().replace(/^\S/, (s) => s.toUpperCase());
};

// 数字精度 -> decimalPlaces[does not retain trailing zeros]
export const filterPrecision = (value: string | number, decimal = 4) => {
  const result = new BigNumber(value).toFixed(decimal, BigNumber.ROUND_DOWN).toString();
  return result;
};

// 数字千位分割
export const filterThousands = (value: string | number, decimal = 4) => {
  if (new BigNumber(value).isNaN()) return value;
  const result = new BigNumber(filterPrecision(value, decimal)).toFormat(decimal, BigNumber.ROUND_DOWN);
  return result;
};

// 隐藏文本信息
export const filterHideText = (value: string | Address, before = 4, after = 4, fuzz = '....') => {
  if (!value || value.length <= before + after) return value;
  return `${value.slice(0, before)}${fuzz}${value.slice(-after)}`;
};

// 最大值过滤
export const filterMaxNumber = (value: string, max = '0', decimal = 4) => {
  if (new BigNumber(value).isNaN() || /^[0-9]\d*\.$/.test(value)) return value;
  const result = BigNumber.minimum(value, filterPrecision(max, decimal)).toString();
  return result;
};

// 最小精度显示优化
export const filterMinimumPrecision = (value: string, decimal = 4, prefix = '<') => {
  if (Number(value) === 0) return '0';
  // eslint-disable-next-line @iceworks/best-practices/recommend-polyfill
  const minimum = `0.${'1'.padStart(decimal, '0')}`;
  const compare = new BigNumber(value).isGreaterThan(minimum);
  const result = compare ? filterThousands(value, decimal) : `${prefix}${minimum}`;
  return result;
};

// 大数缩写 -> K M B
export const filterAbbreviation = (value: string, decimal = 2) => {
  const compare = new BigNumber(value).isGreaterThan(1e6);
  const million = `${filterThousands(new BigNumber(value).dividedBy(1e6).toString(), decimal)}M`;
  const result = compare ? million : filterThousands(value, decimal);
  return result;
};

// 数组元素重复校验
export const verifyRepeat = (value: any[], key?: string) => {
  const temp = value.filter((x) => (key ? x[key] : x));
  const shake = key ? uniqBy(temp, key) : uniq(temp);
  return !(shake.length === temp.length);
};

// 非负数校验
export const verifyValidNumber = (value: string, decimal = 4) => {
  const regexp = decimal === 0 ? '(^(0|[1-9]\\d*)$)' : `(^(0|([1-9]\\d*))(\\.\\d{0,${decimal}})?$)`;
  // const regexp = new RegExp(`(^[1-9]\\d*(\\.\\d{0,${decimal}})?$)|(^0(\\.\\d{0,${decimal}})?$)`);
  return !new RegExp(regexp).test(value);
};

// UUID(RFC4122) -> https://stackoverflow.com/questions/105034/how-to-create-a-guid-uuid#answer-2117523
export const uuidv4 = () => {
  const UINT36 = '10000000-1000-4000-8000-100000000000';
  // eslint-disable-next-line no-bitwise
  const random = (x: string) => ((Number(x) ^ crypto.getRandomValues(new Uint8Array(1))[0]) & 15) >> (Number(x) / 4);
  return UINT36.replace(/[018]/g, (x) => random(x)!.toString(16));
};

// 外链跳转
export const jumpLink = (address: string, target: '_self' | '_blank' = '_self') => {
  window.open(address, target);
};

// blob下载
export const download = (fileName: string, content: Blob) => {
  if (!('download' in window.document.createElement('a'))) {
    return 'Please Replace Browser';
  }
  const blob = new Blob([content], { type: '' });
  const link = window.document.createElement('a');
  link.download = fileName;
  link.style.display = 'none';
  link.href = URL.createObjectURL(blob);
  window.document.body.appendChild(link);
  link.click();
  URL.revokeObjectURL(link.href);
  window.document.body.removeChild(link);
  return '';
};

String.prototype.toBFixed = function (_decimal = 2) {
  const temp = BigNumber(this.toString());

  if (temp.isNaN()) return this;

  // 2.0034
  const str = temp.toString();
  const fraction = str.includes('.') ? str.split('.')[1] : '';
  // 整数
  if (!fraction) return str;
  const decimal = fraction.split('').findIndex((i) => i !== '0') + _decimal;

  return temp.toFixed(decimal, BigNumber.ROUND_DOWN);
};

// 维持保证金率
export const maintenanceMarginRate = 0.05;
// 强平保证金率
export const liqMarginRate = 0.02;

// * @param N originCollateral 2个
// * @param n sizePrice 400U
// * @param entryPrice 开仓价 1600U
// 强平价格公式
export const getLiqPrice = ({ S1, n, N, dir = TRADE_DIRECTION_ENUM.LONG }: any) => {
  if (!S1 || !n || !N) return '0.00';

  // (S1 + n/N)/(1+ 强平保证金率)
  if (dir === TRADE_DIRECTION_ENUM.SHORT) {
    return BigNumber(BigNumber(S1).plus(BigNumber(BigNumber(n).multipliedBy(S1)).div(N)))
      .div(BigNumber(liqMarginRate).plus(1))
      .toString();
  }

  // （1+0.02)/（1/S1 + originCollateral /（张数*面值））
  return BigNumber(1 + liqMarginRate)
    .div(BigNumber(1).div(S1).plus(BigNumber(n).div(N).div(S1)))
    .toString();
};

export const filterColor = (params: 0 | 1 | 2) => {
  if (params === 0) {
    return 'up';
  }
  if (params === 1) {
    return 'down';
  }
  return 'initial';
};
