module.exports = `
import 'package:flutter/material.dart';

extension ContextExt on BuildContext {
  MediaQueryData get mediaQuery => MediaQuery.of(this);
  bool get isLandscape => mediaQuery.orientation == Orientation.landscape;
  // Size related shortcuts
  Size get size => mediaQuery.size;
  double get sizeWidth => size.width;
  double get sizeHeight => size.height;
  EdgeInsets get padding => mediaQuery.padding;
  double get paddingTop => padding.top;

  // Theme related shortcuts
  ThemeData get theme => Theme.of(this);
  // AppColor get appColor => theme.appColor;
  ColorScheme get colorScheme => theme.colorScheme;

  // Accessing specific colors from the theme
  Color get primaryColor => theme.primaryColor;
  Color get canvasColor => theme.canvasColor;
  Color get scaffoldBackgroundColor => theme.scaffoldBackgroundColor;
  TextTheme get textTheme => theme.textTheme;
  Color? get textColor => theme.textTheme.bodyMedium?.color;
  Color get cardColor => theme.cardColor;
  Color? get iconThemeColor => theme.iconTheme.color;
  Color get disabledColor => theme.disabledColor;

  Color getChangeColor(double baseVal, double curVal) {
    if (curVal == baseVal) {
      return const Color.fromARGB(255, 215, 100, 12);
    } else if (curVal > baseVal) {
      return const Color.fromARGB(255, 0, 170, 102);
    } else {
      return const Color.fromARGB(255, 224, 62, 33);
    }
  }
}

`;