/* eslint-disable @typescript-eslint/indent */
import { OptionPositionItem } from '@/typings/_global';
import { Button, Select } from '@/components';
import { IconGlobalMore } from '@/assets/icons/IconGroup';
import styled from 'styled-components';

const InternalSelect = styled.ul`
  margin: 4px 0;
  li {
    width: 148px;
    white-space: nowrap;
  }
`;

const Positions = ({ ele, priceMapData }: { priceMapData: any; ele: OptionPositionItem }) => {
  return (
    <li className="row-start">
      <p className="row-start">
        <img className="coin" src="https://placehold.jp/24x24.png" alt="coin" />
        <span>ETH-CALL</span>
      </p>
      <p>$10.14</p>
      <p>$47.49</p>
      <p>$10.10</p>
      <p>$1692.26</p>
      <p>$1692.54</p>
      <p>$1692.54</p>
      <div className="action row-start">
        <Button className="close" size="sm">
          Close
        </Button>
        <Select
          className="select"
          placement="right"
          arrow={false}
          overlay={<Button className="more" type="solid" size="sm" suffix={<IconGlobalMore />} />}
          follow
        >
          <InternalSelect>
            <li className={`${true ? 'active' : ''}`.trimEnd()}>XXX</li>
            <li className={`${false ? 'active' : ''}`.trimEnd()}>YYY</li>
          </InternalSelect>
        </Select>
      </div>
    </li>
  );
};

export default Positions;
