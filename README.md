# Dynamic Link Handler

![Join Discord](https://img.shields.io/discord/564160730845151244)

## **Pre-release Notice**

This function dependent on Appwrite 1.4. Please note, as of the writing of this document, this version of Appwrite is not publicly available.

## Overview

Dynamic links are links that redirect users to different locations based on their device, operating system, or other factors. For example, a link to a mobile app can redirect users to the Google Play Store or Apple App Store depending on their device. Dynamic links can also be used to redirect users to Deep Links - a specific page within a Mobile app, such as a user profile page.

## Configuration

The service can be configured through the `CONFIG` environment variable in a JSON string format. Each object in the `CONFIG` array is expected to have a `path` and `targets`.

To illustrate, here are example settings for the `CONFIG` environment variable with respective use cases:

### 1. Mobile vs. Desktop Redirection

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
In this example, requests to the `/test` path will redirect mobile users to `https://m.example.com/test`, while desktop users are redirected to `https://www.example.com/test`. Users with unrecognized or non-classified user-agents will be directed to the default URL `https://www.example.com/test`.

### 2. Operating System-Specific Redirection

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
In this scenario, requests to the `/app` path will redirect Android users to the Google Play store and iOS users to the Apple App Store, while all other users are directed to the general application page.

### 3. Deep Link Redirection with Fallback Option

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
In this case, requests to the `/deeplink` path will redirect Android and iOS users to a specific part of an app, if installed. If the app is not installed (the deep link fails), they will be directed to their respective app stores. All other users will be redirected to a webpage containing similar information.

## Setting Up Deep Links

### Android

For Android, add the following to your `AndroidManifest.xml`:

```xml
<activity
    android:name="com.example.MainActivity"
    android:label="@string/app_name"
    android:launchMode="singleTask"
    android:theme="@style/AppTheme.NoActionBar">
    <intent-filter android:label="@string/app_name">
        <action android:name="android.intent.action.VIEW" />
        <category android:name="android.intent.category.DEFAULT" />
        <category android:name="android.intent.category.BROWSABLE" />

        <!-- Accepts URIs that begin with YOUR_SCHEME://YOUR_HOST -->
        <data
            android:host="YOUR_HOST"
            android:scheme="YOUR_SCHEME" />
    </intent-filter>
</activity>
```

Also, add the following to your `MainActivity.java`:

```java
@Override
protected void onCreate(Bundle savedInstanceState) {
    super.onCreate(savedInstanceState);
    setContentView(R.layout.activity_main);

    // Get the intent that started this activity
    Intent intent = getIntent();
    Uri data = intent.getData();

    // Verify that the intent has the correct action and data
    if (Intent.ACTION_VIEW.equals(intent.getAction()) && data != null) {
        String path = data.getPath();
        String query = data.getQuery();
        String screenName = query.substring(query.indexOf("=") + 1);
        String url = "https://twitter.com/" + screenName;

        // Redirect to the correct screen
        Intent redirect = new Intent(Intent.ACTION_VIEW, Uri.parse(url));
        startActivity(redirect);
    }
}
```

More information on deep linking for Android can be found [on the Android Developers website](https://developer.android.com/training/app-links/deep-linking).

### iOS

For iOS, add the following to your `Info.plist` file:

```xml
<array>
    <dict>
        <key>CFBundleURLSchemes</key>
        <array>
            <string>YOUR_SCHEME</string>
        </array>
        <key>CFBundleURLName</key>
        <string>YOUR_HOST</string>
    </dict>
</array>
```

Also, in your `AppDelegate.swift` file, add the following to handle deep links:

```swift
func application(_ application: UIApplication, continue userActivity: NSUserActivity, restorationHandler: @escaping ([UIUserActivityRestoring]?) -> Void) -> Bool {
    guard userActivity.activityType == NSUserActivityTypeBrowsingWeb,
        let url = userActivity.webpageURL,
        let components = NSURLComponents(url: url, resolvingAgainstBaseURL: true) else {
        return false
    }

    let path = components.path,
    let query = components.query,
    let screenName = query.substring(from: query.index(query.startIndex, offsetBy: query.index(of: "=")! + 1))
    let url = "https://twitter.com/\(screenName)"

    // Redirect to the correct screen
    if let url = URL(string: url) {
        let svc = SFSafariViewController(url: url)
        self.window?.rootViewController?.present(svc, animated: true, completion: nil)
    }
    return true
}
```

For further details on deep linking in iOS, refer to [Apple's official documentation](https://developer.apple.com/documentation/uikit/inter-process_communication/allowing_apps_and_websites_to_link_to_your_content).

## License

This project is licensed under The MIT License (MIT). For more information, visit [http://www.opensource.org/licenses/mit-license.php](http://www.opensource.org/licenses/mit-license.php).
