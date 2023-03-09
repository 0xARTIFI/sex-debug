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
  padding: 10px;
`;

function App() {
  return (
    <RecoilRoot>
      <WagmiConfig client={client}>
        <GlobalStyle />
        <Wrapper className="col-center" style={{ gap: '20px' }}>
          <WalletModal />
          <div className="row-between full-width" style={{ gap: '20px' }}>
            <TraderAssets />
            <Stake />
          </div>
          <Perpetual />
        </Wrapper>
      </WagmiConfig>
    </RecoilRoot>
  );
}

export default App;
