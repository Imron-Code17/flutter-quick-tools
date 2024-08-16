module.exports = `
import 'dart:developer';

import 'package:flutter/material.dart';
import 'package:flutter_easy_dialogs/flutter_easy_dialogs.dart';
import 'package:phosphor_flutter/phosphor_flutter.dart';

import '../../../router/router.dart';
import 'extensions/context_extension.dart';

class AppDialog {
  static final ValueNotifier<double> _valueNotifier =
      ValueNotifier<double>(0.0);
  static Future<void> loading({String? message, double? value}) async {
    final context = router.navigatorKey.currentContext!;
    _valueNotifier.value = 0.0;
    if (value != null) {
      _valueNotifier.value = value;
      final contains =
          FlutterEasyDialogs.get(FullScreenDialog.defaultId).isShown;
      if (contains) {
        return;
      }
    }

    FlutterEasyDialogs.show<FullScreenDialog>(
      Container(
        width: context.sizeWidth,
        height: context.sizeHeight,
        color: Colors.black.withOpacity(0.5),
        child: Center(
          child: Container(
            padding: const EdgeInsets.all(16),
            decoration: BoxDecoration(
              color: context.canvasColor,
              borderRadius: BorderRadius.circular(12),
            ),
            child: Column(
              mainAxisSize: MainAxisSize.min,
              children: [
                ValueListenableBuilder(
                  valueListenable: _valueNotifier,
                  builder: (context, v, child) => CircularProgressIndicator(
                    valueColor: AlwaysStoppedAnimation(
                      context.textColor ?? Colors.black,
                    ),
                    value: value != null ? v : null,
                  ),
                ),
                if (message != null && message.isNotEmpty) ...[
                  const SizedBox(height: 8),
                  Text(
                    message,
                    textAlign: TextAlign.center,
                  ),
                ],
              ],
            ),
          ),
        ),
      )
          .fullScreen(autoHideDuration: null)
          .fade()
          .animatedTap()
          .slideVertical()
          .fadeBackground(),
    );
  }

  static Future<void> hideLoading() async {
    FlutterEasyDialogs.hide(id: FullScreenDialog.defaultId);
  }

  static Future<void> error(String message) async {
    final context = router.navigatorKey.currentContext!;
    FlutterEasyDialogs.show<FullScreenDialog>(EasyDialog.fullScreen(
      content: Container(
        width: context.sizeWidth,
        height: context.sizeHeight,
        color: Colors.black.withOpacity(0.5),
        child: Center(
          child: Container(
            width: double.infinity,
            margin: const EdgeInsets.all(32),
            padding: const EdgeInsets.all(16),
            decoration: BoxDecoration(
              color: context.canvasColor,
              borderRadius: BorderRadius.circular(4),
            ),
            child: Column(
              mainAxisSize: MainAxisSize.min,
              children: [
                PhosphorIcon(
                  PhosphorIcons.xCircle(PhosphorIconsStyle.duotone),
                  size: 24,
                  color: context.colorScheme.error,
                ),
                const SizedBox(height: 16),
                Text(
                  message,
                  textAlign: TextAlign.center,
                ),
                const SizedBox(height: 8),
                SizedBox(
                  width: double.infinity,
                  child: TextButton(
                    style: TextButton.styleFrom(
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(4),
                      ),
                      // backgroundColor: context.colorScheme.errorContainer,
                      foregroundColor: context.colorScheme.error,
                    ),
                    onPressed: () {
                      FlutterEasyDialogs.hide(id: FullScreenDialog.defaultId);
                    },
                    child: const Text('Close'),
                  ),
                ),
              ],
            ),
          ),
        ),
      ),
    ));
  }

  static Future<void> info(String message, {String? title}) async {
    final context = router.navigatorKey.currentContext!;
    await FlutterEasyDialogs.show<FullScreenDialog>(
      EasyDialog.fullScreen(
              content: _dialogWidget(
        context,
        [
          Text(
            title ?? 'Info',
            textAlign: TextAlign.center,
            style: const TextStyle(
              fontSize: 16,
              fontWeight: FontWeight.bold,
            ),
          ),
          const SizedBox(height: 8),
          Text(message, textAlign: TextAlign.left),
          const SizedBox(height: 16),
          SizedBox(
            height: 32,
            child: Row(
              mainAxisAlignment: MainAxisAlignment.end,
              children: [
                TextButton(
                  style: TextButton.styleFrom(
                    backgroundColor: Colors.transparent,
                    elevation: 0,
                    padding: EdgeInsets.zero,
                    tapTargetSize: MaterialTapTargetSize.shrinkWrap,
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(4),
                      side: BorderSide(
                        color: context.textColor ?? Colors.indigo,
                        strokeAlign: BorderSide.strokeAlignInside,
                        width: .5,
                      ),
                    ),
                    foregroundColor: context.textColor,
                    textStyle: const TextStyle(
                      fontSize: 14,
                    ),
                  ),
                  onPressed: () {
                    FlutterEasyDialogs.hide(id: FullScreenDialog.defaultId);
                  },
                  child: const Text('Close'),
                ),
              ],
            ),
          ),
        ],
      ))
          .fade()
          .slideVertical()
          .swipe(direction: DismissDirection.up)
          .fadeBackground(
            backgroundColor: Colors.black.withOpacity(0.5),
            blur: 0.0,
          ),
    );
  }

  static Future<bool?> confirm(String message,
      {String? yesText, String? noText}) async {
    final context = router.navigatorKey.currentContext!;
    return (await FlutterEasyDialogs.show<bool>(
      EasyDialog.fullScreen(
        animationConfiguration: const EasyDialogAnimationConfiguration.bounded(
          duration: Duration(milliseconds: 300),
        ),
        content: _dialogWidget(
          context,
          [
            const Text(
              'Confirm',
              textAlign: TextAlign.center,
              style: TextStyle(
                fontSize: 16,
                fontWeight: FontWeight.bold,
              ),
            ),
            const SizedBox(height: 8),
            Text(message, textAlign: TextAlign.left),
            const SizedBox(height: 16),
            SizedBox(
              height: 32,
              child: Row(
                mainAxisAlignment: MainAxisAlignment.end,
                children: [
                  TextButton(
                    style: TextButton.styleFrom(
                      backgroundColor: Colors.transparent,
                      elevation: 0,
                      padding: const EdgeInsets.symmetric(
                          horizontal: 16, vertical: 4),
                      tapTargetSize: MaterialTapTargetSize.shrinkWrap,
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(4),
                        side: const BorderSide(
                          color: Colors.indigo,
                          width: .5,
                          strokeAlign: BorderSide.strokeAlignInside,
                        ),
                      ),
                      foregroundColor: Colors.indigo,
                      textStyle: const TextStyle(
                        fontSize: 14,
                      ),
                    ),
                    onPressed: () {
                      FlutterEasyDialogs.hide(
                          id: FullScreenDialog.defaultId, result: false);
                    },
                    child: Text(noText ?? 'No'),
                  ),
                  const SizedBox(width: 8),
                  TextButton(
                    style: TextButton.styleFrom(
                      padding: const EdgeInsets.symmetric(
                          horizontal: 16, vertical: 4),
                      tapTargetSize: MaterialTapTargetSize.shrinkWrap,
                      backgroundColor: Colors.indigo,
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(4),
                      ),
                      foregroundColor: Colors.white,
                      elevation: 0,
                      textStyle: const TextStyle(
                        fontSize: 14,
                      ),
                    ),
                    onPressed: () {
                      FlutterEasyDialogs.hide(
                          id: FullScreenDialog.defaultId, result: true);
                    },
                    child: Text(yesText ?? 'Yes'),
                  ),
                ],
              ),
            ),
          ],
        ),
      )
          .fade(
            curve: Curves.easeInOut,
          )
          .fadeBackground(
            backgroundColor: Colors.black.withOpacity(0.5),
            curve: Curves.easeInOut,
            blur: 0.0,
          ),
    ));
  }

  static Widget _dialogWidget(BuildContext context, List<Widget> contents) {
    return GestureDetector(
      onTap: () {
        FlutterEasyDialogs.hide(id: FullScreenDialog.defaultId);
      },
      child: Container(
        width: context.sizeWidth,
        height: context.sizeHeight,
        color: Colors.transparent,
        child: Center(
          child: Container(
            // little bit to the top like .4 of the screen
            margin: EdgeInsets.only(bottom: context.sizeHeight * .2),
            child: GestureDetector(
              onTap: () {
                /// jangan dihilangkan untuk disable click disini
              },
              child: Container(
                width: double.infinity,
                padding: const EdgeInsets.all(24),
                margin: const EdgeInsets.all(32),
                decoration: BoxDecoration(
                  color: context.canvasColor,
                  borderRadius: BorderRadius.circular(6),
                ),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    ...contents,
                  ],
                ),
              ),
            ),
          ),
        ),
      ),
    );
  }

  static Future<void> showAlert(String title, String content,
      {Map<String, Function> listAction = const {}}) {
    final context = router.navigatorKey.currentContext!;
    List<Widget> lstAction = [];
    if (listAction.keys.toList().isEmpty) {
      lstAction.add(MaterialButton(
        child: const Text('Close'),
        onPressed: () {
          try {
            Navigator.of(context).pop();
          } catch (ex) {
            log(ex.toString());
          }
        },
      ));
    } else {
      listAction.forEach((key, value) {
        lstAction.add(MaterialButton(
          child: Text(key),
          onPressed: () {
            value.call();
          },
        ));
      });
    }
    return showDialog(
      context: context,
      builder: (BuildContext context) {
        // return object of type Dialog
        return MediaQuery(
          data: const MediaQueryData(textScaler: TextScaler.linear(1)),
          child: AlertDialog(
            title: Text(title),
            content: Text(content),
            actions: lstAction,
          ),
        );
      },
    );
  }
}

`;