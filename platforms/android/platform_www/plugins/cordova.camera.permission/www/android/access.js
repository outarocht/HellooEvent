cordova.define("cordova.camera.permission.Access", function(require, exports, module) {
/**
 *  Access plugin for Android
 *
 *  Copyright (c) 2015 Working Edge Ltd.
 *  Copyright (c) 2012 AVANTIC ESTUDIO DE INGENIEROS
 **/
var Access = (function(){

    /***********************
     *
     * Internal properties
     *
     *********************/
    var Access = {};

    // Indicates if a runtime permissions request is in progress
    var requestInProgress = false;

    /********************
     *
     * Public properties
     *
     ********************/

    /**
     * "Dangerous" permissions that need to be requested at run-time (Android 6.0/API 23 and above)
     * See http://developer.android.com/guide/topics/security/permissions.html#perm-groups
     * @type {Object}
     */
    Access.runtimePermission = // deprecated
        Access.permission = {
            "READ_CALENDAR": "READ_CALENDAR",
            "WRITE_CALENDAR": "WRITE_CALENDAR",
            "CAMERA": "CAMERA",
            "READ_CONTACTS": "READ_CONTACTS",
            "WRITE_CONTACTS": "WRITE_CONTACTS",
            "GET_ACCOUNTS": "GET_ACCOUNTS",
            "ACCESS_FINE_LOCATION": "ACCESS_FINE_LOCATION",
            "ACCESS_COARSE_LOCATION": "ACCESS_COARSE_LOCATION",
            "RECORD_AUDIO": "RECORD_AUDIO",
            "READ_PHONE_STATE": "READ_PHONE_STATE",
            "CALL_PHONE": "CALL_PHONE",
            "ADD_VOICEMAIL": "ADD_VOICEMAIL",
            "USE_SIP": "USE_SIP",
            "PROCESS_OUTGOING_CALLS": "PROCESS_OUTGOING_CALLS",
            "READ_CALL_LOG": "READ_CALL_LOG",
            "WRITE_CALL_LOG": "WRITE_CALL_LOG",
            "SEND_SMS": "SEND_SMS",
            "RECEIVE_SMS": "RECEIVE_SMS",
            "READ_SMS": "READ_SMS",
            "RECEIVE_WAP_PUSH": "RECEIVE_WAP_PUSH",
            "RECEIVE_MMS": "RECEIVE_MMS",
            "WRITE_EXTERNAL_STORAGE": "WRITE_EXTERNAL_STORAGE",
            "READ_EXTERNAL_STORAGE": "READ_EXTERNAL_STORAGE",
            "BODY_SENSORS": "BODY_SENSORS"
        };

    /**
     * Permission groups indicate which associated permissions will also be requested if a given permission is requested.
     * See http://developer.android.com/guide/topics/security/permissions.html#perm-groups
     * @type {Object}
     */
    Access.runtimePermissionGroups = // deprecated
        Access.permissionGroups = {
            "CALENDAR": ["READ_CALENDAR", "WRITE_CALENDAR"],
            "CAMERA": ["CAMERA"],
            "CONTACTS": ["READ_CONTACTS", "WRITE_CONTACTS", "GET_ACCOUNTS"],
            "LOCATION": ["ACCESS_FINE_LOCATION", "ACCESS_COARSE_LOCATION"],
            "MICROPHONE": ["RECORD_AUDIO"],
            "PHONE": ["READ_PHONE_STATE", "CALL_PHONE", "ADD_VOICEMAIL", "USE_SIP", "PROCESS_OUTGOING_CALLS", "READ_CALL_LOG", "WRITE_CALL_LOG"],
            "SENSORS": ["BODY_SENSORS"],
            "SMS": ["SEND_SMS", "RECEIVE_SMS", "READ_SMS", "RECEIVE_WAP_PUSH", "RECEIVE_MMS"],
            "STORAGE": ["READ_EXTERNAL_STORAGE", "WRITE_EXTERNAL_STORAGE"]
        };

    Access.runtimePermissionStatus = // deprecated
        Access.permissionStatus = {
            "GRANTED": "GRANTED", //  User granted access to this permission, the device is running Android 5.x or below, or the app is built with API 22 or below.
            "DENIED": "DENIED", // User denied access to this permission
            "NOT_REQUESTED": "NOT_REQUESTED", // App has not yet requested access to this permission.
            "DENIED_ALWAYS": "DENIED_ALWAYS" // User denied access to this permission and checked "Never Ask Again" box.
        };



    Access.cpuArchitecture = {
        UNKNOWN: "unknown",
        ARMv6: "ARMv6",
        ARMv7: "ARMv7",
        ARMv8: "ARMv8",
        X86: "X86",
        X86_64: "X86_64",
        MIPS: "MIPS",
        MIPS_64: "MIPS_64"
    };

    /*****************************
     *
     * Protected member functions
     *
     ****************************/
    // Placeholder listeners
    Access._onNFCStateChange =
        Access._onPermissionRequestComplete = function(){};

    /********************
     *
     * Internal functions
     *
     ********************/

    function checkForInvalidPermissions(permissions, errorCallback){
        if(typeof(permissions) !== "object") permissions = [permissions];
        var valid = true, invalidPermissions = [];
        permissions.forEach(function(permission){
            if(!Access.permission[permission]){
                invalidPermissions.push(permission);
            }
        });
        if(invalidPermissions.length > 0){
            errorCallback("Invalid permissions specified: "+invalidPermissions.join(", "));
            valid = false;
        }
        return valid;
    }



    /*****************************
     *
     * Protected member functions
     *
     ****************************/

    Access._ensureBoolean = function (callback){
        return function(result){
            callback(!!result);
        }
    };

    /**********************
     *
     * Public API functions
     *
     **********************/


    /***********
     * General
     ***********/

    /**
     * Enables debug mode, which logs native debug messages to the native and JS consoles.
     * Debug mode is initially disabled on plugin initialisation.
     *
     * @param {Function} successCallback - The callback which will be called when enabling debug is successful.
     */
    Access.enableDebug = function(successCallback) {
        return cordova.exec(successCallback,
            null,
            'Access',
            'enableDebug',
            []);
    };

    /**
     * Opens settings page for this app.
     *
     * @param {Function} successCallback - The callback which will be called when switch to settings is successful.
     * @param {Function} errorCallback - The callback which will be called when switch to settings encounters an error.
     * This callback function is passed a single string parameter containing the error message.
     */
    Access.switchToSettings = function(successCallback, errorCallback) {
        return cordova.exec(successCallback,
            errorCallback,
            'Access',
            'switchToSettings',
            []);
    };

    /**
     * Returns the current authorisation status for a given permission.
     * Note: this is intended for Android 6 / API 23 and above. Calling on Android 5 / API 22 and below will always return GRANTED status as permissions are already granted at installation time.
     *
     * @param {Function} successCallback - function to call on successful retrieval of status.
     * This callback function is passed a single string parameter which defines the current authorisation status as a value in cordova.plugins.access.permissionStatus.
     * @param {Function} errorCallback - function to call on failure to retrieve authorisation status.
     * This callback function is passed a single string parameter containing the error message.
     * @param {String} permission - permission to request authorisation status for, defined as a value in cordova.plugins.access.permission
     */
    Access.getPermissionAuthorizationStatus = function(successCallback, errorCallback, permission){
        if(!checkForInvalidPermissions(permission, errorCallback)) return;

        return cordova.exec(
            successCallback,
            errorCallback,
            'Access',
            'getPermissionAuthorizationStatus',
            [permission]);
    };

    /**
     * Returns the current authorisation status for multiple permissions.
     * Note: this is intended for Android 6 / API 23 and above. Calling on Android 5 / API 22 and below will always return GRANTED status as permissions are already granted at installation time.
     *
     * @param {Function} successCallback - function to call on successful retrieval of status.
     * This callback function is passed a single object parameter which defines a key/value map, where the key is the requested permission defined as a value in cordova.plugins.access.permission, and the value is the current authorisation status of that permission as a value in cordova.plugins.access.permissionStatus.
     * @param {Function} errorCallback - function to call on failure to retrieve authorisation statuses.
     * This callback function is passed a single string parameter containing the error message.
     * @param {Array} permissions - list of permissions to request authorisation statuses for, defined as values in cordova.plugins.access.permission
     */
    Access.getPermissionsAuthorizationStatus = function(successCallback, errorCallback, permissions){
        if(!checkForInvalidPermissions(permissions, errorCallback)) return;

        return cordova.exec(
            successCallback,
            errorCallback,
            'Access',
            'getPermissionsAuthorizationStatus',
            [permissions]);
    };


    /**
     * Requests app to be granted authorisation for a runtime permission.
     * Note: this is intended for Android 6 / API 23 and above. Calling on Android 5 / API 22 and below will have no effect as the permissions are already granted at installation time.
     *
     * @param {Function} successCallback - function to call on successful request for runtime permission.
     * This callback function is passed a single string parameter which defines the resulting authorisation status as a value in cordova.plugins.access.permissionStatus.
     * @param {Function} errorCallback - function to call on failure to request authorisation.
     * This callback function is passed a single string parameter containing the error message.
     * @param {String} permission - permission to request authorisation for, defined as a value in cordova.plugins.access.permission
     */
    Access.requestRuntimePermission = function(successCallback, errorCallback, permission) {
        if(!checkForInvalidPermissions(permission, errorCallback)) return;

        if(requestInProgress){
            return onError("A runtime permissions request is already in progress");
        }

        function onSuccess(statuses){
            requestInProgress = false;
            successCallback(statuses[permission]);
            Access._onPermissionRequestComplete(statuses);
        }

        function onError(error){
            requestInProgress = false;
            errorCallback(error);
        }

        requestInProgress = true;
        return cordova.exec(
            onSuccess,
            onError,
            'Access',
            'requestRuntimePermission',
            [permission]);
    };

    /**
     * Requests app to be granted authorisation for multiple runtime permissions.
     * Note: this is intended for Android 6 / API 23 and above. Calling on Android 5 / API 22 and below will have no effect as the permissions are already granted at installation time.
     *
     * @param {Function} successCallback - function to call on successful request for runtime permissions.
     * This callback function is passed a single object parameter which defines a key/value map, where the key is the permission to request defined as a value in cordova.plugins.access.permission, and the value is the resulting authorisation status of that permission as a value in cordova.plugins.access.permissionStatus.
     * @param {Function} errorCallback - function to call on failure to request authorisation.
     * This callback function is passed a single string parameter containing the error message.
     * @param {Array} permissions - permissions to request authorisation for, defined as values in cordova.plugins.access.permission
     */
    Access.requestRuntimePermissions = function(successCallback, errorCallback, permissions){
        if(!checkForInvalidPermissions(permissions, errorCallback)) return;

        if(requestInProgress){
            return onError("A runtime permissions request is already in progress");
        }

        function onSuccess(statuses){
            requestInProgress = false;
            successCallback(statuses);
            Access._onPermissionRequestComplete(statuses);
        }

        function onError(error){
            requestInProgress = false;
            errorCallback(error);
        }

        requestInProgress = true;
        return cordova.exec(
            onSuccess,
            onError,
            'Access',
            'requestRuntimePermissions',
            [permissions]);

    };

    /**
     * Indicates if the plugin is currently requesting a runtime permission via the native API.
     * Note that only one request can be made concurrently because the native API cannot handle concurrent requests,
     * so the plugin will invoke the error callback if attempting to make more than one simultaneous request.
     * Multiple permission requests should be grouped into a single call since the native API is setup to handle batch requests of multiple permission groups.
     *
     * @return {boolean} true if a permission request is currently in progress.
     */
    Access.isRequestingPermission = function(){
        return requestInProgress;
    };

    /**
     * Registers a function to be called when a runtime permission request has completed.
     * Pass in a falsey value to de-register the currently registered function.
     *
     * @param {Function} successCallback -  The callback which will be called when a runtime permission request has completed.
     * This callback function is passed a single object parameter which defines a key/value map, where the key is the permission requested (defined as a value in cordova.plugins.access.permission) and the value is the resulting authorisation status of that permission as a value in cordova.plugins.access.permissionStatus.
     */
    Access.registerPermissionRequestCompleteHandler = function(successCallback) {
        Access._onPermissionRequestComplete = successCallback || function(){};
    };


    /**
     * Switches to the wireless settings page in the Settings app.
     * Allows configuration of wireless controls such as Wi-Fi, Bluetooth and Mobile networks.
     */
    Access.switchToWirelessSettings = function() {
        return cordova.exec(null,
            null,
            'Access',
            'switchToWirelessSettings',
            []);
    };


    /**
     * Switches to the Mobile Data page in the Settings app
     */
    Access.switchToMobileDataSettings = function() {
        return cordova.exec(null,
            null,
            'Access',
            'switchToMobileDataSettings',
            []);
    };

    /**
     * Checks if ADB mode(debug mode) is switched on.
     * Returns true if ADB mode is switched on.
     *
     * @param {Function} successCallback -  The callback which will be called when the operation is successful.
     * This callback function is passed a single boolean parameter which is TRUE if ADB mode(debug mode) is switched on.
     * @param {Function} errorCallback -  The callback which will be called when the operation encounters an error.
     *  This callback function is passed a single string parameter containing the error message.
     */
    Access.isADBModeEnabled = function(successCallback, errorCallback) {
        return cordova.exec(Access._ensureBoolean(successCallback),
            errorCallback,
            'Access',
            'isADBModeEnabled',
            []);
    };

    /**
     * Checks if the device is rooted.
     * Returns true if the device is rooted.
     *
     * @param {Function} successCallback -  The callback which will be called when the operation is successful.
     * This callback function is passed a single boolean parameter which is TRUE if the device is rooted.
     * @param {Function} errorCallback -  The callback which will be called when the operation encounters an error.
     *  This callback function is passed a single string parameter containing the error message.
     */
    Access.isDeviceRooted = function(successCallback, errorCallback) {
        return cordova.exec(Access._ensureBoolean(successCallback),
            errorCallback,
            'Access',
            'isDeviceRooted',
            []);
    };

    /**
     * Restarts the application.
     * By default, a "warm" restart will be performed in which the main Cordova activity is immediately restarted, causing the Webview instance to be recreated.
     * However, if the `cold` parameter is set to true, then the application will be "cold" restarted, meaning a system exit will be performed, causing the entire application to be restarted.
     * This is useful if you want to fully reset the native application state but will cause the application to briefly disappear and re-appear.
     *
     * Note: There is no successCallback() since if the operation is successful, the application will restart immediately before any success callback can be applied.
     *
     * @param {Function} errorCallback - function to call on failure to retrieve authorisation status.
     * This callback function is passed a single string parameter containing the error message.
     * @param {Boolean} cold - if true the application will be cold restarted. Defaults to false.
     */
    Access.restart = function(errorCallback, cold){
        return cordova.exec(
            null,
            errorCallback,
            'Access',
            'restart',
            [cold]);
    };

    /**
     * Returns CPU architecture of the current device.
     *
     * @param {Function} successCallback -  The callback which will be called when the operation is successful.
     * This callback function is passed a single string parameter defined as a constant in `cordova.plugins.access.cpuArchitecture`.
     * @param {Function} errorCallback -  The callback which will be called when the operation encounters an error.
     *  This callback function is passed a single string parameter containing the error message.
     */
    Access.getArchitecture = function(successCallback, errorCallback) {
        return cordova.exec(successCallback,
            errorCallback,
            'Access',
            'getArchitecture',
            []);
    };

    /**
     * Checks if the device data roaming setting is enabled.
     * Returns true if data roaming is enabled.
     *
     * @param {Function} successCallback -  The callback which will be called when the operation is successful.
     * This callback function is passed a single boolean parameter which is TRUE if data roaming is enabled.
     * @param {Function} errorCallback -  The callback which will be called when the operation encounters an error.
     *  This callback function is passed a single string parameter containing the error message.
     */
    Access.isDataRoamingEnabled = function(successCallback, errorCallback) {
        return cordova.exec(Access._ensureBoolean(successCallback),
            errorCallback,
            'Access',
            'isDataRoamingEnabled',
            []);
    };

    /************
     * Camera   *
     ************/

    /**
     * Checks if camera is usable: both present and authorised for use.
     *
     * @param {Object} params - (optional) parameters:
     *  - {Function} successCallback -  The callback which will be called when the operation is successful.
     * This callback function is passed a single boolean parameter which is TRUE if camera is present and authorized for use.
     *  - {Function} errorCallback -  The callback which will be called when the operation encounters an error.
     *  This callback function is passed a single string parameter containing the error message.
     *  - {Boolean} externalStorage - (Android only) If true, checks permission for READ_EXTERNAL_STORAGE in addition to CAMERA run-time permission.
     *  cordova-plugin-camera@2.2+ requires both of these permissions. Defaults to true.
     */
    Access.isCameraAvailable = function(params) {
        if(cordova.plugins.access.camera){
            cordova.plugins.access.camera.isCameraAvailable.apply(this, arguments);
        }else{
            throw "Access Camera module is not installed";
        }
    };

    /**
     * Checks if camera hardware is present on device.
     *
     * @param {Function} successCallback -  The callback which will be called when the operation is successful.
     * This callback function is passed a single boolean parameter which is TRUE if camera is present
     * @param {Function} errorCallback -  The callback which will be called when the operation encounters an error.
     *  This callback function is passed a single string parameter containing the error message.
     */
    Access.isCameraPresent = function(successCallback, errorCallback) {
        if(cordova.plugins.access.camera){
            cordova.plugins.access.camera.isCameraPresent.apply(this, arguments);
        }else{
            throw "Access Camera module is not installed";
        }
    };

    /**
     * Requests authorisation for runtime permissions to use the camera.
     * Note: this is intended for Android 6 / API 23 and above. Calling on Android 5 / API 22 and below will have no effect as the permissions are already granted at installation time.
     * @param {Object} params - (optional) parameters:
     *  - {Function} successCallback - function to call on successful request for runtime permissions.
     * This callback function is passed a single string parameter which defines the resulting authorisation status as a value in cordova.plugins.access.permissionStatus.
     *  - {Function} errorCallback - function to call on failure to request authorisation.
     *  - {Boolean} externalStorage - (Android only) If true, requests permission for READ_EXTERNAL_STORAGE in addition to CAMERA run-time permission.
     *  cordova-plugin-camera@2.2+ requires both of these permissions. Defaults to true.
     */
    Access.requestCameraAuthorization = function(params){
        if(cordova.plugins.access.camera){
            cordova.plugins.access.camera.requestCameraAuthorization.apply(this, arguments);
        }else{
            throw "Access Camera module is not installed";
        }
    };

    /**
     * Returns the authorisation status for runtime permissions to use the camera.
     * Note: this is intended for Android 6 / API 23 and above. Calling on Android 5 / API 22 and below will always return GRANTED status as permissions are already granted at installation time.
     * @param {Object} params - (optional) parameters:
     *  - {Function} successCallback - function to call on successful request for runtime permissions status.
     * This callback function is passed a single string parameter which defines the current authorisation status as a value in cordova.plugins.access.permissionStatus.
     *  - {Function} errorCallback - function to call on failure to request authorisation status.
     *  - {Boolean} externalStorage - (Android only) If true, checks permission for READ_EXTERNAL_STORAGE in addition to CAMERA run-time permission.
     *  cordova-plugin-camera@2.2+ requires both of these permissions. Defaults to true.
     */
    Access.getCameraAuthorizationStatus = function(params){
        if(cordova.plugins.access.camera){
            cordova.plugins.access.camera.getCameraAuthorizationStatus.apply(this, arguments);
        }else{
            throw "Access Camera module is not installed";
        }
    };

    /**
     * Checks if the application is authorized to use the camera.
     * Note: this is intended for Android 6 / API 23 and above. Calling on Android 5 / API 22 and below will always return TRUE as permissions are already granted at installation time.
     * @param {Object} params - (optional) parameters:
     *  - {Function} successCallback - function to call on successful request for runtime permissions status.
     * This callback function is passed a single boolean parameter which is TRUE if the app currently has runtime authorisation to use location.
     *  - {Function} errorCallback - function to call on failure to request authorisation status.
     *  - {Boolean} externalStorage - (Android only) If true, checks permission for READ_EXTERNAL_STORAGE in addition to CAMERA run-time permission.
     *  cordova-plugin-camera@2.2+ requires both of these permissions. Defaults to true.
     */
    Access.isCameraAuthorized = function(params){
        if(cordova.plugins.access.camera){
            cordova.plugins.access.camera.isCameraAuthorized.apply(this, arguments);
        }else{
            throw "Access Camera module is not installed";
        }
    };

    return Access;
});
module.exports = new Access();
});
