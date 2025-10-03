# 📜 Next.js 프로젝트 세팅 가이드

- Next.js 프로젝트 생성
- prettier, eslint, husky/lintStaged(pre-commit rule) 설정
- React Query 초기설정
- React Components 초기설정

<br></br>

## 🔥 터미널 설치 명령어 정리

```Bash
# next.js 프로젝트 생성
npx create-next-app@latest
# 이후 프로젝트 폴더로 이동

# eslint, prettier 관련
npm install -D @typescript-eslint/eslint-plugin
npm install -D @typescript-eslint/parser
npm install -D eslint-config-prettier
npm install -D prettier

# TailwindCss prettier 플러그인 설치
npm install -D prettier-plugin-tailwindcss

# import 구문 정렬 eslint 규칙 설치
npm install -D eslint-plugin-simple-import-sort

# husky, lint-staged 설치
npm install -D husky lint-staged

# .husky directory 생성
npx husky init

# package.json에 prepare 스크립트 등록
npm pkg set scripts.prepare="husky"

# .husky 폴더 생성 및 Git hook 연결
npm run prepare

# React Component 사용을 위한 svgr webpack 설치
npm install -D @svgr/webpack
npm install -D @types/webpack
---

# 서버 상태 관리를 위한 React Query 설치
# React Query
npm install @tanstack/react-query
# React Query Dev tool
npm install @tanstack/react-query-devtools
```

<br></br>

## 🔥 수동 설정

---

### ✨ Husky/LintStaged 설정

<details>
  <summary><h4>husky pre-commit 파일 생성</h4></summary>
  
  ```jsx
  // .husky/pre-commit 파일 생성
  #!/bin/sh
  npx lint-staged
  ```
</details>

<details>
  <summary><h4>package.json 파일 수정</h4></summary>

  ```json
  // package.json에 아래 내용 추가
  // pre-commit 시 eslint, prettier를 실행
    "lint-staged": {
      "**/*.{js,jsx,ts,tsx}": [
        "eslint --fix",
        "prettier --write"
      ],
      "**/*.{json,css,scss,md,yml,yaml}": [
        "prettier --write"
      ]
    },
  ```
  
</details>

---

### ✨ Prettier, eslint 설정

<details>
  <summary><h4>.prettierrc 파일 추가</h4></summary>

  ```json
  // 프로젝트 최상단 경로에 .prettierrc 파일 생성
  
  {
    "tabWidth": 2,
    "semi": true,
    "singleQuote": true,
    "jsxSingleQuote": true,
    "printWidth": 100,
  	"bracketSpacing": true,
  	"arrowParens": "always",
  	"proseWrap": "preserve",
  	"trailingComma": "all",
    "plugins": ["prettier-plugin-tailwindcss"],
    "tailwindFunctions": ["clsx", "cn", "classNames", "tw"]
  }
  ```
  
</details>

<details>
  <summary><h4>.prettierignore 파일 추가</h4></summary>

  ```bash
  # 프로젝트 최상단 경로에 .prettierignore 파일 생성
  
  # 빌드 결과물
  dist
  build
  coverage
  
  # 패키지 관리
  node_modules
  package-lock.json
  yarn.lock
  pnpm-lock.yaml
  
  # 설정 파일
  *.log
  
  # 정적 파일
  public
  
  # 환경 파일
  .env
  .env.*
  
  # 기타 무시할 항목
  *.min.js
  *.snap
  ```

</details>

<details>
  <summary><h4>eslint.config.mjs 파일 수정</h4></summary>
  - 2025.10.13: import 정렬 구문 추가
  
  ```jsx
  // eslint.config.mjs에 규칙 추가
  import { FlatCompat } from '@eslint/eslintrc';
  import simpleImportSort from 'eslint-plugin-simple-import-sort';
  import storybook from 'eslint-plugin-storybook';
  import { dirname } from 'path';
  import { fileURLToPath } from 'url';
  
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = dirname(__filename);
  
  const compat = new FlatCompat({
    baseDirectory: __dirname,
  });
  
  const eslintConfig = [
    ...compat.extends('next/core-web-vitals', 'next/typescript'),
    {
      plugins: {
        'simple-import-sort': simpleImportSort,
      },
      rules: {
        'no-unused-vars': 'off', // JS용 기본 비활성화
        'simple-import-sort/imports': [
          'error',
          {
            groups: [
              // CSS imports
              ['\\.css$'],
              // Next.js (일반 import)
              ['^next(?!.*type)'],
              // Next.js (type import)
              ['^next.*\\u0000$'],
              // React (일반 import)
              ['^react(?!.*type)'],
              // React (type import)
              ['^react.*\\u0000$'],
              // 서드파티 (외부 라이브러리)
              ['^@?\\w'],
              // 로컬 파일 (@/ 경로)
              ['^@/'],
              // 상대 경로
              ['^\\.'],
            ],
          },
        ],
        '@typescript-eslint/no-unused-vars': [
          'error',
          { argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
        ],
        'simple-import-sort/exports': 'error',
      },
    },
  ];
  
  export default eslintConfig;
  
  ```
  
</details>

<details>
  <summary><h4>.vscode/settings.json 파일 추가</h4></summary>

  ```json
  // 프로젝트 최상단 경로에 .vscode/settings.json 파일 추가
  {
    "editor.formatOnSave": true,
    "editor.defaultFormatter": "esbenp.prettier-vscode",
    "editor.codeActionsOnSave": {
      "source.fixAll.eslint": "explicit"
    }
  }
  
  ```
  
</details>

---

### ✨ React Component(SVGR) 설정

<details>
  <summary><h4>next.config 파일 수정</h4></summary>

  `next.config.ts`와 `next.config.js` 중 택1
  ```ts
  // next.config.ts
  import type { NextConfig } from 'next';
  import type { Configuration as WebpackConfig } from 'webpack';
  
  const nextConfig: NextConfig = {
    images: {
      //이미지 경로는 사양에 맞게 수정하여 적용
      remotePatterns: [
        {
          protocol: 'https',
          hostname: 'sprint-fe-project.s3.ap-northeast-2.amazonaws.com',
          port: '',
          pathname: '/**',
        },
      ],
      //imagesSizes, deviceSizes는 기본 설정
      imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
      deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    },
    webpack(config: WebpackConfig) {
      config.module?.rules?.push({
        test: /\.svg$/,
        use: ['@svgr/webpack'],
      });
  
      return config;
    },
  };
  
  export default nextConfig;

  ```
  ```js
  // next.config.js
  const nextConfig = {
    images: {
      //이미지 경로는 사양에 맞게 수정하여 적용
      remotePatterns: [
        {
          protocol: 'https',
          hostname: 'sprint-fe-project.s3.ap-northeast-2.amazonaws.com',
          port: '',
          pathname: '/**',
        },
      ],
      //imagesSizes, deviceSizes는 기본 설정
      imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
      deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    },
    webpack(config) {
      config.module?.rules?.push({
        test: /\.svg$/,
        use: ['@svgr/webpack'],
      });
  
      return config;
    },
  };
  
  export default nextConfig;

  ```
</details>

<details>
  <summary><h4>svg.d.ts 파일 추가</h4></summary>

  ```tsx
  // 프로젝트 최상단 경로에 svg.d.ts 파일 생성
  declare module '*.svg' {
    import React from 'react';
    export const ReactComponent: React.FC<React.SVGProps<SVGSVGElement>>;
    const src: string;
    export default src;
  }
  // 이 선언을 통해 SVG 파일을 React 컴포넌트로 사용할 수 있음
  // { ReactComponent as EyeOpenedIcon } 와 같이 임포트 가능 ( default import도 가능)
  ```

</details>

---

### ✨ tailwind css 설정

<details>
  <summary><h4>globals.css 설정</h4></summary>

  (tailwind v4 ~) tailwind.config.ts 사용할 경우 globals.css 파일 상단에 config import 구문 추가

  ```css
  //globals.css
  @import 'tailwindcss';
  @config '../../tailwind.config.ts'; // 이부분
  
  :root {
    --background: #ffffff;
    --foreground: #171717;
  }
  
  @theme inline {
    --color-background: var(--background);
    --color-foreground: var(--foreground);
    --font-sans: var(--font-geist-sans);
    --font-mono: var(--font-geist-mono);
  }
  
  @media (prefers-color-scheme: dark) {
    :root {
      --background: #0a0a0a;
      --foreground: #ededed;
    }
  }
  
  body {
    background: var(--background);
    color: var(--foreground);
    font-family: Arial, Helvetica, sans-serif;
  }
  ```
</details>

<details>
  <summary><h4>tailwind.config.ts 파일 추가</h4></summary>
  - 예시 템플릿 파일

  `/tailwind.config.ts`
  ```ts
  import { type Config } from 'tailwindcss';
  
  const config: Config = {
    content: ['./src/**/*.{js,ts,jsx,tsx}', './src/**/*.svg', './styles//*.{css,scss}'],
    theme: {
      extend: {
        colors: {
          white: '#ffffff',
          black: '#000000',
          'primary': {
            100: '#fffcf2',
            200: '#ffe59e',
          },
        fontFamily: {
          primary: ['var(--font-primary)'],
        },
  
        fontSize: {
          h1: ['32px', { lineHeight: '39px', fontWeight: 'normal' }],
        },
      },
    },
    plugins: [],
  };
  
  export default config;

  ```
  
</details>

---

### ✨ React Query 설정

<details>
  <summary><h4>QueryProvider.tsx 생성</h4></summary>

  RootLayout에서는 QueryClientProvider 삽입 및 useState 선언이 불가하므로 provider를 따로 만들어서 RootLayout에 주입
  > 참고자료: https://tanstack.com/query/latest/docs/framework/react/guides/advanced-ssr

  `src/providers/QueryProvider.tsx`
  ```tsx
  'use client';
  import { QueryClientProvider } from '@tanstack/react-query';
  import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
  
  import { getQueryClient } from '@/lib/queryClient';
  
  interface Props {
    children: React.ReactNode;
  }
  
  export const QueryProvider = ({ children }: Props) => {
    const queryClient = getQueryClient();
  
    return (
      <QueryClientProvider client={queryClient}>
        {children}
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
    );
  };
  ```
</details>

<details>
  <summary><h4>Providers.tsx 생성</h4></summary>


`src/app/Providers.tsx`
```tsx
'use client';
import { QueryProvider } from '@/providers/QueryProvider';

interface Props {
  children: React.ReactNode;
}

export const Providers = ({ children }: Props) => {
  return <QueryProvider>{children}</QueryProvider>;
};

```

</details>

<details>
  <summary><h4>RootLayout 설정</h4></summary>

  (tailwind v4 ~) tailwind.config.ts 사용할 경우 globals.css 파일 최상단에 아래 구문 추가

  `/app/layout.tsx`
  ```css
  //layout.tsx
  import { Providers } from './providers';
  ...

  export default function RootLayout({
    children,
  }: Readonly<{
    children: React.ReactNode;
  }>) {
    return (
      <html lang="ko">
        <body>
          <Providers>{children}</Providers> // 여기에 주입
        </body>
      </html>
    );
  }
  ```
</details>

---
### ✨ Font 설정

<details>
  <summary><h4>font.ts 생성</h4></summary>

- 폰트 저장: `src/assets/fonts/`

`src/app/font.ts` - variable font일 경우
```ts
export const primary = localFont({
  src: '../assets/fonts/PretendardVariable.woff2',
  variable: '--font-pretendard',
  display: 'swap',
});
```

`src/app/font.ts` - static font일 경우
```ts
import localFont from 'next/font/local';

export const primary = localFont({
  src: [
    {
      path: '../assets/fonts/Pretendard-Thin.subset.woff2',
      weight: '100',
    },
    {
      path: '../assets/fonts/Pretendard-ExtraLight.subset.woff2',
      weight: '200',
    },
    {
      path: '../assets/fonts/Pretendard-Light.subset.woff2',
      weight: '300',
    },
    {
      path: '../assets/fonts/Pretendard-Regular.subset.woff2',
      weight: '400',
    },
    {
      path: '../assets/fonts/Pretendard-Medium.subset.woff2',
      weight: '500',
    },
    {
      path: '../assets/fonts/Pretendard-SemiBold.subset.woff2',
      weight: '600',
    },
    {
      path: '../assets/fonts/Pretendard-Bold.subset.woff2',
      weight: '700',
    },
    {
      path: '../assets/fonts/Pretendard-ExtraBold.subset.woff2',
      weight: '800',
    },
    {
      path: '../assets/fonts/Pretendard-Black.subset.woff2',
      weight: '900',
    },
  ],
  variable: '--font-pretendard',
  display: 'swap',
});

```

</details>

<details>
  <summary><h4>RootLayout 수정</h4></summary>

  primary font를 body className에 지정
  - className: 해당 폰트를 요소에 직접 적용 (즉시 사용)
  - variable: CSS 변수만 생성 (필요할 때 선택적으로 사용)
```tsx
  ...
  <body
    className={`${primary.className} ${geistSans.variable} ${geistMono.variable} antialiased`}
  >
  ...
```
  
</details>

<details>
  <summary><h4>tailwind config 수정</h4></summary>
  
  ```ts
  fontFamily: {
    primary: ['var(--font-primary)'],
  },
  ```

</details>
