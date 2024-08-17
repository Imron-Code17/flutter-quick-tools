module.exports = `
import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:flutter_easy_dialogs/flutter_easy_dialogs.dart';
import 'lib.dart';

class App extends StatelessWidget {
  const App({super.key});

  @override
  Widget build(BuildContext context) {
    return MultiBlocProvider(
      providers: [
        BlocProvider<AuthCubit>(
          create: (context) => di(),
        ),
      ],
      child: MaterialApp.router(
        title: 'Flutter Magic',
        routerConfig: router.config(),
        theme: primaryTheme,
        builder: FlutterEasyDialogs.builder(),
      ),
    );
  }
}

`;