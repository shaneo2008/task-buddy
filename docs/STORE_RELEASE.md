# Task Buddies native release guide

Task Buddies uses Capacitor 8 and bundles the Vite application into each native binary.
The web/PWA build remains available separately.

## Permanent identifiers

- Public name: **Task Buddies**
- Apple bundle identifier: `app.taskbuddies`
- Android application ID: `app.taskbuddies`
- Initial marketing version: `1.0.0`
- Minimum iOS version: 15.0
- Android minimum SDK: 24
- Android target and compile SDK: 36

Do not change the bundle identifier or application ID after publishing.

## Local commands

Use Node 22 or newer and Java 21 for Android builds.

```bash
nvm use
npm ci
npm run check
npm run cap:sync
npm run android:lint
npm run android:debug
npm run android:bundle
```

Open the generated projects with `npm run cap:open:android` or
`npm run cap:open:ios`. A macOS host with Xcode is required to validate or archive iOS.

## Codemagic setup

`codemagic.yaml` intentionally builds artifacts but does not publish them. Keep the first
TestFlight and Play Console uploads under manual review.

1. Add this repository to Codemagic and select `codemagic.yaml`.
2. Run **Native verification** before configuring signing.
3. Upload the Android upload keystore under Team settings → Code signing identities and
   give it the reference name `task_buddies_upload`. Keep an independent encrypted backup;
   do not commit the keystore or passwords.
4. Add the App Store Connect API integration with the reference
   `task_buddies_app_store_connect`.
5. Register the explicit App ID `app.taskbuddies` in Apple Developer.
6. Create a **New App** in App Store Connect using that App ID.
7. Let Codemagic fetch or upload an Apple Distribution certificate and App Store
   provisioning profile for `app.taskbuddies`.
8. Run the Android or iOS release workflow and manually upload the generated AAB or IPA
   to the appropriate internal testing track.

Codemagic's `BUILD_NUMBER` sets Android `versionCode` and iOS
`CURRENT_PROJECT_VERSION`. Increase the marketing version in Android, Xcode, and the root
package together for each public release.

## Google Play setup

1. Create the app as **Task Buddies** with default language English.
2. Enrol in Play App Signing and upload the Codemagic-generated AAB to Internal testing.
3. Complete the Data safety form using the declarations below.
4. Declare the child target audience accurately and complete Families policy questions.
5. Complete the content rating questionnaire and provide the privacy and support URLs.
6. Promote through Closed testing before production. Complete any account-specific tester
   duration requirement shown by Play Console.

## Apple setup

1. Create the App Store Connect app record for `app.taskbuddies`.
2. Configure the Kids Category or age rating according to the final intended audience.
3. Use `https://www.taskbuddies.app/privacy` as the privacy URL.
4. Use `https://www.taskbuddies.app/support` as the support URL.
5. Answer App Privacy using the declarations below.
6. Upload the IPA to TestFlight, test on physical devices, and then submit for review.

## Privacy and child-safety declarations

The current binary:

- has no account system, backend, analytics, advertising, tracking, or in-app purchases;
- stores routines, rewards, buddy choices, and timer state on the device;
- may use optional local notifications for timer completion;
- opens privacy and support URLs only from a randomized parental gate;
- does not show the web donation link in native builds;
- bundles fonts and application content locally.

Apple App Privacy and Google Data safety should therefore declare no data collected or
shared, provided no SDK or product behavior is added that changes these facts. Device
platform backups may contain local app preferences under the user's Apple or Google
account settings; this is also disclosed in the privacy policy.

Re-audit the binary and update the policy and store declarations before every submission.

## Release QA

Test a clean install and an upgrade on physical iOS and Android devices:

- complete the buddy, routine setup, timer, feeding, and reward flow;
- pause, resume, skip, finish early, and cancel a timer;
- background and foreground during a timer, then force quit and reopen;
- allow and deny notification permission;
- verify offline launch and completion in airplane mode;
- verify Parent Area gating and all privacy/support links;
- verify persistence after process death and device restart;
- test small and large phones, tablets, font scaling, reduced motion, VoiceOver, and TalkBack;
- confirm no unexpected network requests or third-party SDK data transmission.

Keep screenshots and store copy synchronized with the submitted binary.
