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
  ...storybook.configs['flat/recommended'],
];

export default eslintConfig;
