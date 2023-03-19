import { Outlet } from 'react-router-dom';
import styled from 'styled-components';
import Header from './Header';
import Interval from './Interval';

const Wrapper = styled.div`
  min-width: 1280px;
  .footer {
    height: 50px;
    border-top: 0.5px solid #34384c;
    border-bottom: 0.5px transparent;
    text-align: center;
    font-size: 14px;
    line-height: 50px;
    color: #54678b;
  }
`;

function BasicLayout({ children }: any) {
  return (
    <Wrapper>
      <Interval />
      <Header />
      <main>
        <Outlet />
        <footer className="footer">SubstanceX © {new Date().getFullYear()}</footer>
      </main>
    </Wrapper>
  );
}

export default BasicLayout;
