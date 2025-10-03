declare module '*.svg' {
  import React from 'react';
  export const ReactComponent: React.FC<React.SVGProps<SVGSVGElement>>;
  const src: string;
  export default src;
}
// 이 선언을 통해 SVG 파일을 React 컴포넌트로 사용할 수 있음
// { ReactComponent as EyeOpenedIcon } 와 같이 임포트 가능 ( default import도 가능)
