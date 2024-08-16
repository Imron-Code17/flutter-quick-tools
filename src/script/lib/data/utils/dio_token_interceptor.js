module.exports = `
import 'dart:io';
import 'package:dio/dio.dart';
import '../../router/router.dart';

class DioTokenInterceptor implements InterceptorsWrapper {
  final AppRouter router;

  DioTokenInterceptor(this.router);
  @override
  void onError(DioException err, ErrorInterceptorHandler handler) {
    if (err.response?.statusCode == HttpStatus.unauthorized) {
      // Refresh Token
    }
    return handler.next(err);
  }

  @override
  void onRequest(RequestOptions options, RequestInterceptorHandler handler) {
    return handler.next(options);
  }

  @override
  void onResponse(Response response, ResponseInterceptorHandler handler) async {
    return handler.next(response);
  }
}
`;