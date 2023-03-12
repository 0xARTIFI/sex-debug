import React from 'react';
import ReactDOM from 'react-dom';
import { Route, Router, Routes, useRoutes } from 'react-router-dom';

function App(props: any) {
  return (
    <div>
      <Router>{props.children}</Router>
    </div>
  );
}

function Loading() {
  return <div>Loading...</div>;
}

function Foo() {
  return <div>Foo</div>;
}

function Bar() {
  return <div>Bar</div>;
}

function SuspenseLayout() {
  const Layout = React.lazy(() => import('./Layout'));
  return (
    <React.Suspense fallback={<Loading />}>
      <Layout />
    </React.Suspense>
  );
}

const routes = [
  {
    path: '/',
    element: <SuspenseLayout />,
    children: [
      {
        path: '/foo',
        element: <Foo />,
      },
      {
        path: '/bar',
        element: <Bar />,
      },
    ],
  },
];

function Entry() {
  return (
    <App>
      <Routes4 />
    </App>
  );
}

export function Routes4() {
  return useRoutes(routes);
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<Entry />);
