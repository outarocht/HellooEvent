/**
 *  Access plugin for iOS
 *
 **/
var Access = (function(){

    /********************
     * Internal functions
     ********************/


    /********************
     * Public properties
     ********************/
    var Access = {};

    /**
     * Permission states
     * @type {object}
     */
    Access.permissionStatus = {
        "NOT_REQUESTED": "not_determined", // App has not yet requested this permission
        "DENIED": "denied", // User denied access to this permission
        "RESTRICTED": "restricted", // Permission is unavailable and user cannot enable it.  For example, when parental controls are in effect for the current user.
        "GRANTED": "authorized", //  User granted access to this permission
        "GRANTED_WHEN_IN_USE": "authorized_when_in_use" //  User granted access use location permission only when app is in use
    };

    Access.cpuArchitecture = {
        UNKNOWN: "unknown",
        ARMv6: "ARMv6",
        ARMv7: "ARMv7",
        ARMv8: "ARMv8",
        X86: "X86",
        X86_64: "X86_64"
    };

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
     * Core
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
     * Switch to settings app. Opens settings page for this app.
     *
     * @param {Function} successCallback - The callback which will be called when switch to settings is successful.
     * @param {Function} errorCallback - The callback which will be called when switch to settings encounters an error.
     * This callback function is passed a single string parameter containing the error message.
     * This works only on iOS 8+. iOS 7 and below will invoke the errorCallback.
     */
    Access.switchToSettings = function(successCallback, errorCallback) {
        return cordova.exec(successCallback,
            errorCallback,
            'Access',
            'switchToSettings',
            []);
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
     * Returns the background refresh authorization status for the application.
     *
     * @param {Function} successCallback - The callback which will be called when operation is successful.
     * This callback function is passed a single string parameter which indicates the authorization status as a constant in `cordova.plugins.access.permissionStatus`.
     * @param {Function} errorCallback -  The callback which will be called when operation encounters an error.
     * This callback function is passed a single string parameter containing the error message.
     */
    Access.getBackgroundRefreshStatus = function(successCallback, errorCallback) {
        return cordova.exec(successCallback,
            errorCallback,
            'Access',
            'getBackgroundRefreshStatus',
            []);
    };

    /************
     * Camera   *
     ************/

    /**
     * Checks if camera is enabled for use.
     * On iOS this returns true if both the device has a camera AND the application is authorized to use it.
     *
     * @param {Object} params - (optional) parameters:
     *  - {Function} successCallback - The callback which will be called when operation is successful.
     * This callback function is passed a single boolean parameter which is TRUE if camera is present and authorized for use.
     *  - {Function} errorCallback -  The callback which will be called when operation encounters an error.
     * This callback function is passed a single string parameter containing the error message.
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
     * @param {Function} successCallback - The callback which will be called when operation is successful.
     * This callback function is passed a single boolean parameter which is TRUE if camera is present
     * @param {Function} errorCallback -  The callback which will be called when operation encounters an error.
     * This callback function is passed a single string parameter containing the error message.
     */
    Access.isCameraPresent = function(successCallback, errorCallback) {
        if(cordova.plugins.access.camera){
            cordova.plugins.access.camera.isCameraPresent.apply(this, arguments);
        }else{
            throw "Access Camera module is not installed";
        }
    };


    /**
     * Checks if the application is authorized to use the camera.
     *
     * @param {Object} params - (optional) parameters:
     *  - {Function} successCallback - The callback which will be called when operation is successful.
     * This callback function is passed a single boolean parameter which is TRUE if camera is authorized for use.
     *   - {Function} errorCallback -  The callback which will be called when operation encounters an error.
     * This callback function is passed a single string parameter containing the error message.
     */
    Access.isCameraAuthorized = function(params) {
        if(cordova.plugins.access.camera){
            cordova.plugins.access.camera.isCameraAuthorized.apply(this, arguments);
        }else{
            throw "Access Camera module is not installed";
        }
    };

    /**
     * Returns the camera authorization status for the application.
     *
     * @param {Object} params - (optional) parameters:
     *  - {Function} successCallback - The callback which will be called when operation is successful.
     * This callback function is passed a single string parameter which indicates the authorization status as a constant in `cordova.plugins.access.permissionStatus`.
     *  - {Function} errorCallback -  The callback which will be called when operation encounters an error.
     * This callback function is passed a single string parameter containing the error message.
     */
    Access.getCameraAuthorizationStatus = function(params) {
        if(cordova.plugins.access.camera){
            cordova.plugins.access.camera.getCameraAuthorizationStatus.apply(this, arguments);
        }else{
            throw "Access Camera module is not installed";
        }
    };

    /**
     * Requests camera authorization for the application.
     * Should only be called if authorization status is NOT_REQUESTED. Calling it when in any other state will have no effect.
     *
     * @param {Object} params - (optional) parameters:
     * - {Function} successCallback - The callback which will be called when operation is successful.
     * This callback function is passed a single string parameter indicating whether access to the camera was granted or denied:
     * `cordova.plugins.access.permissionStatus.GRANTED` or `cordova.plugins.access.permissionStatus.DENIED`
     * - {Function} errorCallback -  The callback which will be called when operation encounters an error.
     * This callback function is passed a single string parameter containing the error message.
     */
    Access.requestCameraAuthorization = function(params){
        if(cordova.plugins.access.camera){
            cordova.plugins.access.camera.requestCameraAuthorization.apply(this, arguments);
        }else{
            throw "Access Camera module is not installed";
        }
    };

    /**
     * Checks if the application is authorized to use the Camera Roll in Photos app.
     *
     * @param {Function} successCallback - The callback which will be called when operation is successful.
     * This callback function is passed a single boolean parameter which is TRUE if access to Camera Roll is authorized.
     * @param {Function} errorCallback -  The callback which will be called when operation encounters an error.
     * This callback function is passed a single string parameter containing the error message.
     */
    Access.isCameraRollAuthorized = function(successCallback, errorCallback) {
        if(cordova.plugins.access.camera){
            cordova.plugins.access.camera.isCameraRollAuthorized.apply(this, arguments);
        }else{
            throw "Access Camera module is not installed";
        }
    };

    /**
     * Returns the authorization status for the application to use the Camera Roll in Photos app.
     *
     * @param {Function} successCallback - The callback which will be called when operation is successful.
     * This callback function is passed a single string parameter which indicates the authorization status as a constant in `cordova.plugins.access.permissionStatus`.
     * @param {Function} errorCallback -  The callback which will be called when operation encounters an error.
     * This callback function is passed a single string parameter containing the error message.
     */
    Access.getCameraRollAuthorizationStatus = function(successCallback, errorCallback) {
        if(cordova.plugins.access.camera){
            cordova.plugins.access.camera.getCameraRollAuthorizationStatus.apply(this, arguments);
        }else{
            throw "Access Camera module is not installed";
        }
    };

    /**
     * Requests camera roll authorization for the application.
     * Should only be called if authorization status is NOT_REQUESTED. Calling it when in any other state will have no effect.
     *
     * @param {Function} successCallback - The callback which will be called when operation is successful.
     * This callback function is passed a single string parameter indicating the new authorization status:
     * `cordova.plugins.access.permissionStatus.GRANTED` or `cordova.plugins.access.permissionStatus.DENIED`
     * @param {Function} errorCallback -  The callback which will be called when operation encounters an error.
     * This callback function is passed a single string parameter containing the error message.
     */
    Access.requestCameraRollAuthorization = function(successCallback, errorCallback) {
        if(cordova.plugins.access.camera){
            cordova.plugins.access.camera.requestCameraRollAuthorization.apply(this, arguments);
        }else{
            throw "Access Camera module is not installed";
        }
    };

    return Access;
})();
module.exports = Access;
