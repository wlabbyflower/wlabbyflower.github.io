module.exports = {
  en: {
    "ios-stash-quick": `# iOS Stash and cat Coexistence

## cat App Configuration

After opening the cat client and logging in successfully:

1. Go to "Me" -> cat Management -> Network Mode, then select proxy mode.
2. Tap "Me" -> the settings gear in the upper-right corner -> Client Keep-Alive -> Location Keep-Alive. This may consume extra battery.
3. After finishing the configuration, remove the entire client from the background.

## Stash Configuration

### Import the Override Configuration

Override file URL: https://raw.githubusercontent.com/wlabbyflower/peppapigconfigurationguide/refs/heads/main/docs/03-%E5%AE%A2%E6%88%B7%E7%AB%AF%E5%85%B1%E5%AD%98/iOS/iOSstash%E9%85%8D%E7%BD%AE/lzc.stash

Tap the "Override" card -> tap "+" to add -> enter the override file URL -> tap "Download" -> swipe down to install.

<img width="1184" height="872" alt="o1" src="https://github.com/user-attachments/assets/aa5d1398-ee04-415d-9f44-17c529d2a14c" />

### Enable IPv6 and Skip Routes

Tap "Settings" at the bottom -> tap "Network Settings" -> enable Tunnel IPv6 routes -> open Skip Routes.

Add: 6.6.6.6/32   2000::6666/128

Remove: fc00::/7

<img width="1184" height="872" alt="o2" src="https://github.com/user-attachments/assets/b45fb188-ff73-4d5b-9011-8bab109ca030" />

### Start and Select Lzc-Node

<img width="791" height="872" alt="o3" src="https://github.com/user-attachments/assets/a86e8c9c-4058-4247-a073-9cac6f1b6b21" />

## Verification

![e7ad1f687417c80817443d23ea982908](https://lzc-playground-1301583638.cos.ap-chengdu.myqcloud.com/guidelines/395/e7ad1f687417c80817443d23ea982908.jpg?imageSlim)
`,
  },
};
