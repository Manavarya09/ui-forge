declare module 'gradient-string' {
  interface Options {
    hsvSaturation?: number;
    hsvValue?: number;
    decay?: number;
    direction?: 'horizontal' | 'vertical' | 'diagonal' | 'radial' | 'middle';
  }

  interface Gradient {
    (text: string): string;
  }

  function gradient(colors: string[], options?: Options): Gradient;

  export default gradient;
}

declare module 'gradient-string/gradient-string.js' {
  export default gradient;
}
