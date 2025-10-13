# 📜 MSW 설치 가이드(Next.js)

## 🔥 터미널 설치 명령어 정리

```bash
# 패키지 설치
npm i -D msw

# public 폴더에 service worker 생성
npx msw init public/ --save
```

## 🔥 파일 추가(`src/mock`)
`src/mock`에 파일 3종 추가

<details>
  <summary><h4>broswer.ts</h4></summary>
`src/mock/broswer.ts`
  
```ts
import { setupWorker } from 'msw/browser';

import { handlers } from './handlers';

export const worker = setupWorker(...handlers);

// worker.events.on('request:start', ({ request }) => {
//   console.log('MSW Client intercepted:', request.method, request.url);
// });

// worker.events.on('request:match', ({ request }) => {
//   console.log('MSW matched:', request.method, request.url);
// });

// worker.events.on('request:unhandled', ({ request }) => {
//   console.log('MSW Client unhandled:', request.method, request.url);
// });

```
  
</details>

<details>
  <summary><h4>server.ts</h4></summary>

  `src/mock/server.ts`
  
```ts
import { setupServer } from 'msw/node';

import { handlers } from './handlers';

export const server = setupServer(...handlers);

server.events.on('request:start', ({ request }) => {
  console.log('MSW intercepted:', request.method, request.url);
});

// server.events.on('request:match', ({ request }) => {
//   console.log('MSW matched:', request.method, request.url);
// });

// server.events.on('request:unhandled', ({ request }) => {
//   console.log('MSW Server unhandled:', request.method, request.url);
// });

```
  
</details>

<details>
  <summary><h4>handlers.ts</h4></summary>

`src/mock/handlers.ts`

```ts
export const handlers = [];
```
  
</details>

## 🔥 파일 추가(`src/providers`)

<details>
  <summary><h4>MSWProvider.tsx</h4></summary>

```tsx
'use client';

import { useEffect } from 'react';

const config = {
  enabledInDevelopment: true,
  enabledInProduction: false,
  serviceWorkerUrl: '/mockServiceWorker.js',
  onUnhandledRequest: 'bypass' as const,
};

interface Props {
  children: React.ReactNode;
}

export function MSWProvider({ children }: Props) {
  useEffect(() => {
    async function initMSW() {
      // MSW 활성화 여부 확인
      const isDev = process.env.NODE_ENV === 'development';
      const shouldEnable = isDev ? config.enabledInDevelopment : config.enabledInProduction;

      if (shouldEnable) {
        try {
          const { worker } = await import('@/mock/browser');
          await worker.start({
            onUnhandledRequest: config.onUnhandledRequest,
            serviceWorker: { url: config.serviceWorkerUrl },
          });

          console.log('🔷 MSW Client ready');
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Unknown error';
          console.warn('⚠️  MSW Client setup failed:', errorMessage);
        }
      }
    }

    initMSW();
  }, []);

  return children;
}

// 서버 MSW 자동 초기화
if (typeof window === 'undefined') {
  (async () => {
    try {
      // MSW 활성화 여부 확인
      const isDev = process.env.NODE_ENV === 'development';
      const shouldEnable = isDev ? config.enabledInDevelopment : config.enabledInProduction;

      if (shouldEnable) {
        const { server } = await import('@/mock/server');
        server.listen({ onUnhandledRequest: config.onUnhandledRequest });
        console.log('🔶 MSW Server ready');
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      console.warn('⚠️  MSW Server setup failed:', errorMessage);
    }
  })();
}

```
</details>
