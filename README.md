# Dynamic Link Function

This function is a handler for HTTP requests which redirects the user to a specific target URL based on their user-agent (which typically indicates their operating system and browser type). The redirection configuration is passed in through the `CONFIG` environment variable as a JSON string. The `CONFIG` variable is expected to contain an array of objects, where each object should have a `path` and `targets`.

Here are some example `CONFIG` environment variable settings and the corresponding use cases:

1. **Mobile vs. Desktop Redirection**

```json
[
  {
    "path": "/test",
    "targets": {
      "mobile": "https://m.example.com/test",
      "desktop": "https://www.example.com/test",
      "default": "https://www.example.com/test"
    }
  }
]
```

In this case, when a request comes to the `/test` path, users with a user-agent string indicating a mobile device will be redirected to `https://m.example.com/test`, while users on desktop devices will be directed to `https://www.example.com/test`. If the user-agent is not recognized or does not fall into these categories, the user will be directed to the default URL `https://www.example.com/test`.

2. **OS Specific Redirection**

```json
[
  {
    "path": "/app",
    "targets": {
      "android": "https://play.google.com/store/apps/details?id=com.example",
      "ios": "https://apps.apple.com/app/example/id123456",
      "default": "https://www.example.com/app"
    }
  }
]
```

In this case, when a request comes to the `/app` path, users on Android devices will be redirected to the app's page on Google Play, while iOS users will be directed to the app's page on the Apple App Store. Other users will be redirected to a general application page.

3. **Deep Link Redirection with Fallback**

```json
[
  {
    "path": "/deeplink",
    "targets": {
      "android": {
        "appName": "twitter",
        "appPackage": "com.twitter.android",
        "appPath": "user?screen_name=appwrite",
        "fallback": "https://play.google.com/store/apps/details?id=com.twitter.android"
      },
      "ios": {
        "appName": "twitter",
        "appPath": "user?screen_name=appwrite",
        "fallback": "https://apps.apple.com/us/app/twitter/id333903271"
      },
      "default": "https://twitter.com/appwrite"
    }
  }
]
```

Here, when a request comes to the `/deeplink` path, Android and iOS users will be redirected to a deep link which opens a specific part of an app if they have it installed. If the app is not installed (the deep link fails), the fallback URL will open, leading them to the app's page on their respective app store. Other users will be redirected to a webpage with similar information.
