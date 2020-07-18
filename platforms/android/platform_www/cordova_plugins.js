cordova.define('cordova/plugin_list', function(require, exports, module) {
  module.exports = [
    {
      "id": "cordova-plugin-android-permissions.Permissions",
      "file": "plugins/cordova-plugin-android-permissions/www/permissions.js",
      "pluginId": "cordova-plugin-android-permissions",
      "clobbers": [
        "cordova.plugins.permissions"
      ]
    },
    {
      "id": "cordova-plugin-device.device",
      "file": "plugins/cordova-plugin-device/www/device.js",
      "pluginId": "cordova-plugin-device",
      "clobbers": [
        "device"
      ]
    },
    {
      "id": "cordova-plugin-statusbar.statusbar",
      "file": "plugins/cordova-plugin-statusbar/www/statusbar.js",
      "pluginId": "cordova-plugin-statusbar",
      "clobbers": [
        "window.StatusBar"
      ]
    },
    {
      "id": "cordova.camera.permission.Access",
      "file": "plugins/cordova.camera.permission/www/android/access.js",
      "pluginId": "cordova.camera.permission",
      "merges": [
        "cordova.plugins.access"
      ]
    },
    {
      "id": "cordova.camera.permission.Access_Camera",
      "file": "plugins/cordova.camera.permission/www/android/access.camera.js",
      "pluginId": "cordova.camera.permission",
      "merges": [
        "cordova.plugins.access.camera"
      ]
    }
  ];
  module.exports.metadata = {
    "cordova-plugin-android-permissions": "1.0.2",
    "cordova-plugin-device": "2.0.3",
    "cordova-plugin-statusbar": "2.4.3",
    "cordova-plugin-whitelist": "1.3.4",
    "cordova.camera.permission": "1.0.0"
  };
});