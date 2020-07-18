cordova.define('cordova/plugin_list', function(require, exports, module) {
  module.exports = [
    {
      "id": "cordova-plugin-device",
      "file": "plugins/cordova-plugin-device/www/device.js",
      "pluginId": "cordova-plugin-device",
      "clobbers": [
        "device"
      ]
    },
    {
      "id": "cordova-plugin-geolocation.geolocation",
      "file": "plugins/cordova-plugin-geolocation/www/android/geolocation.js",
      "pluginId": "cordova-plugin-geolocation",
      "clobbers": [
        "navigator.geolocation"
      ]
    },
    {
      "id": "cordova-plugin-geolocation.PositionError",
      "file": "plugins/cordova-plugin-geolocation/www/PositionError.js",
      "pluginId": "cordova-plugin-geolocation",
      "runs": true
    },
    {
      "id": "cordova-plugin-inappbrowser.inappbrowser",
      "file": "plugins/cordova-plugin-inappbrowser/www/inappbrowser.js",
      "pluginId": "cordova-plugin-inappbrowser",
      "clobbers": [
        "cordova.InAppBrowser.open",
        "window.open"
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
      "id": "cordova-rtsp-rtmp-stream.VideoStream",
      "file": "plugins/cordova-rtsp-rtmp-stream/www/videoStreamer.js",
      "pluginId": "cordova-rtsp-rtmp-stream",
      "clobbers": [
        "window.videoStreamer"
      ]
    }
  ];
  module.exports.metadata = {
    "cordova-plugin-device": "2.0.3",
    "cordova-plugin-geolocation": "4.0.2",
    "cordova-plugin-inappbrowser": "3.2.0",
    "cordova-plugin-statusbar": "2.4.3",
    "cordova-rtsp-rtmp-stream": "0.1.18",
    "cordova-plugin-whitelist": "1.3.4"
  };
});