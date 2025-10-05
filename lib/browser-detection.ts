/**
 * アプリ内ブラウザを検出するユーティリティ関数
 */

export interface BrowserInfo {
  isInAppBrowser: boolean;
  appName?: string;
  userAgent: string;
}

/**
 * アプリ内ブラウザかどうかを判定する
 */
export function detectInAppBrowser(): BrowserInfo {
  if (typeof window === 'undefined') {
    return {
      isInAppBrowser: false,
      userAgent: ''
    };
  }

  const userAgent = window.navigator.userAgent;
  
  // アプリ内ブラウザの判定
  const inAppPatterns = [
    { name: 'LINE', pattern: /Line\//i },
    { name: 'Instagram', pattern: /Instagram/i },
    { name: 'Facebook', pattern: /FBAN|FBAV/i },
    { name: 'Twitter', pattern: /TwitterAndroid|Twitter for iPhone/i },
    { name: 'TikTok', pattern: /TikTok/i },
    { name: 'WeChat', pattern: /MicroMessenger/i },
    { name: 'WhatsApp', pattern: /WhatsApp/i },
    { name: 'Telegram', pattern: /Telegram/i },
    { name: 'Discord', pattern: /Discord/i },
    { name: 'Slack', pattern: /Slack/i },
    { name: 'LinkedIn', pattern: /LinkedInApp/i },
    { name: 'Pinterest', pattern: /Pinterest/i },
    { name: 'Snapchat', pattern: /Snapchat/i },
    { name: 'YouTube', pattern: /YouTube/i },
    { name: 'Amazon', pattern: /AmazonWebView/i },
    { name: 'Generic In-App', pattern: /wv\)|WebView/i }
  ];

  for (const { name, pattern } of inAppPatterns) {
    if (pattern.test(userAgent)) {
      return {
        isInAppBrowser: true,
        appName: name,
        userAgent
      };
    }
  }

  return {
    isInAppBrowser: false,
    userAgent
  };
}

/**
 * 外部ブラウザで開くためのURLを生成
 */
export function getExternalBrowserUrl(currentUrl: string): string {
  // 現在のURLをそのまま返す（外部ブラウザで開く際に使用）
  return currentUrl;
}

/**
 * 外部ブラウザで開くためのメッセージを取得
 */
export function getExternalBrowserMessage(appName?: string): string {
  if (appName) {
    return `${appName}のアプリ内ブラウザから外部ブラウザで開くことをお勧めします。`;
  }
  return 'アプリ内ブラウザから外部ブラウザで開くことをお勧めします。';
}
