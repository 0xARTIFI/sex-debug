/* eslint-disable @typescript-eslint/indent */
import { recoilCurrentToken } from '@/models/_global';
import { OptionPositionItem } from '@/typings/_global';
import { useCountDown } from 'ahooks';
import BigNumber from 'bignumber.js';
import { useMemo } from 'react';
import { useRecoilValue } from 'recoil';

const Positions = ({ ele, priceMapData }: { priceMapData: any; ele: OptionPositionItem }) => {
  const curToken = useRecoilValue(recoilCurrentToken);

  const currentPrice = useMemo(() => {
    if (!ele || !priceMapData?.priceMap) return 0;
    const curDir = ele?.isCall ? 'call' : 'put';
    const curMap = priceMapData?.priceMap[curDir];
    if (!curMap[ele?.strikePrice]?.value) return 0;
    return BigNumber(curMap[ele?.strikePrice]?.value).div(1e6).toFixed(2, BigNumber.ROUND_DOWN);
  }, [ele, priceMapData?.priceMap]);

  // totalCost/totalSize
  const openPrice = useMemo(
    () => BigNumber(ele?.totalCost).div(1e6).div(ele?.totalSize).toFixed(2, BigNumber.ROUND_DOWN),
    [ele?.totalCost, ele?.totalSize],
  );

  const [, { hours, minutes, seconds }] = useCountDown({
    targetDate: ele?.redeemTime,
  });

  // let nowPrice = Number(strikePrice).toFixed()

  const pnl = useMemo(() => {
    return BigNumber(currentPrice).isZero()
      ? '--'
      : BigNumber(BigNumber(currentPrice).minus(openPrice).multipliedBy(ele?.totalSize).multipliedBy(100))
          .div(100)
          .toFixed(2, BigNumber.ROUND_DOWN);
  }, [currentPrice, ele.totalSize, openPrice]);

  const pnlRate = useMemo(() => {
    return BigNumber(currentPrice).isZero()
      ? '--'
      : BigNumber(BigNumber(currentPrice).minus(openPrice).div(openPrice).multipliedBy(10000))
          .div(100)
          .toFixed(2, BigNumber.ROUND_DOWN);
  }, [currentPrice, openPrice]);

  // PNL
  // nowPrice === undefined ? '--': Math.floor((nowPrice - record.buyPrice) * record.orderSize * 100)/100

  // PNL%
  // Math.ceil((nowPrice - record.buyPrice) / record.buyPrice  * 10000)/100
  return (
    <li className="row-start">
      <p className="row-start" style={{ gap: '8px' }}>
        <img src={curToken?.image} alt="coin" />
        <span>
          {curToken?.label}-{!ele?.isCall ? 'PUT' : 'CALL'}
        </span>
      </p>
      <p>{ele?.totalSize}</p>
      <p>${ele?.strikePrice}</p>
      <p>${openPrice}</p>
      <p>${currentPrice}</p>
      <p>
        {hours}:{minutes}:{seconds}
      </p>
      <p>{pnl}</p>
      <p>{pnlRate}%</p>
    </li>
  );
};

export default Positions;
