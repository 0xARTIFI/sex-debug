import Sketch from 'react-p5';
import styled from 'styled-components';
import { basic, coefficients, colors, offset, speed } from './Dat';

const Container = styled.div`
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  width: 100vw;
  height: 100vh;
  /* transform: translate(-50%, -50%); */
`;

const LineWaveBackground = () => {
  const setup = (p: any, canvasParentRef: any) => {
    p.createCanvas(window.innerWidth, window.innerHeight).parent(canvasParentRef);

    p.frameRate(p.fr);
    // use parent to render canvas in this ref (without that p5 render this canvas outside your component)

    p.colorMode(p.RGBA);
  };

  const draw = (p: any) => {
    // p.clear();
    // p.background(0);
    p.background('rgb(20,21,24)');
    p.noFill();
    // p.noLoop();
    for (let line = 0; line < basic.lineNum; line++) {
      const time = performance.now() / (speed.speedFactor * 1000);
      // const coefficient = lineNum / 10 + line + 0;

      // rgb(20,21,24)
      // rgb(186,186,186)
      const { r, g, b } = colors;
      const a = line % 2 ? 0 : (Math.round(line / basic.lineNum) * colors.a * 30) / 20;
      // const a = colors.a;

      p.beginShape();
      p.stroke(r, g, b, a);
      //   p.stroke(h, s, b);

      for (let seg = 0; seg < basic.segmentNum; seg++) {
        const x = (seg / basic.segmentNum) * p.width * 2;

        const px = ((seg / coefficients.lineCoefficient) * line) / offset.pxFactor;
        const py = line / 200 + time * offset.pyFactor;
        const randomValue = p.noise(px, py);

        const y = randomValue * p.height;

        p.vertex(x, y + 70);
      }
      p.endShape();
    }
  };

  return (
    <Container>
      <Sketch setup={setup} draw={draw} />
    </Container>
  );
};

export default LineWaveBackground;
