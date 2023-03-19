import { GlobalStyle } from '@/assets/styles/global';
import { client, WagmiConfig } from '@/configs/wallet';
import { GlobalScrollbar } from 'mac-scrollbar';
import { RecoilRoot } from 'recoil';
import { styled } from 'styled-components';

// import theme from '@/assets/styles/theme';
import BasicLayout from '@/layouts/BasicLayout';
import { createBrowserRouter, Link, RouterProvider } from 'react-router-dom';

const Wrapper = styled.div`
  /* height: 100vh;
  overflow-y: auto; */
`;

function NoMatch() {
  return (
    <div>
      <h2>Nothing to see here!</h2>
      <p>
        <Link to="/">Go to the home page</Link>
      </p>
    </div>
  );
}

const router = createBrowserRouter([
  {
    path: '/',
    element: <BasicLayout />,
    children: [
      {
        index: true,
        lazy: () => import('@/pages/home'),
      },
      {
        path: 'option',
        lazy: () => import('@/pages/option'),
      },
      {
        path: 'perpetual',
        lazy: () => import('@/pages/perpetual'),
      },
      {
        path: 'stake-earn',
        lazy: () => import('@/pages/stake-earn'),
      },
      {
        path: 'about',
        lazy: () => import('@/pages/About'),
      },
      {
        path: 'debug',
        lazy: () => import('@/pages/Debug'),
      },
      {
        path: 'test',
        lazy: () => import('@/pages/_test'),
      },
      // {
      //   path: 'about1',
      //   lazy: () => import('@/pages/About'),
      //   children: [
      //     {
      //       index: true,
      //       lazy: () => import('@/pages/About'),
      //     },
      //     {
      //       path: 'about3',
      //       lazy: () => import('@/pages/About'),
      //     },
      //   ],
      // },
      {
        path: '*',
        element: <NoMatch />,
      },
    ],
  },
]);

function App() {
  return (
    <RecoilRoot>
      {/* <ThemeProvider theme={theme}> */}
      <WagmiConfig client={client}>
        <GlobalStyle />
        <GlobalScrollbar
          skin="dark"
          trackStyle={(horizontal) => ({ [horizontal ? 'height' : 'width']: 0, right: 0, border: 0 })}
          thumbStyle={(horizontal) => ({ [horizontal ? 'height' : 'width']: 3 })}
        />
        <Wrapper>
          {/* <Debug /> */}
          {/* <Home /> */}
          <RouterProvider router={router} fallbackElement={<p>Loading...</p>} />
        </Wrapper>
      </WagmiConfig>
      {/* </ThemeProvider> */}
    </RecoilRoot>
  );
}

export default App;
