import { Select } from '@/components';
import { recoilCurrentToken } from '@/models/_global';
import classNames from 'classnames';
import { useState } from 'react';
import { useSetRecoilState } from 'recoil';
import styled from 'styled-components';

const CoinSelect = styled.ul`
  margin: 4px 0;
  li {
    height: 32px !important;
    border-radius: 16px;
    img {
      margin-right: 8px;
      width: 20px;
      height: 20px;
      border-radius: 50%;
    }
    span {
      font-size: 14px;
      color: #e5e6ed;
    }
  }
  li + li {
    margin-top: 4px;
  }
`;

const basicTokenListData = [
  {
    value: 'WETH',
    label: 'ETH',
    image: require('@/assets/images/tokens/eth.svg'),
    decimal: 18,
  },
  {
    value: 'BTC',
    label: 'BTC',
    image: require('@/assets/images/tokens/btc.svg'),
    decimal: 18,
    disabled: true,
  },
  {
    value: 'DOGE',
    label: 'DOGE',
    image: require('@/assets/images/tokens/doge.svg'),
    decimal: 18,
    disabled: true,
  },
  {
    value: 'SHIB',
    label: 'SHIB',
    image: require('@/assets/images/tokens/shib.svg'),
    decimal: 18,
    disabled: true,
  },
];

const TokenSelect = ({
  onChange,
  list = basicTokenListData,
  baseCoin = 'USD',
}: {
  onChange?: (e: any) => void;
  list?: Array<{
    value: string;
    label: string;
    image: any;
    disabled?: boolean;
    decimal?: number;
  }>;
  baseCoin?: string | boolean;
}) => {
  const [activeToken, setTokenSelect] = useState(list[0]);
  const setCurToken = useSetRecoilState(recoilCurrentToken);

  const handleChange = (e: any) => {
    if (e?.disabled) return;
    onChange && onChange(e);
    setTokenSelect(e);
    setCurToken(e);
  };

  return (
    <Select
      className="select"
      size="lg"
      overlay={
        <p className="coin row-start">
          <img src={activeToken.image} alt="coin" />
          <span>{baseCoin ? `${activeToken.label}/${baseCoin}` : activeToken.label}</span>
        </p>
      }
      follow
    >
      <CoinSelect>
        {list.map((ele) => (
          <li
            className={classNames('row-start', {
              active: ele.label === activeToken.label,
              disabled: ele.disabled,
            })}
            key={ele.value}
            onClick={() => handleChange(ele)}
          >
            <img src={ele.image} alt="coin" />
            <span>{baseCoin ? `${ele.label}/${baseCoin}` : ele.label}</span>
          </li>
        ))}
      </CoinSelect>
    </Select>
  );
};

export default TokenSelect;
