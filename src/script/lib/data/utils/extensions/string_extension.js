module.exports = `
extension StringExt on String {
  String replacePercentage(int newPercentage) {
    return replaceAll('{percentage}', '$newPercentage%');
  }

  String getFutureDate() {
    final now = DateTime.now();
    final futureDate = now.add(Duration(days: int.parse(this)));
    final monthNames = [
      'Jan',
      'Feb',
      'Mar',
      'Apr',
      'May',
      'Jun',
      'Jul',
      'Aug',
      'Sep',
      'Oct',
      'Nov',
      'Dec'
    ];
    final month = monthNames[futureDate.month - 1];
    final day = futureDate.day;
    final year = futureDate.year;
    return '$month $day, $year';
  }
}
`;