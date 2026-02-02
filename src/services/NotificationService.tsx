class NotificationService {
  private permission: NotificationPermission = 'default';
  private registration: ServiceWorkerRegistration | null = null;

  async requestPermission(): Promise<boolean> {
    if (!('Notification' in window)) {
      console.warn('This browser does not support notifications');
      return false;
    }

    if (this.permission === 'granted') {
      return true;
    }

    if (this.permission === 'default') {
      this.permission = await Notification.requestPermission();
    }

    return this.permission === 'granted';
  }

  async registerServiceWorker(): Promise<void> {
    if ('serviceWorker' in navigator) {
      try {
        this.registration = await navigator.serviceWorker.register('/sw.js');
        console.log('Service Worker registered');
      } catch (error) {
        console.error('Service Worker registration failed:', error);
      }
    }
  }

  async showNotification(title: string, options: NotificationOptions = {}): Promise<void> {
    if (!await this.requestPermission()) {
      return;
    }

    const defaultOptions: NotificationOptions = {
      icon: '/vite.svg',
      badge: '/vite.svg',
      ...options
    };

    if (this.registration && this.registration.showNotification) {
      await this.registration.showNotification(title, defaultOptions);
    } else if ('Notification' in window && this.permission === 'granted') {
      new Notification(title, defaultOptions);
    }
  }

  async notifySevereWeather(location: string, condition: string, details: string): Promise<void> {
    await this.showNotification(
      `Severe Weather Alert: ${location}`,
      {
        body: `${condition}: ${details}`,
        icon: '/vite.svg',
        badge: '/vite.svg',
        tag: 'severe-weather',
        requireInteraction: true,
        vibrate: [200, 100, 200]
      }
    );
  }

  getPermissionStatus(): NotificationPermission {
    if ('Notification' in window) {
      return Notification.permission;
    }
    return 'denied';
  }
}

export const notificationService = new NotificationService();
