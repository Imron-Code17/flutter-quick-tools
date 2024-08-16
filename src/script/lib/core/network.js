module.exports = `
import 'package:connectivity_plus/connectivity_plus.dart';

abstract class NetworkInfo {
  Future<bool> get isConnected;
}

class NetworkInfoImpl implements NetworkInfo {
  final Connectivity connectivity;

  NetworkInfoImpl(this.connectivity);

  @override
  Future<bool> get isConnected =>
      connectivity.checkConnectivity().then((value) {
        if (value.contains(ConnectivityResult.none)) {
          return false;
        } else {
          return true;
        }
      });
}

`;