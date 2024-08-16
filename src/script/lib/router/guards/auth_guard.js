module.exports = `
import 'package:auto_route/auto_route.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import '../../presentations/auth/cubit/auth_cubit.dart';

class AuthGuard extends AutoRouteGuard {
  @override
  void onNavigation(NavigationResolver resolver, StackRouter router) {
    final context = router.navigatorKey.currentContext;
    if (context == null) {
      resolver.next(false);
      return;
    }
    final authenticated = context.read<AuthCubit>().state.isAuthenticated;
    if (authenticated) {
      resolver.next(true);
    } else {
      // resolver.redirect(const LoginRoute());
    }
  }
}
`;