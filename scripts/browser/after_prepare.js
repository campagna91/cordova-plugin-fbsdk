#!/usr/bin/env node
'use strict';

var fs = require('fs');

var getPreferenceValueFromConfig = function(config, name) {
  var value = config.match(new RegExp('name="' + name + '" value="(.*?)"', "i"))
  if (value && value[1]) {
    return value[1]
  } else {
    return null
  }
}

var getPreferenceValueFromPackageJson = function(packageJson, name) {
  var value = packageJson.match(new RegExp('"' + name + '":\\s"(.*?)"', "i"))
  if (value && value[1]) {
    return value[1]
  } else {
    return null
  }
}

var getPreferenceValue = function(name) {
  var config = fs.readFileSync("config.xml").toString()
  var preferenceValue = getPreferenceValueFromConfig(config, name)
  if (!preferenceValue) {
    var packageJson = fs.readFileSync("package.json").toString()
    preferenceValue = getPreferenceValueFromPackageJson(packageJson, name)
  }
  return preferenceValue
}

var APP_ID = ''

if (process.argv.join("|").indexOf("APP_ID=") > -1) {
  APP_ID = process.argv.join("|").match(/APP_ID=(.*?)(\||$)/)[1]
} else {
  APP_ID = getPreferenceValue("APP_ID")
}

var FACEBOOK_BROWSER_SDK_VERSION = ''

if (process.argv.join("|").indexOf("FACEBOOK_BROWSER_SDK_VERSION=") > -1) {
  FACEBOOK_BROWSER_SDK_VERSION = process.argv.join("|").match(/FACEBOOK_BROWSER_SDK_VERSION=(.*?)(\||$)/)[1]
} else {
  FACEBOOK_BROWSER_SDK_VERSION = getPreferenceValue("FACEBOOK_BROWSER_SDK_VERSION")
}

var files = [
  'www/index.html'
]

var replaceInFile = function(filename, version) {
  if (fs.existsSync(filename)) {
    var data = fs.readFileSync(filename, 'utf8');
    var result = data.replace(/APP_ID(?=(\s*=\s*['"])|)/g, APP_ID);
    result = result.replace(/FACEBOOK_BROWSER_SDK_VERSION(?=(\s*=\s*['"])|)/g, FACEBOOK_BROWSER_SDK_VERSION);
    fs.writeFileSync(filename, result, 'utf8');
  }
}

for (var i in files) {
  replaceInFile(files[i])
}
