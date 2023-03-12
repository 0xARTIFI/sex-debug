import * as React from 'react';
import { Outlet, Link } from 'react-router-dom';

export interface LayoutProps {
  children?: React.ReactNode;
}

const BasicLayout: React.FC<LayoutProps> = (props: LayoutProps) => {
  const { children } = props;

  return (
    <div>
      <nav style={{ height: 100, position: 'fixed', top: 0, zIndex: 100, background: 'red' }}>
        <ul>
          <li>
            <Link to="/">Home</Link>
          </li>
          <li>
            <Link to="/about">About</Link>
          </li>
          <li>
            <Link to="/debug">Debug</Link>
          </li>
        </ul>
      </nav>
      <Outlet />
    </div>
  );
};

export default BasicLayout;
