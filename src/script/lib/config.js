module.exports = `
// ignore_for_file: unused_import, unused_field

import 'dart:io';
import 'package:device_info_plus/device_info_plus.dart';
import 'package:package_info_plus/package_info_plus.dart';

class AppConfig {
  static const String _testEnv = 'dev';
  static const String env =
      String.fromEnvironment('env', defaultValue: _testEnv);

  static _Env get _env => _getEnv(env);

  static _Env _getEnv(String env) {
    switch (env) {
      case 'dev':
        return _Env.dev(_fcmToken);
      case 'prod':
        return _Env.prod(_fcmToken);
      default:
        return _Env.dev(_fcmToken);
    }
  }

  static String _fcmToken = '';
  static String _docPath = '';
  static late PackageInfo _packageInfo;
  static late BaseDeviceInfo _deviceInfo;
  static String get appName => _env.appName;
  static String get baseUrl => _env.baseUrl;
  static String get fcmToken => _env.fcmToken;
  static String get fcmPrefix => _env.fcmPrefix;
  static String get documentPath => _docPath;
  // static PackageInfo get package => _packageInfo;
  // static BaseDeviceInfo get deviceInfo => _deviceInfo;
  // static FirebaseOptions get firebaseOptions =>
  //     Platform.isIOS ? _env.iosFirebaseOptions : _env.androidFirebaseOptions;
  static init(String fcmToken, String documentPath, PackageInfo packageInfo,
      BaseDeviceInfo deviceInfo) {
    _fcmToken = fcmToken;
    _docPath = documentPath;
    _packageInfo = packageInfo;
    _deviceInfo = deviceInfo;
  }
}

class _Env {
  final String appName;
  final String baseUrl;
  final String envName;
  final String fcmToken;
  final String fcmPrefix;
  // final FirebaseOptions androidFirebaseOptions;
  // final FirebaseOptions iosFirebaseOptions;

  _Env({
    required this.appName,
    required this.baseUrl,
    required this.envName,
    required this.fcmToken,
    required this.fcmPrefix,
    // required this.androidFirebaseOptions,
    // required this.iosFirebaseOptions,
  });

  factory _Env.dev(String fcmToken) {
    return _Env(
      appName: 'Dev',
      baseUrl: 'http://',
      envName: 'dev',
      fcmToken: fcmToken,
      fcmPrefix: 'dev',
      // androidFirebaseOptions: const FirebaseOptions(
      //   appId: '',
      //   apiKey: '',
      //   projectId: '',
      //   messagingSenderId: '',
      //   storageBucket: '',
      //   androidClientId:
      //       '',
      // ),
      // iosFirebaseOptions: const FirebaseOptions(
      //   appId: '',
      //   apiKey: '',
      //   projectId: '',
      //   messagingSenderId: '',
      //   storageBucket: '',
      //   iosClientId:'',
      //   iosBundleId: '',
      // ),
    );
  }

  factory _Env.prod(String fcmToken) {
    return _Env(
      appName: 'Prod',
      baseUrl: 'http://',
      envName: 'prod',
      fcmToken: fcmToken,
      fcmPrefix: '',
      // androidFirebaseOptions: const FirebaseOptions(
      //   appId: '',
      //   apiKey: '',
      //   projectId: '',
      //   messagingSenderId: '',
      //   storageBucket: '',
      //   androidClientId:'',
      // ),
      // iosFirebaseOptions: const FirebaseOptions(
      //   appId: '',
      //   apiKey: '',
      //   projectId: '',
      //   messagingSenderId: '',
      //   storageBucket: '',
      //   iosClientId:'',
      //   iosBundleId: '',
      // ),
    );
  }
}


`;