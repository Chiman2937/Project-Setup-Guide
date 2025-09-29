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
- staticDirs 속성 값 `..\\public`에서 `../public`으로 수정
- framework `nextjs-vite`에서 `nextjs`로 변경
- React Components 설정 추가
```ts
import type { StorybookConfig } from '@storybook/nextjs';
import type { RuleSetRule } from 'webpack';

const config: StorybookConfig = {
  stories: ['../src/**/*.mdx', '../src/**/*.stories.@(js|jsx|mjs|ts|tsx)'],
  addons: ['@chromatic-com/storybook', '@storybook/addon-docs', '@storybook/addon-a11y'],
  framework: {
    name: '@storybook/nextjs',
    options: {},
  },
  staticDirs: ['../public'],

  webpackFinal: async (config) => {
    // 기존 SVG 파일 로더 규칙 찾기
    const imageRule = config.module?.rules?.find((rule) => {
      const ruleSetRule = rule as RuleSetRule;
      if (ruleSetRule.test instanceof RegExp) {
        return ruleSetRule.test.test('.svg');
      }
      return false;
    }) as RuleSetRule;

    if (imageRule) {
      imageRule.exclude = /\.svg$/;
    }

    // SVG를 React 컴포넌트로 처리하는 규칙 추가
    config.module?.rules?.push({
      test: /\.svg$/,
      use: ['@svgr/webpack'],
    });

    return config;
  },
};

export default config;

```

## 🔥 .storybook/preview.ts 수정

- tailwind 사용 시 globals.css 인식을 위해 상단에 import 구문 추가

```ts
import '../src/app/globals.css';
```

## 🔥 postcss.config.mjs 수정

plugins 속성을 배열에서 객체 형태로 수정

```ts
const config = {
  plugins: {
    '@tailwindcss/postcss': {},
  },
};

export default config;
```
