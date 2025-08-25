import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'io.ionic.starter',
  appName: 'GovtInvoiceNew',
  webDir: 'dist',
  server: {
    androidScheme: 'https'
  },
  plugins: {
    FirebaseAuthentication: {
      skipNativeAuth: false,
      providers: ["google.com"]
    },
    AdMob: {
      appId: 'ca-app-pub-6312756313711545~1844628732',
      // You should replace this with your actual app ID when in production
      initialize: true
    }
  }
};

export default config;
