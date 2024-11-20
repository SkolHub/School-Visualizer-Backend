import * as apn from 'apn';

export class ApnsService {
  private apnProvider: apn.Provider;

  constructor() {
    this.apnProvider = new apn.Provider({
      token: {
        key: 'path/to/key.p8',
        keyId: 'YOUR_KEY_ID',
        teamId: 'YOUR_TEAM_ID'
      },
      production: false
    });
  }

  async sendNotification(deviceToken: string, alert: string) {
    const notification = new apn.Notification();
    notification.alert = alert;
    notification.topic = 'com.yourapp.bundleId';

    try {
      const result = await this.apnProvider.send(notification, deviceToken);
      console.log('Notification sent:', result);
    } catch (error) {
      console.error('Error sending notification:', error);
    }
  }
}
