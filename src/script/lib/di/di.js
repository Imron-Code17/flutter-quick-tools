module.exports = `
// ignore_for_file: avoid_print

import 'package:connectivity_plus/connectivity_plus.dart';
import 'package:dio/dio.dart';
import 'package:get_it/get_it.dart';

import '../lib.dart';

final di = GetIt.I;

setupInjection() {
  try {
    _utils();
    _datasources();
    _repositories();
    _useCases();
    _cubits();
  } catch (e) {
    print(e);
  }
}

void _datasources() {
 // example : di.registerSingleton<AuthApi>(AuthApiImpl(di()));
}

void _repositories() {
 // example :  di.registerSingleton<AuthRepository>(AuthRepositoryImpl(di(), di()));
}

void _useCases() {
 // example :  di.registerSingleton<LoginUseCase>(LoginUseCase(di()));
}

void _cubits() {
 // example :  di.registerSingleton<AuthCubit>(AuthCubit(di(), di(), di(), di(), di(), di(), di()));
// example :  di.registerFactory(() => HomeCubit(di(), di(), di(), di(), di(), di(), di()));

}

void _utils() {
  di.registerLazySingleton(
    () {
      final dio = Dio();
      dio.options.baseUrl = AppConfig.baseUrl;
      dio.interceptors.add(DioTokenInterceptor(di()));
      dio.interceptors.add(LogInterceptor());
      return dio;
    },
    // instanceName: 'dio_for_api',
  );
  di.registerSingleton(Connectivity());
  di.registerSingleton<AppRouter>(AppRouter());
  di.registerSingleton<NetworkInfo>(NetworkInfoImpl(di()));
}
  `;
