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
npm i @tanstack/react-query
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
  	"trailingComma": "all"
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

  ```jsx
  // eslint.config.mjs에 규칙 추가
  import { dirname } from 'path';
  import { fileURLToPath } from 'url';
  import { FlatCompat } from '@eslint/eslintrc';
  
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = dirname(__filename);
  
  const compat = new FlatCompat({
    baseDirectory: __dirname,
  });
  
  const eslintConfig = [
    ...compat.extends('next/core-web-vitals', 'next/typescript'),
    {
      rules: {
        'no-unused-vars': 'off', // JS용 기본 비활성화
        '@typescript-eslint/no-unused-vars': [
          'error',
          { argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
        ],
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
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  }
  
  ```
  
</details>

---

### ✨ React Component(SVGR) 설정

<details>
  <summary><h4>next.config.ts 파일 수정</h4></summary>

  ```tsx
  // next.config.ts
  import type { NextConfig } from 'next';
  import type { Configuration as WebpackConfig } from 'webpack';
  
  const nextConfig: NextConfig = {
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

  (tailwind v4 ~) tailwind.config.ts 사용할 경우 globals.css 파일 최상단에 아래 구문 추가

  ```css
  //globals.css
  @config '../../tailwind.config.ts';
  ```
</details>

---

### ✨ React Query 설정

<details>
  <summary><h4>provider 생성</h4></summary>

  RootLayout에서는 QueryClientProvider 삽입 및 useState 선언이 불가하므로 provider를 따로 만들어서 RootLayout에 주입
  참고자료: https://tanstack.com/query/latest/docs/framework/react/guides/advanced-ssr

  `/app/Providers.tsx`
  ```tsx
  'use client';
  import { getQueryClient } from '@/lib/queryClient';
  import { QueryClientProvider } from '@tanstack/react-query';
  import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
  
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
      <html lang="en">
        <body>
          <Providers>{children}</Providers> // 여기에 주입
        </body>
      </html>
    );
  }


  ```
</details>

---
