module.exports = `
import 'package:flutter/material.dart';
import 'package:gap/gap.dart';

import 'extensions/context_extension.dart';

class AppBottomSheet {
  static Future<void> show(
      {required BuildContext context,
      String? title,
      required Widget child,
      AppBottomsheetType type = AppBottomsheetType.normal,
      bool isFooterActive = false,
      String? textButtonFooter,
      Function()? onPressed}) async {
    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.transparent,
      useSafeArea: true,
      builder: (context) => Container(
          width: context.mediaQuery.size.width,
          decoration: const BoxDecoration(
            color: Colors.white,
            borderRadius: BorderRadius.vertical(top: Radius.circular(12)),
          ),
          child: ConstrainedBox(
              constraints: BoxConstraints(
                  maxHeight: context.mediaQuery.size.height,
                  minHeight: context.mediaQuery.size.height / 10),
              child: Material(
                  color: Colors.transparent,
                  child: Stack(children: [
                    SingleChildScrollView(
                        child: Column(children: [
                      const Gap(6),
                      Padding(
                        padding: const EdgeInsets.all(12),
                        child: child,
                      )
                    ])),
                    _headerAppBottomSheet(type, context, title),
                    Visibility(
                        visible: isFooterActive,
                        child: _footerAppBottomsheet(
                            context, textButtonFooter, onPressed))
                  ])))),
    );
  }

  static Widget _footerAppBottomsheet(
      BuildContext context, String? textButtonFooter, Function()? onPressed) {
    return Positioned(
      bottom: 0,
      left: 0,
      right: 0,
      child: Container(
          padding: const EdgeInsets.all(12),
          height: 62,
          width: context.sizeWidth,
          decoration: const BoxDecoration(color: Colors.white),
          child: ElevatedButton(
              onPressed: onPressed,
              style: ElevatedButton.styleFrom(
                backgroundColor: const Color(0xff4E36E2),
                shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(12)),
                elevation: 0,
              ),
              child: Text(textButtonFooter ?? '',
                  style: context.textTheme.titleSmall
                      ?.copyWith(color: Colors.white)))),
    );
  }

  static Widget _headerAppBottomSheet(
      AppBottomsheetType type, BuildContext context, String? title) {
    switch (type) {
      case AppBottomsheetType.withCenterLine:
        return _buildWithCenterLine(context, title);
      case AppBottomsheetType.withCloseButton:
        return _buildWithCloseButton(context, title);
      default:
        return _buildNormal(context, title);
    }
  }

  static Widget _buildNormal(BuildContext context, String? title) {
    return Container(
        height: 42,
        padding: const EdgeInsets.symmetric(horizontal: 12),
        width: context.mediaQuery.size.width,
        decoration: const BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.vertical(top: Radius.circular(12)),
        ));
  }

  static Widget _buildWithCloseButton(BuildContext context, String? title) {
    return Container(
      height: 42,
      padding: const EdgeInsets.symmetric(horizontal: 12),
      width: context.mediaQuery.size.width,
      decoration: const BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.vertical(top: Radius.circular(12)),
      ),
      child: Row(mainAxisAlignment: MainAxisAlignment.spaceBetween, children: [
        const SizedBox(),
        Text(title ?? '',
            style: context.textTheme.bodyLarge
                ?.copyWith(fontWeight: FontWeight.bold)),
        GestureDetector(
            onTap: () => Navigator.of(context).pop(),
            child: Image.asset(
              'assets/images/close.png',
              height: 14,
            ))
      ]),
    );
  }

  static Widget _buildWithCenterLine(BuildContext context, String? title) {
    return Container(
        height: 42,
        padding: const EdgeInsets.symmetric(horizontal: 12),
        width: context.mediaQuery.size.width,
        decoration: const BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.vertical(top: Radius.circular(12)),
        ),
        child: Center(
            child: Container(
          height: 3,
          width: context.sizeWidth / 8,
          decoration: BoxDecoration(
              color: const Color(0xff9CA3AF),
              borderRadius: BorderRadius.circular(8)),
        )));
  }
}

enum AppBottomsheetType { normal, withCloseButton, withCenterLine }
`;