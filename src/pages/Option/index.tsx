import { Button } from '@/components';
import Input from '@/components/Input';
import Tabs from '@/components/Tabs';
import { SmartButton } from '@/components/_global';
import { TRADE_DIRECTION_ENUM } from '@/configs/common';
import useFetchOptionPositions from '@/hooks/option/useFetchOptionPositions';
import useOptionExerciseDate from '@/hooks/option/useOptionExerciseDate';
import useOptionPriceMap from '@/hooks/option/useOptionPriceMap';
import useOptionReedem from '@/hooks/option/useOptionReedem';
import useOptionsActiveEpochId from '@/hooks/option/useOptionsActiveEpochId';
import usePurchaseOption from '@/hooks/option/usePurchaseOption';
import useInputChange from '@/hooks/useInputChange';
import { recoilOptionEpochIds, recoilUnsettledOptionPositions } from '@/models/_global';
import { useMount } from 'ahooks';
import BigNumber from 'bignumber.js';
import dayjs from 'dayjs';
import { useEffect, useMemo } from 'react';
import { useRecoilValue } from 'recoil';
import { styled } from 'styled-components';

const Container = styled.div`
  &.b,
  .b {
    border: 1px solid rgba(0, 0, 0, 0.4);
    padding: 10px;
  }
  &.gap {
    gap: 20px;
  }
  .gap {
    gap: 12px;
  }

  .divider {
    height: 1px;
    width: 100%;
    background-color: rgba(0, 0, 0, 0.4);
    margin: 20px 0;
  }
`;

const tabs = [
  { name: TRADE_DIRECTION_ENUM.CALL, key: TRADE_DIRECTION_ENUM.CALL },
  { name: TRADE_DIRECTION_ENUM.PUT, key: TRADE_DIRECTION_ENUM.PUT },
];

const Option = () => {
  const [curDirection, handleChangeTab] = useInputChange({ defaultValue: TRADE_DIRECTION_ENUM.CALL });
  const { run } = useOptionsActiveEpochId();
  const { run: optionPriceMapRun, data } = useOptionPriceMap();
  const { run: fetchOptionPositionsRun } = useFetchOptionPositions();
  const { startEpochId, endEpochId } = useRecoilValue(recoilOptionEpochIds);
  const { curExerciseTime, exerciseDateList } = useOptionExerciseDate();

  const { run: redeem, loading: redeemLoading } = useOptionReedem();

  useMount(() => {
    optionPriceMapRun();
    run();
  });

  useEffect(() => {
    if (startEpochId && endEpochId) {
      fetchOptionPositionsRun({ from: startEpochId, to: endEpochId });
    }
  }, [endEpochId, fetchOptionPositionsRun, startEpochId]);

  const handleSelectChange = (e: { target: { value: any } }, setValue: (arg0: any) => void) => {
    const v = e.target.value;

    setValue(v);
  };
  const [value, handleChange] = useInputChange({
    defaultValue: exerciseDateList ? exerciseDateList[0] : '',
    callback: handleSelectChange,
  });

  const [strikePriceAmount, handleStrikePriceAmount] = useInputChange({
    callback: handleSelectChange,
    defaultValue: '0',
  });

  const [inputAmount, handleInputAmount] = useInputChange({});

  const curOptionProduct: any = useMemo(
    () => data?.priceMap[curDirection.toLowerCase()][strikePriceAmount],
    [curDirection, data?.priceMap, strikePriceAmount],
  );

  const curOptionPrice = useMemo(
    () =>
      BigNumber(curOptionProduct?.value || '0')
        .div(1e6)
        .toString(),
    [curOptionProduct?.value],
  );

  const totalCost = useMemo(
    () =>
      BigNumber(curOptionPrice || 0)
        .multipliedBy(inputAmount || 0)
        .toString(),
    [curOptionPrice, inputAmount],
  );

  const { run: purchaseOptionRun, loading: purchaseOptionLoading } = usePurchaseOption();

  const handleConfirm = () => {
    purchaseOptionRun(endEpochId, curOptionProduct?.index, inputAmount);
  };

  const optionPosition = useRecoilValue(recoilUnsettledOptionPositions);

  const handleRedeem = (epochIds: string | string[], productIds: string | string[]) => {
    redeem(epochIds, productIds);
  };

  // console.table(data?.priceMap?.call);
  return (
    <Container className="full-width gap col-start ">
      <div className="row-between gap full-width">
        <div className="b col-start gap full-width">
          <Tabs className="full-width" items={tabs} onChange={handleChangeTab} />

          <div className="col-start full-width gap">
            <div className="row-between full-width">
              <span>Exercise Date</span>
              <select onChange={handleChange} name="exerciseDateList" id="pet-select">
                {exerciseDateList?.map((i) => (
                  <option disabled={i.disabled} value={i.value}>
                    {i.label}
                  </option>
                ))}
              </select>
            </div>
            <div className="row-between full-width">
              <span>Strike Price</span>
              <div className="row-center">
                <input
                  onChange={handleStrikePriceAmount}
                  type="range"
                  id="strike-price"
                  name="cowbell"
                  min={curDirection === TRADE_DIRECTION_ENUM.PUT ? data?.putMin : data?.callMin}
                  max={curDirection === TRADE_DIRECTION_ENUM.PUT ? data?.putMax : data?.callMax}
                  value={strikePriceAmount}
                  step="1"
                />
                <label htmlFor="strike-price">{strikePriceAmount}</label>
              </div>
            </div>

            <div className="row-between full-width">
              <span>Option Price</span>
              <div className="row-center">
                <Input suffix={'U'} disabled value={curOptionPrice} />
              </div>
            </div>

            <div className="row-between full-width">
              <span>Enter Amount</span>
              <div className="row-center">
                <Input value={inputAmount} onChange={handleInputAmount} suffix={curDirection} />
              </div>
            </div>

            <div className="row-between full-width">
              <span>Total Cose</span>
              <span>{totalCost}U</span>
            </div>

            <SmartButton loading={purchaseOptionLoading} onClick={handleConfirm}>
              CONFIRM
            </SmartButton>
          </div>
        </div>
        <div className="b full-width">
          {optionPosition?.length
            ? optionPosition?.map((i, index) => (
                <div key={index} className="col-start gap full-width">
                  <div className="row-between full-width">
                    <div>Product</div>
                    <div>{!i?.isCall ? TRADE_DIRECTION_ENUM.PUT : TRADE_DIRECTION_ENUM.CALL}</div>
                  </div>

                  <div className="row-between full-width">
                    <div>Shares</div>
                    <div>{i?.totalSize}</div>
                  </div>

                  <div className="row-between full-width">
                    <div>Strike Price</div>
                    <div>{i?.strikePrice}</div>
                  </div>

                  <div className="row-between full-width">
                    <div>Exercise Date</div>
                    <div>{i?.canRedeem ? 'Valid' : dayjs(i?.redeemTime).format('MM-DD HH:mm')}</div>
                  </div>

                  <Button
                    disabled={!i?.canRedeem}
                    loading={redeemLoading}
                    onClick={() => handleRedeem(i?.epochId, i?.productId)}
                  >
                    redeem
                  </Button>
                  <div className="divider" />
                </div>
              ))
            : null}
        </div>
      </div>
    </Container>
  );
};

export default Option;
