import { AdMob, BannerAdOptions, BannerAdPosition, BannerAdSize, AdMobInitializationOptions } from '@capacitor-community/admob';
import { Capacitor } from '@capacitor/core';

class AdMobService {
  private initialized = false;
  private webPlaceholderVisible = false;

  /**
   * Check if running on native device
   */
  isNative(): boolean {
    return Capacitor.isNativePlatform();
  }

  /**
   * Check if web placeholder should be visible
   */
  isWebPlaceholderVisible(): boolean {
    return !this.isNative() && this.webPlaceholderVisible;
  }

  /**
   * Initialize AdMob
   */
  async initialize(): Promise<void> {
    if (this.initialized) {
      return;
    }

    if (!this.isNative()) {
      console.log('Not running on native platform, using web placeholder instead');
      this.initialized = true;
      return;
    }

    try {
      console.log('Starting AdMob initialization...');
      const options: AdMobInitializationOptions = {
        testingDevices: ['EMULATOR'],
        initializeForTesting: true // Set to false in production
      };
      
      await AdMob.initialize(options);
      this.initialized = true;
      console.log('AdMob initialized successfully');
    } catch (error) {
      console.error('AdMob initialization error:', error);
    }
  }

  /**
   * Show banner ad
   */
  async showBanner(): Promise<void> {
    if (!this.isNative()) {
      console.log('Not running on native platform, showing web placeholder');
      this.webPlaceholderVisible = true;
      return;
    }

    if (!this.initialized) {
      console.log('AdMob not initialized, initializing now...');
      await this.initialize();
    }

    const options: BannerAdOptions = {
      adId: 'ca-app-pub-3940256099942544/6300978111', // Google test ad unit ID for banner
      adSize: BannerAdSize.BANNER,
      position: BannerAdPosition.BOTTOM_CENTER,
      margin: 0,
      isTesting: true // Set to false in production
    };

    try {
      console.log('Attempting to show banner ad with options:', options);
      await AdMob.showBanner(options);
      console.log('Banner ad shown successfully');
    } catch (error) {
      console.error('Error showing banner ad:', error);
    }
  }

  /**
   * Hide banner ad
   */
  async hideBanner(): Promise<void> {
    if (!this.isNative()) {
      this.webPlaceholderVisible = false;
      return;
    }

    try {
      await AdMob.hideBanner();
      console.log('Banner ad hidden successfully');
    } catch (error) {
      console.error('Error hiding banner ad:', error);
    }
  }

  /**
   * Remove banner ad
   */
  async removeBanner(): Promise<void> {
    if (!this.isNative()) {
      this.webPlaceholderVisible = false;
      return;
    }

    try {
      await AdMob.removeBanner();
      console.log('Banner ad removed successfully');
    } catch (error) {
      console.error('Error removing banner ad:', error);
    }
  }

  /**
   * Resume banner ad (after being hidden)
   */
  async resumeBanner(): Promise<void> {
    if (!this.isNative()) {
      this.webPlaceholderVisible = true;
      return;
    }

    try {
      await AdMob.resumeBanner();
      console.log('Banner ad resumed successfully');
    } catch (error) {
      console.error('Error resuming banner ad:', error);
    }
  }
}

export const admobService = new AdMobService();
