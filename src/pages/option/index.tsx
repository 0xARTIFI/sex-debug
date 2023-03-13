import * as React from 'react';
import { Select, Input, Slider } from '@/components';
import styled from 'styled-components';

const Wrapper = styled.div`
  display: flex;
  align-items: stretch;
  padding: 24px;
  min-width: 1280px;
  min-height: calc(100vh - 72px);
  .contract-declare {
    display: flex;
    flex-direction: column;
    gap: 24px;
    width: calc(100vw - 414px);
  }
  .contract-dominate {
    display: flex;
    flex-direction: column;
    gap: 24px;
    margin-left: 24px;
    width: 342px;
  }
  .info {
    padding: 24px;
    background: #1e1f25;
    border-radius: 16px;
  }
  .chart {
    padding: 24px;
    background: #1e1f25;
    border-radius: 16px;
  }
  .order {
    padding: 24px;
    background: #1e1f25;
    border-radius: 16px;
  }
  .panel {
    padding: 24px;
    background: #1e1f25;
    border-radius: 16px;
  }
  .detail {
    padding: 24px;
    background: #1e1f25;
    border-radius: 16px;
  }
`;

export function Component() {
  return (
    <Wrapper>
      <div className="contract-declare">
        <div className="info row-start">
          <Select
            className="select"
            size="lg"
            placeholder={'hello'}
            // overlay={filterValue1 ? <p>{filterValue1}</p> : undefined}
            overlay={
              <p>
                <img src="https://placehold.jp/24x24.png" alt="coin" />
              </p>
            }
            follow
          >
            <ul>
              <li>111</li>
              <li>222</li>
            </ul>
          </Select>
          <div>
            <p>24h Change</p>
            <p>6.25%</p>
          </div>
          <div>
            <p>24h High</p>
            <p>1600.24</p>
          </div>
          <div>
            <p>24h Low</p>
            <p>1550.24</p>
          </div>
          <div>
            <p>Avbl. Amount</p>
            <p className="row-start">
              <img src="https://placehold.jp/24x24.png" alt="coin" />
              <span>5820.42</span>
            </p>
          </div>
          <div>
            <p>Index Price</p>
            <p className="row-start">
              <img src="https://placehold.jp/24x24.png" alt="coin" />
              <span>1155.50</span>
            </p>
          </div>
        </div>
        <div className="chart"></div>
        <div className="order"></div>
      </div>
      <div className="contract-dominate">
        <div className="panel"></div>
        <div className="detail"></div>
      </div>
    </Wrapper>
  );
}

Component.displayName = 'Option';
