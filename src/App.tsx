import { RecoilRoot } from 'recoil';
import { GlobalStyle } from '@/assets/styles/global';
import { client, WagmiConfig } from '@/configs/wallet';
import { WalletModal } from '@/components/_global';
import styled from 'styled-components';

const Wrapper = styled.div``;

function App() {
  return (
    <RecoilRoot>
      <WagmiConfig client={client}>
        <GlobalStyle />
        <Wrapper className="col-center">
          <WalletModal />
        </Wrapper>
      </WagmiConfig>
    </RecoilRoot>
  );
}

export default App;
