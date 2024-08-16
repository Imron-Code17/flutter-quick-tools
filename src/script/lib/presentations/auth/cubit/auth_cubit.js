module.exports = `
import 'package:hydrated_bloc/hydrated_bloc.dart';
import '../../../lib.dart';
export 'auth_state.dart';

class AuthCubit extends HydratedCubit<AuthState> {
  AuthCubit(
    //   this._loginUseCase
      )
      : super(AuthState()) {
    //   execuite get data
  }
//   final LoginUseCase _loginUseCase;

  @override
  AuthState? fromJson(Map<String, dynamic> json) {
    return AuthState.fromJson(json);
  }

  @override
  Map<String, dynamic>? toJson(AuthState state) {
    return state.toJson();
  }


//   login(String email, String password) async {
//     AppDialog.loading(message: 'Logging in...');
//     final result =
//         await _loginUseCase(LoginParam(email: email, password: password));
//     AppDialog.hideLoading();
//     result.fold(
//       (l) {
//         AppDialog.error(l.message);
//         emit(state.copyWith(user: null));
//       },
//       (r) => emit(state.copyWith(user: r)),
//     );
//     router.reevaluateGuards();
//   }

}
`;