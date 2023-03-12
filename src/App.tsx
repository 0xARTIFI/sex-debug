import { GlobalStyle } from '@/assets/styles/global';
import { client, WagmiConfig } from '@/configs/wallet';
import { RecoilRoot } from 'recoil';
import { styled } from 'styled-components';
import Debug from './pages/Debug';

const Wrapper = styled.div`
  height: 100vh;
  overflow-y: auto;
`;

function App() {
  return (
    <RecoilRoot>
      <WagmiConfig client={client}>
        <GlobalStyle />
        <Wrapper>
          <Debug />
          {/* <Home /> */}
        </Wrapper>
      </WagmiConfig>
    </RecoilRoot>
  );
}

export default App;
