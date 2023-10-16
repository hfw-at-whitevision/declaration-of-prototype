import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.declarationofprototype.app',
  appName: 'declaration-of-prototype',
  webDir: 'out',
  server: {
    androidScheme: 'https'
  }
};

export default config;
