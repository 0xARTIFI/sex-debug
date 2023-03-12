// import dat from "dat.gui";

class Basic {
  segmentNum: number;
  lineNum: number;
  constructor() {
    this.segmentNum = 107;
    this.lineNum = 172;
  }
}

class Color {
  r: number;
  g: number;
  b: number;
  a: number;
  constructor() {
    this.r = 255;
    this.g = 255;
    this.b = 255;
    this.a = 11;
  }
}

class Coefficient {
  lineCoefficient: number;
  constructor() {
    this.lineCoefficient = 299;
  }
}

class Speed {
  speedFactor: number;
  constructor() {
    this.speedFactor = 388;
  }
}

class Offset {
  pyFactor: number;
  pxFactor: number;
  constructor() {
    this.pyFactor = -16.8;
    this.pxFactor = -24.4;
  }
}

export const offset = new Offset();
export const basic = new Basic();
export const speed = new Speed();
export const coefficients = new Coefficient();
export const colors = new Color();

// 调节参数
// export const GUI = new dat.GUI();

// const renderGui = (p: any) => {
//   if (!p) return;

//   GUI.add(basic, "lineNum", 0, 500).onChange((v) => {
//     // p.stroke(colors.r, colors.g, colors.b, colors.a);
//   });

//   GUI.add(basic, "segmentNum", 0, 500).onChange((v) => {
//     // p.stroke(colors.r, colors.g, colors.b, colors.a);
//   });

//   GUI.add(colors, "r", 0, 255).onChange((v) => {
//     // p.stroke(colors.r, colors.g, colors.b, colors.a);
//   });

//   GUI.add(colors, "g", 0, 255).onChange(() => {
//     // p.stroke(colors.r, colors.g, colors.b, colors.a);
//   });

//   GUI.add(colors, "b", 0, 255).onChange(() => {
//     // p.stroke(colors.r, colors.g, colors.b, colors.a);
//   });

//   GUI.add(colors, "a", 0, 100).onChange(() => {
//     // p.stroke(colors.r, colors.g, colors.b, colors.a);
//   });

//   GUI.add(speed, "speedFactor", 0, 1000).onChange(() => {
//     // p.stroke(colors.r, colors.g, colors.b, colors.a);
//   });

//   // GUI.add(coefficients, "opacityCoefficient", 0, 20, 0.1).onChange(() => {
//   //   // p.stroke(colors.r, colors.g, colors.b, colors.a);
//   // });

//   GUI.add(coefficients, "lineCoefficient", 0, 1000).onChange(() => {
//     // p.stroke(colors.r, colors.g, colors.b, colors.a);
//   });

//   GUI.add(offset, "pyFactor", -50, 50, 0.2).onChange((v) => {
//     // p.stroke(colors.r, colors.g, colors.b, colors.a);
//   });

//   GUI.add(offset, "pxFactor", -50, 50, 0.2).onChange((v) => {
//     // p.stroke(colors.r, colors.g, colors.b, colors.a);
//   });

//   // pxFactor
// };

// export default renderGui;
