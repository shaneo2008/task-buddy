import { Browser } from '@capacitor/browser';
import { Capacitor } from '@capacitor/core';

const ALLOWED_HOSTS = new Set([
  'taskbuddies.app',
  'www.taskbuddies.app',
  'lovou.app',
  'www.lovou.app',
  'buymeacoffee.com',
]);

export async function openExternalUrl(url) {
  const parsedUrl = new URL(url);
  if (parsedUrl.protocol !== 'https:' || !ALLOWED_HOSTS.has(parsedUrl.hostname)) {
    throw new Error('External URL is not allowlisted');
  }

  if (Capacitor.isNativePlatform()) {
    await Browser.open({
      url: parsedUrl.toString(),
      presentationStyle: 'popover',
    });
    return;
  }

  window.open(parsedUrl.toString(), '_blank', 'noopener,noreferrer');
}
