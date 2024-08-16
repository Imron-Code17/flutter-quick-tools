module.exports = `
import 'package:dio/dio.dart';
import 'package:equatable/equatable.dart';

class ApiResponse<T> extends Equatable {
  final bool success;
  final String message;
  final T? data;

  const ApiResponse(
      {required this.success, required this.message, required this.data});

  @override
  List<Object> get props => [success, message, data.runtimeType];

  factory ApiResponse.fromResponse(
      Response response, T Function(dynamic json) fromJson) {
    final isSuccess = response.statusCode.toString().startsWith('2');
    return ApiResponse(
      success: isSuccess,
      message: response.data['message'] ?? '',
      data: isSuccess ? fromJson(response.data) : null,
    );
  }
}

`;