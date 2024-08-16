module.exports = `
import 'package:flutter/material.dart';

ThemeData get primaryTheme {
  final base = ThemeData.light(useMaterial3: true);
  final primaryColor = createMaterialColor(const Color(0xff4E36E2));
  return base.copyWith(
    scaffoldBackgroundColor: Colors.white,
    primaryColor: primaryColor,
    textTheme: base.textTheme.apply(fontFamily: 'Poppins'),
    appBarTheme: AppBarTheme(
      backgroundColor: primaryColor,
      foregroundColor: Colors.white,
      centerTitle: true,
      titleTextStyle: const TextStyle(
        color: Colors.white,
        fontSize: 16,
        fontWeight: FontWeight.w600,
        fontFamily: 'Poppins',
      ),
    ),
    colorScheme: ColorScheme.fromSwatch(
      primarySwatch: primaryColor,
      brightness: Brightness.light,
      backgroundColor: Colors.white,
      errorColor: Colors.red.shade400,
      accentColor: Colors.indigoAccent,
      cardColor: Colors.white,
    ),
    dividerColor: const Color(0xffF2F2F2),
    dividerTheme: const DividerThemeData(
      color: Color(0xffF2F2F2),
      space: 0,
      thickness: 1,
    ),
    textButtonTheme: TextButtonThemeData(
      style: TextButton.styleFrom(
        tapTargetSize: MaterialTapTargetSize.shrinkWrap,
        padding: const EdgeInsets.symmetric(vertical: 8, horizontal: 0),
        minimumSize: Size.zero,
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(8),
        ),
        textStyle: const TextStyle(
          fontWeight: FontWeight.bold,
        ),
      ),
    ),
    // actionIconTheme: ActionIconThemeData(
    //   backButtonIconBuilder: (context) => const Icon(Icons.arrow_back_ios_new),
    // ),
    outlinedButtonTheme: OutlinedButtonThemeData(
      style: OutlinedButton.styleFrom(
        side: BorderSide(
          color: Colors.grey.shade200,
          width: 1,
        ),
        textStyle: const TextStyle(
          fontFamily: 'Poppins',
          fontWeight: FontWeight.w500,
        ),
      ),
    ),
    filledButtonTheme: FilledButtonThemeData(
      style: FilledButton.styleFrom(
        tapTargetSize: MaterialTapTargetSize.shrinkWrap,
        textStyle: const TextStyle(
          fontWeight: FontWeight.w500,
          fontFamily: 'Poppins',
        ),
        backgroundColor: primaryColor,
        foregroundColor: Colors.white,
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(8),
        ),
        overlayColor: Colors.black,
      ),
    ),
    inputDecorationTheme: InputDecorationTheme(
      contentPadding: const EdgeInsets.symmetric(
        vertical: 8,
        horizontal: 16,
      ),
      alignLabelWithHint: true,
      filled: true,
      fillColor: Colors.grey.shade50,
      floatingLabelBehavior: FloatingLabelBehavior.always,
      labelStyle: const TextStyle(
        fontSize: 16,
        color: Colors.black,
        fontWeight: FontWeight.bold,
      ),
      floatingLabelStyle: TextStyle(
        fontSize: 16,
        color: primaryColor,
        fontWeight: FontWeight.bold,
      ),
      hintStyle: TextStyle(
        fontSize: 14,
        color: Colors.grey.shade400,
      ),
      border: OutlineInputBorder(
        borderRadius: BorderRadius.circular(8),
      ),
      enabledBorder: OutlineInputBorder(
        borderRadius: BorderRadius.circular(8),
        borderSide: BorderSide(
          color: Colors.grey.shade200,
        ),
      ),
      focusedBorder: OutlineInputBorder(
        borderRadius: BorderRadius.circular(8),
        borderSide: BorderSide(
          color: primaryColor,
        ),
      ),
    ),
  );
}

MaterialColor createMaterialColor(Color color) {
  return MaterialColor(color.value, _getSwatch(color));
}

Map<int, Color> _getSwatch(Color color) {
  return {
    50: _tintColor(color, 0.9),
    100: _tintColor(color, 0.8),
    200: _tintColor(color, 0.6),
    300: _tintColor(color, 0.4),
    400: _tintColor(color, 0.2),
    500: color,
    600: _shadeColor(color, 0.1),
    700: _shadeColor(color, 0.2),
    800: _shadeColor(color, 0.3),
    900: _shadeColor(color, 0.4),
  };
}

Color _tintColor(Color color, double factor) {
  return Color.fromRGBO(
    color.red + ((255 - color.red) * factor).round(),
    color.green + ((255 - color.green) * factor).round(),
    color.blue + ((255 - color.blue) * factor).round(),
    1,
  );
}

Color _shadeColor(Color color, double factor) {
  return Color.fromRGBO(
    (color.red * (1 - factor)).round(),
    (color.green * (1 - factor)).round(),
    (color.blue * (1 - factor)).round(),
    1,
  );
}

`;