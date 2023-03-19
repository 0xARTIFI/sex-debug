/* eslint-disable @typescript-eslint/indent */
import { IconGlobalMore } from '@/assets/icons/IconGroup';
import { Button, Select } from '@/components';
import { SmartButton } from '@/components/_global';
import { TRADE_DIRECTION_ENUM } from '@/configs/common';
import useAdjustMargin from '@/hooks/perpetual/useAdjustMargin';
import useClosePositon from '@/hooks/perpetual/useClosePositon';
import { recoilCurrentToken } from '@/models/_global';
import { SinglePositionInterface } from '@/typings/_global';
import { filterColor } from '@/utils/tools';
import { useBoolean } from 'ahooks';
import { useRecoilValue } from 'recoil';
import styled from 'styled-components';
import CollateralModal from '../CollateralModal';
import ConfirmCloseModal from '../ConfirmCloseModal';

const Container = styled.li`
  .position {
    align-items: center;
    .align-start {
      align-items: flex-start;
    }
    span {
      line-height: 1.2;
      &:nth-of-type(2) {
        font-size: 12px;
      }
    }
  }
`;

const InternalSelect = styled.ul`
  margin: 4px 0;
  li {
    width: 148px;
    white-space: nowrap;
  }
`;

const Positions = ({ ele, indexPrice }: { ele: SinglePositionInterface; indexPrice?: string }) => {
  // todo 支持多币种
  const curToken = useRecoilValue(recoilCurrentToken);

  const { run: closePosition, loading: clostPositionLoading } = useClosePositon();

  const { run: adjustRun, loading: adjustLoading } = useAdjustMargin();

  const handleAdjust = (direction: TRADE_DIRECTION_ENUM, marginAmount: string) => {
    adjustRun(direction, marginAmount, indexPrice);
  };
  const handleClosePosition = () => {
    setTrue();
  };

  const [visible, { setTrue, setFalse }] = useBoolean(false);

  const [collateralVisible, { setTrue: setCollateralVisibleTrue, setFalse: setCollateralVisibleFalse }] =
    useBoolean(false);

  const handleConfirm = (sizeValue: string | number) => {
    closePosition(ele?.direction as TRADE_DIRECTION_ENUM, sizeValue);
  };

  return (
    <>
      <Container className="row-start">
        <p className="row-start  position gap-8">
          <img src={curToken?.image} alt="coin" />
          <span className="col-start gap-8 align-start">
            <span>{curToken?.label}</span>
            <span className="row-start gap-8">
              <span className={filterColor(ele?.direction === 'SHORT' ? 1 : 0)}>{ele?.direction}</span>
              <span>{ele?.leverage.toBFixed(2)}x</span>
            </span>
          </span>
        </p>
        <p>${ele?.netValue?.toBFixed(2)}</p>
        <p>${ele?.sizeValue?.toBFixed(2)}</p>
        <p>${ele?.collateral?.toBFixed(2)}</p>
        <p>${ele?.entryPrice?.toBFixed(2)}</p>
        <p>${indexPrice?.toBFixed(2)}</p>
        <p>${ele?.liqPrice?.toBFixed(2)}</p>
        <div className="action row-start">
          <SmartButton onClick={handleClosePosition} className="close" size="sm">
            Close
          </SmartButton>
          <Select
            className="select"
            placement="right"
            arrow={false}
            overlay={<Button className="more" type="solid" size="sm" suffix={<IconGlobalMore />} />}
            follow
          >
            <InternalSelect>
              <li onClick={setCollateralVisibleTrue}>Collateral</li>
              {/* <li className={`${false ? 'active' : ''}`.trimEnd()}>YYY</li> */}
            </InternalSelect>
          </Select>
        </div>
      </Container>
      <CollateralModal
        loading={adjustLoading}
        ele={ele}
        indexPrice={indexPrice}
        onOk={handleAdjust}
        visible={collateralVisible}
        onClose={setCollateralVisibleFalse}
      />
      <ConfirmCloseModal
        loading={clostPositionLoading}
        ele={ele}
        indexPrice={indexPrice}
        onOk={handleConfirm}
        visible={visible}
        onClose={setFalse}
      />
    </>
  );
};

export default Positions;
