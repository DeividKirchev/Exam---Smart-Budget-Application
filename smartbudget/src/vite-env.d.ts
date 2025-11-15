/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_APP_NAME: string;
  readonly VITE_APP_VERSION: string;
  readonly VITE_APP_DESCRIPTION: string;
  readonly VITE_APP_ENV: 'development' | 'production';
  // Future variables will be added here
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
