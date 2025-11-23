// Price alert and notification management service

export interface PriceAlert {
  id: string;
  tokenSymbol: string;
  condition: 'above' | 'below';
  targetPrice: number;
  currentPrice: number;
  isActive: boolean;
  createdAt: number;
  triggeredAt?: number;
}

export interface PortfolioAlert {
  id: string;
  type: 'portfolio_value' | 'token_balance' | 'gas_threshold';
  condition: 'above' | 'below';
  threshold: number;
  currentValue: number;
  isActive: boolean;
  createdAt: number;
  triggeredAt?: number;
  message: string;
}

const PRICE_ALERTS_KEY = 'basevault_price_alerts';
const PORTFOLIO_ALERTS_KEY = 'basevault_portfolio_alerts';
const NOTIFICATION_PERMISSION_KEY = 'basevault_notification_permission';

export class AlertService {
  // Check if notifications are supported and permitted
  static async requestNotificationPermission(): Promise<boolean> {
    if (!('Notification' in window)) {
      console.warn('This browser does not support notifications');
      return false;
    }

    if (Notification.permission === 'granted') {
      localStorage.setItem(NOTIFICATION_PERMISSION_KEY, 'granted');
      return true;
    }

    if (Notification.permission !== 'denied') {
      const permission = await Notification.requestPermission();
      localStorage.setItem(NOTIFICATION_PERMISSION_KEY, permission);
      return permission === 'granted';
    }

    return false;
  }

  static hasNotificationPermission(): boolean {
    return Notification.permission === 'granted';
  }

  // Send browser notification
  static sendNotification(title: string, body: string, icon?: string) {
    if (!this.hasNotificationPermission()) {
      return;
    }

    new Notification(title, {
      body,
      icon: icon || '/favicon.ico',
      badge: '/favicon.ico',
      tag: 'basevault-alert',
      requireInteraction: true,
    });
  }

  // Price Alerts
  static getPriceAlerts(): PriceAlert[] {
    const stored = localStorage.getItem(PRICE_ALERTS_KEY);
    return stored ? JSON.parse(stored) : [];
  }

  static addPriceAlert(
    tokenSymbol: string,
    condition: 'above' | 'below',
    targetPrice: number,
    currentPrice: number
  ): PriceAlert {
    const alerts = this.getPriceAlerts();
    
    const newAlert: PriceAlert = {
      id: `alert_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      tokenSymbol,
      condition,
      targetPrice,
      currentPrice,
      isActive: true,
      createdAt: Date.now(),
    };

    alerts.push(newAlert);
    localStorage.setItem(PRICE_ALERTS_KEY, JSON.stringify(alerts));
    return newAlert;
  }

  static removePriceAlert(alertId: string) {
    const alerts = this.getPriceAlerts();
    const filtered = alerts.filter(a => a.id !== alertId);
    localStorage.setItem(PRICE_ALERTS_KEY, JSON.stringify(filtered));
  }

  static checkPriceAlerts(tokenSymbol: string, currentPrice: number) {
    const alerts = this.getPriceAlerts();
    const triggered: PriceAlert[] = [];

    alerts.forEach(alert => {
      if (!alert.isActive || alert.tokenSymbol !== tokenSymbol) {
        return;
      }

      const shouldTrigger =
        (alert.condition === 'above' && currentPrice >= alert.targetPrice) ||
        (alert.condition === 'below' && currentPrice <= alert.targetPrice);

      if (shouldTrigger) {
        alert.triggeredAt = Date.now();
        alert.isActive = false;
        triggered.push(alert);

        // Send notification
        this.sendNotification(
          `Price Alert: ${tokenSymbol}`,
          `${tokenSymbol} is now ${alert.condition} $${alert.targetPrice.toFixed(2)}. Current price: $${currentPrice.toFixed(2)}`
        );
      }
    });

    if (triggered.length > 0) {
      localStorage.setItem(PRICE_ALERTS_KEY, JSON.stringify(alerts));
    }

    return triggered;
  }

  // Portfolio Alerts
  static getPortfolioAlerts(): PortfolioAlert[] {
    const stored = localStorage.getItem(PORTFOLIO_ALERTS_KEY);
    return stored ? JSON.parse(stored) : [];
  }

  static addPortfolioAlert(
    type: PortfolioAlert['type'],
    condition: 'above' | 'below',
    threshold: number,
    currentValue: number,
    message: string
  ): PortfolioAlert {
    const alerts = this.getPortfolioAlerts();
    
    const newAlert: PortfolioAlert = {
      id: `portfolio_alert_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      type,
      condition,
      threshold,
      currentValue,
      isActive: true,
      createdAt: Date.now(),
      message,
    };

    alerts.push(newAlert);
    localStorage.setItem(PORTFOLIO_ALERTS_KEY, JSON.stringify(alerts));
    return newAlert;
  }

  static removePortfolioAlert(alertId: string) {
    const alerts = this.getPortfolioAlerts();
    const filtered = alerts.filter(a => a.id !== alertId);
    localStorage.setItem(PORTFOLIO_ALERTS_KEY, JSON.stringify(filtered));
  }

  static checkPortfolioAlert(
    type: PortfolioAlert['type'],
    currentValue: number
  ): PortfolioAlert[] {
    const alerts = this.getPortfolioAlerts();
    const triggered: PortfolioAlert[] = [];

    alerts.forEach(alert => {
      if (!alert.isActive || alert.type !== type) {
        return;
      }

      const shouldTrigger =
        (alert.condition === 'above' && currentValue >= alert.threshold) ||
        (alert.condition === 'below' && currentValue <= alert.threshold);

      if (shouldTrigger) {
        alert.triggeredAt = Date.now();
        alert.isActive = false;
        alert.currentValue = currentValue;
        triggered.push(alert);

        // Send notification
        this.sendNotification(
          'Portfolio Alert',
          alert.message
        );
      }
    });

    if (triggered.length > 0) {
      localStorage.setItem(PORTFOLIO_ALERTS_KEY, JSON.stringify(alerts));
    }

    return triggered;
  }

  // Clear all alerts
  static clearAllAlerts() {
    localStorage.removeItem(PRICE_ALERTS_KEY);
    localStorage.removeItem(PORTFOLIO_ALERTS_KEY);
  }

  // Get active alert count
  static getActiveAlertCount(): number {
    const priceAlerts = this.getPriceAlerts().filter(a => a.isActive);
    const portfolioAlerts = this.getPortfolioAlerts().filter(a => a.isActive);
    return priceAlerts.length + portfolioAlerts.length;
  }
}
