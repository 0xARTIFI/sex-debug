import { TraderAssets, WalletModal } from '@/components/_global';
import { styled } from 'styled-components';
import Option from '../Option_Old';
import Perpetual from '../Perpetual_Old';
import Stake from '../Stake';

const Wrapper = styled.div`
  width: 1000px;
  margin: auto;
  height: 100vh;

  .inner {
    padding: 10px 0 50px;

    overflow-y: auto;
    width: 100%;
    height: 100%;
    gap: 20px;
  }
`;

export function Component() {
  return (
    <Wrapper className="">
      <div className="inner col-start">
        <WalletModal />
        <div className="row-between full-width" style={{ gap: '20px' }}>
          <TraderAssets />
          <Stake />
        </div>
        <Perpetual />
        <Option />
      </div>
    </Wrapper>
  );
}

Component.displayName = 'Debug';

export default Component;
