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

# Component/element 속성 정렬 eslint 규칙 설치
npm install -D eslint-plugin-perfectionist

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
  
  - 2025.10.03: import 정렬 구문 추가
  - 2025.10.05: JSX 정렬 구문 추가
  - 2025.11.12: 함수 선언문 금지 구문 추가(함수 표현식만 허용)
  - 2025.11.12: 삼항 연산자 중첩 사용 금지 구문 추가

  ```jsx
  // For more info, see https://github.com/storybookjs/eslint-plugin-storybook#configuration-flat-config-format
  // eslint.config.mjs에 규칙 추가
  import { defineConfig, globalIgnores } from 'eslint/config';
  import nextVitals from 'eslint-config-next/core-web-vitals';
  import nextTs from 'eslint-config-next/typescript';
  import perfectionist from 'eslint-plugin-perfectionist';
  import simpleImportSort from 'eslint-plugin-simple-import-sort';
  import storybook from 'eslint-plugin-storybook';
  
  const eslintConfig = defineConfig([
    ...nextVitals,
    ...nextTs,
    // Override default ignores of eslint-config-next.
    globalIgnores([
      // Default ignores of eslint-config-next:
      '.next/**',
      'out/**',
      'build/**',
      'next-env.d.ts',
    ]),
    {
      plugins: {
        'simple-import-sort': simpleImportSort,
        perfectionist: perfectionist,
      },
      rules: {
        /**
         * 함수 선언 규칙
         * - 함수 선언문(function foo(){}) 사용 금지
         * - 화살표 함수(const foo = () => {}) 사용 필수
         *
         * 이유: 일관성 있는 코드 스타일 유지
         */
        'func-style': [
          'error',
          'expression',
          {
            allowArrowFunctions: true,
          },
        ],
        /**
         * 삼항 연산자 사용 규칙
         * - 삼항 연산자 중첩 완전 금지
         *
         * 이유: 코드 가독성 확보
         */
        'no-nested-ternary': 'error',
        /**
         * 사용되지 않는 변수 규칙
         * - 변수명이 언더스코어(_)로 시작하면 미사용 허용
         * - 예: const _unusedVar = 1; ✅
         * - 예: const unusedVar = 1; ❌
         *
         * 이유:
         * - API 응답이나 배열 구조분해에서 일부 값만 필요할 때 명시적 표현
         * - 예: const [first, _second, third] = array;
         * - 예: const { data, _meta } = response;
         */
        // JS용 기본 규칙 비활성화 (TS 규칙 사용)
        'no-unused-vars': 'off',
        '@typescript-eslint/no-unused-vars': [
          'error',
          { argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
        ],
        // export 정렬
        'simple-import-sort/exports': 'warn',
        // import 정렬
        'simple-import-sort/imports': [
          'warn',
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
        // JSX 속성 정렬
        'perfectionist/sort-jsx-props': [
          'warn',
          {
            type: 'alphabetical',
            order: 'asc',
            groups: ['key', 'ref', 'id', 'className', 'style', 'unknown', 'callback'],
            customGroups: {
              key: 'key',
              ref: 'ref',
              id: 'id',
              className: 'className',
              style: 'style',
              callback: '^on[A-Z].*',
            },
          },
        ],
      },
    },
    ...storybook.configs['flat/recommended'],
  ]);
  
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
  - 2025.11.12: turbopack 세팅 추가
  
  ```ts
  // next.config.ts
  import type { NextConfig } from 'next';
  
  import type { Configuration as WebpackConfig } from 'webpack';
  
  const nextConfig: NextConfig = {
    reactCompiler: true,
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
    turbopack: {
      rules: {
        '*.svg': {
          loaders: [
            {
              loader: '@svgr/webpack',
              options: {
                icon: true,
                svgoConfig: {
                  plugins: [
                    {
                      name: 'preset-default',
                      params: {
                        overrides: {
                          removeViewBox: false, // viewBox 유지
                        },
                      },
                    },
                    'removeDimensions', // width, height 제거
                  ],
                },
              },
            },
          ],
          as: '*.js',
        },
      },
    },
    // Webpack 설정
    webpack(config: WebpackConfig) {
      config.module?.rules?.push({
        test: /\.svg$/,
        use: [
          {
            loader: '@svgr/webpack',
            options: {
              icon: true,
              svgoConfig: {
                plugins: [
                  {
                    name: 'preset-default',
                    params: {
                      overrides: {
                        removeViewBox: false,
                      },
                    },
                  },
                  'removeDimensions',
                ],
              },
            },
          },
        ],
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

  `src/lib/queryClient.ts`
  ```ts
  import { isServer, QueryClient } from '@tanstack/react-query';
  
  const makeQueryClient = () => {
    return new QueryClient({
      defaultOptions: {
        queries: {
          staleTime: 60 * 1000,
        },
      },
    });
  };
  
  let browserQueryClient: QueryClient | undefined = undefined;
  
  export const getQueryClient = () => {
    if (isServer) {
      return makeQueryClient();
    } else {
      if (!browserQueryClient) browserQueryClient = makeQueryClient();
      return browserQueryClient;
    }
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
- 2025.11.12: src 내부에 variable weight 추가

```ts
export const pretendard = localFont({
  src: [{ path: '../assets/fonts/PretendardVariable.woff2', weight: '45 920' }],
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
  - variable: CSS 변수만 생성 (tailwind 유틸리티 변수 사용을 위해 추가 필요)
```tsx
  ...
  <body
    className={`${primary.className} ${primary.variable} antialiased`}
  >
  ...
```
  
</details>
