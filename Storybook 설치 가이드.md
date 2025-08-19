# 📜 Storybook 설치 가이드

[🔗 Storybook 공식 가이드](https://storybook.js.org/docs/get-started/frameworks/nextjs)


## 🔥 터미널 설치 명령어 정리

```bash
# 새로 설치할 경우
npm create storybook@latest

# 기존에 Storybook이 설치된 경우
npx storybook@latest upgrade

# 마이그레이션에 실패한 경우
npm install --save-dev @storybook/nextjs
```

## 🔥 .storybook/main.ts 수정
staticDirs 속성 값 `..\\public`에서 `../public`으로 수정
```ts
import type { StorybookConfig } from '@storybook/nextjs-vite';

const config: StorybookConfig = {
  stories: ['../src/**/*.mdx', '../src/**/*.stories.@(js|jsx|mjs|ts|tsx)'],
  addons: [
    '@chromatic-com/storybook',
    '@storybook/addon-docs',
    '@storybook/addon-a11y',
    '@storybook/addon-vitest',
  ],
  framework: {
    name: '@storybook/nextjs-vite',
    options: {},
  },
  staticDirs: ['../public'], // '..\\public'을 '../public'으로 수정
};
export default config;

```

## 🔥 .storybook/preview.ts 수정

- tailwind 사용 시 globals.css 인식을 위해 상단에 import 구문 추가

```ts
import '../src/app/globals.css';
```
