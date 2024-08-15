module.exports = `
class NetworkException implements Exception {
  final String message;
  final int code;

  NetworkException(this.message, this.code);

  @override
  String toString() {
    return 'NetworkException{message: $message, code: $code}';
  }
}
`;