import styled from 'styled-components';
import LineWaveBackground from './components/lineWaveBackground';

const Wrapper = styled.div`
  position: relative;
  z-index: 1;
  padding: 92px;
  /* max-width: 100vw; */
  /* overflow-x: hidden; */
  /* width: 100vw; */
  /* background-image: url(${require('../../assets/images/home/bg.jpg')}); */
  /* background-repeat: no-repeat; */
  /* background-size: 1920px 810px; */
  /* background-size: cover; */
  /* background-position: center center; */
  .banner {
    margin: 0 auto;
    width: 1112px;
    min-height: calc(100vh - 360px);
  }
  .left {
    h2 {
      margin: 0;
      font-family: 'Sofia-Pro';
      font-style: normal;
      font-weight: 700;
      font-size: 61px;
      line-height: 110%;
      color: #ffffff;
    }
    .text {
      margin: 50px 0;
      width: 476px;
      font-family: 'Inter';
      font-style: normal;
      font-weight: 400;
      font-size: 16px;
      line-height: 24px;
      color: rgba(255, 255, 255, 0.85);
    }
    .button {
      width: 207px;
      height: 40px;
      background: linear-gradient(265.56deg, #246cf9 -0.27%, #1e68f6 -0.26%, #0047d0 98.59%);
      box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
      border-radius: 40px;
      font-family: 'Sofia-Pro';
      font-style: normal;
      font-weight: 700;
      font-size: 16px;
      color: #ffffff;
      user-select: none;
      cursor: pointer;
      transition: all 0.3s ease-in-out;
      &:hover {
        background: linear-gradient(0deg, rgba(255, 255, 255, 0.25), rgba(255, 255, 255, 0.25)),
          linear-gradient(265.56deg, #246cf9 -0.27%, #1e68f6 -0.26%, #0047d0 98.59%);
      }
    }
    .jump {
      gap: 44px;
      margin-top: 24px;
      p {
        margin: 0;
        user-select: none;
        cursor: pointer;
      }
      span {
        font-family: 'SofiaW03-SemiBold';
        font-style: normal;
        font-weight: 400;
        font-size: 14px;
        line-height: 32px;
      }
      p:nth-child(1),
      p:nth-child(2) {
        color: rgba(255, 255, 255, 0.25);
        cursor: not-allowed;
      }
      p:nth-child(3) {
        color: #ffffff;
        transition: all 0.3s ease-in-out;
        &:hover {
          text-decoration: underline;
        }
      }
      img {
        width: 16px;
        height: 16px;
      }
    }
  }
  .right {
    position: relative;
    width: 556px;
    height: 526px;
    img {
      position: absolute;
      top: 0;
      left: 0;
      width: 717px;
      height: 526px;
    }
  }
  .contact {
    height: 220px;
    .logo {
      margin-bottom: 32px;
      width: 347px;
      height: 40px;
    }
    .ditch {
      gap: 96px;
      div {
        width: 72px;
        height: 72px;
        user-select: none;
        cursor: pointer;
        /* transition: all .3s ease-in-out; */
        &:hover {
          filter: brightness(100);
        }
      }
      img {
        display: block;
        margin: 0 auto;
        width: 40px;
        height: 40px;
      }
      p {
        margin-top: 4px;
        font-family: 'Graphik';
        font-style: normal;
        font-weight: 400;
        font-size: 14px;
        line-height: 22px;
        text-align: center;
        color: #a5adcf;
        text-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
      }
    }
  }
`;

function Home() {
  return (
    <>
      <LineWaveBackground />

      <Wrapper>
        <div className="banner row-between">
          <div className="left">
            <h2>
              Trade on DEX with CEX’s
              <br />
              experiences.
            </h2>
            <p className="text">
              Every transaction on Substance Exchange will be completely recorded on the blockchain. Our contract will
              ensure the settlement of every transaction. In fact, the process of settlement, deposit, and withdraw is
              completely unaffected by human factors.
            </p>
            <div className="button row-center">Trade Now</div>
            <div className="jump row-start">
              <p className="row-center">
                <span>Learn more</span>
                <img src={require('@/assets/images/home/jump_arrow_no.svg')} alt="icon" />
              </p>
              <p className="row-center">
                <span>Use the API</span>
                <img src={require('@/assets/images/home/jump_arrow_no.svg')} alt="icon" />
              </p>
              <p
                className="row-center"
                onClick={() => {
                  window.open('https://discord.gg/substanceX', '_blank');
                }}
              >
                <span>Join Discord</span>
                <img src={require('@/assets/images/home/jump_arrow.svg')} alt="icon" />
              </p>
            </div>
          </div>
          <div className="right">
            <img src={require('@/assets/images/home/banner.png')} alt="icon" />
          </div>
        </div>
        <div className="contact col-center">
          <img className="logo" src={require('@/assets/images/home/logo_2.svg')} alt="icon" />
          <div className="ditch row-center">
            <div
              onClick={() => {
                window.open('https://twitter.com/SubstanceX_', '_blank');
              }}
            >
              <img className="logo" src={require('@/assets/images/home/icon_1.svg')} alt="icon" />
              <p>Twitter</p>
            </div>
            <div
              onClick={() => {
                window.open('https://t.me/Substance_X', '_blank');
              }}
            >
              <img className="logo" src={require('@/assets/images/home/icon_2.svg')} alt="icon" />
              <p>Telegram</p>
            </div>
            <div
              onClick={() => {
                window.open('https://discord.gg/substanceX', '_blank');
              }}
            >
              <img className="logo" src={require('@/assets/images/home/icon_3.svg')} alt="icon" />
              <p>Discord</p>
            </div>
            <div
              onClick={() => {
                window.open('https://medium.com/@SubstanceX', '_blank');
              }}
            >
              <img className="logo" src={require('@/assets/images/home/icon_4.svg')} alt="icon" />
              <p>Medium</p>
            </div>
          </div>
        </div>
      </Wrapper>
    </>
  );
}

export default Home;
