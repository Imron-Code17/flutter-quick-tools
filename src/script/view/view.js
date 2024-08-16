function viewScript(viewName) {
    return `
import 'package:auto_route/auto_route.dart';
import 'package:flutter/material.dart';

@RoutePage()
class ${viewName}View extends StatelessWidget {
  const ${viewName}View({super.key});

  @override
  Widget build(BuildContext context) {
    return const Scaffold(
      body: Center(
        child: Text('${viewName} View'),
      ),
    );
  }
}
    `.trim();
}

module.exports = {
    viewScript
};
