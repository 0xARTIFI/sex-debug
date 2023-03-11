import { GlobalStyle } from '@/assets/styles/global';
import { client, WagmiConfig } from '@/configs/wallet';
import { RecoilRoot } from 'recoil';
import styled from 'styled-components';
import WalletModal from './components/_global/WalletModal';
import Perpetual from './pages/Perpetual';
import Stake from './pages/Stake';
import TraderAssets from './pages/TraderAssets';

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

function App() {
  return (
    <RecoilRoot>
      <WagmiConfig client={client}>
        <GlobalStyle />
        <Wrapper className="">
          <div className="inner col-start">
            <WalletModal />
            <div className="row-between full-width" style={{ gap: '20px' }}>
              <TraderAssets />
              <Stake />
            </div>
            <Perpetual />
          </div>
        </Wrapper>
      </WagmiConfig>
    </RecoilRoot>
  );
}

export default App;
