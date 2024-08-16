module.exports = `
bool parseIntToBool(int? map) {
  return map == 1 ? true : false;
}

int parseBoolToInt(bool map) {
  return map ? 1 : 0;
}

`;