module.exports = `
import 'dart:developer';

import 'package:dio/dio.dart';

class Failure {
  final String message;
  final FailureType type;

  Failure(this.message, this.type) {
    log('Failure: $message', stackTrace: StackTrace.current, error: message);
  }

  factory Failure.noConnection() {
    return Failure('No internet connection', FailureType.network);
  }

  factory Failure.serverError(String message) {
    return Failure('Server error: $message', FailureType.server);
  }

  factory Failure.unknownError(String message) {
    return Failure('Unknown error: $message', FailureType.unknown);
  }

  static parseFromException(dynamic e) {
    if (e is DioException) {
      if (e.type == DioExceptionType.connectionTimeout ||
          e.type == DioExceptionType.receiveTimeout ||
          e.type == DioExceptionType.sendTimeout) {
        return Failure.noConnection();
      } else if (e.response != null) {
        if (e.response?.data is Map) {
          return Failure.serverError(e.response!.data['message'].toString());
        } else {
          return Failure.serverError(
              e.response?.statusMessage ?? 'Server Error');
        }
      }
    }
    if (e is TypeError) {
      return Failure.unknownError('Parsing Error: \${e.stackTrace.toString()}}');
    }
    return Failure.unknownError(e.toString());
  }

  map<T>({
    required T Function(Failure failure) network,
    required T Function(Failure failure) server,
    required T Function(Failure failure) unknown,
  }) {
    switch (type) {
      case FailureType.network:
        return network(this);
      case FailureType.server:
        return server(this);
      case FailureType.unknown:
        return unknown(this);
    }
  }
}

enum FailureType {
  network,
  server,
  unknown,
}

`;
