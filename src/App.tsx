import { GlobalStyle } from '@/assets/styles/global';
import { client, WagmiConfig } from '@/configs/wallet';
import { RecoilRoot } from 'recoil';
import { styled } from 'styled-components';

import BasicLayout from '@/layouts/BasicLayout';
import Debug from '@/pages/Debug';
import { Suspense } from 'react';
import { createBrowserRouter, Link } from 'react-router-dom';

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
        lazy: () => import('@/pages/home_Old'),
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
        path: 'option',
        lazy: () => import('@/pages/option'),
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
    <Suspense fallback={null}>
      <RecoilRoot>
        <WagmiConfig client={client}>
          <GlobalStyle />
          <Wrapper>
            <Debug />
            {/* <Home /> */}
            {/* <RouterProvider router={router} fallbackElement={<p>Loading...</p>} /> */}
          </Wrapper>
        </WagmiConfig>
      </RecoilRoot>
    </Suspense>
  );
}

export default App;
