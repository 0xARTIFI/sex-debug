import { Scrollbar } from '@/components';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

const Wrapper = styled.div`
  background: rgba(20, 21, 24, 1);
  > .header {
    height: 72px;
    background: rgba(243, 134, 134, 0.6);
  }
  > .main {
    height: calc(100vh - 72px);
  }
  > .footer {
    height: 50px;
  }
`;

function BasicLayout({ children }: any) {
  return (
    <Wrapper>
      <header className="header">
        <nav className="row-start">
          <Link to="/">Home</Link>
          <Link to="/about">About</Link>
          <Link to="/debug">Debug</Link>
          <Link to="/option">Option</Link>
        </nav>
      </header>
      <main className="main">
        <Scrollbar>
          {children}

          {/* <Outlet /> */}
          <footer className="footer">SubstanceX © 2023</footer>
        </Scrollbar>
      </main>
    </Wrapper>
  );
}

export default BasicLayout;
