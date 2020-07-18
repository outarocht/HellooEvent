/* globals cordova, require, exports, module */

/**
 *  Access Camera plugin for iOS
 *
 **/
var Access_Camera = (function(){
    /***********************
     *
     * Internal properties
     *
     *********************/
    var Access_Camera = {};

    var Access = require("cordova.plugins.access.Access");

    /********************
     *
     * Public properties
     *
     ********************/
    
    /********************
     *
     * Internal functions
     *
     ********************/

    function mapFromLegacyCameraApi() {
        var params;
        if (typeof arguments[0]  === "function") {
            params = (arguments.length > 2 && typeof arguments[2]  === "object") ? arguments[2] : {};
            params.successCallback = arguments[0];
            if(arguments.length > 1 && typeof arguments[1]  === "function") {
                params.errorCallback = arguments[1];
            }
        }else { // if (typeof arguments[0]  === "object")
            params = arguments[0];
        }
        return params;
    }

    /*****************************
     *
     * Protected member functions
     *
     ****************************/


    /**********************
     *
     * Public API functions
     *
     **********************/

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
    Access_Camera.isCameraAvailable = function(params) {
        params = mapFromLegacyCameraApi.apply(this, arguments);

        params.successCallback = params.successCallback || function(){};
        return cordova.exec(Access._ensureBoolean(params.successCallback),
            params.errorCallback,
            'Access_Camera',
            'isCameraAvailable',
            []);
    };

    /**
     * Checks if camera hardware is present on device.
     *
     * @param {Function} successCallback - The callback which will be called when operation is successful.
     * This callback function is passed a single boolean parameter which is TRUE if camera is present
     * @param {Function} errorCallback -  The callback which will be called when operation encounters an error.
     * This callback function is passed a single string parameter containing the error message.
     */
    Accessc_Camera.isCameraPresent = function(successCallback, errorCallback) {
        return cordova.exec(Access._ensureBoolean(successCallback),
            errorCallback,
            'Access_Camera',
            'isCameraPresent',
            []);
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
    Access_Camera.isCameraAuthorized = function(params) {
        params = mapFromLegacyCameraApi.apply(this, arguments);

        return cordova.exec(Access._ensureBoolean(params.successCallback),
            params.errorCallback,
            'Access_Camera',
            'isCameraAuthorized',
            []);
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
    Access_Camera.getCameraAuthorizationStatus = function(params) {
        params = mapFromLegacyCameraApi.apply(this, arguments);

        return cordova.exec(params.successCallback,
            params.errorCallback,
            'Access_Camera',
            'getCameraAuthorizationStatus',
            []);
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
    Access_Camera.requestCameraAuthorization = function(params){
        params = mapFromLegacyCameraApi.apply(this, arguments);

        params.successCallback = params.successCallback || function(){};
        return cordova.exec(function(isGranted){
                params.successCallback(isGranted ? Access.permissionStatus.GRANTED : Access.permissionStatus.DENIED);
            },
            params.errorCallback,
            'Access_Camera',
            'requestCameraAuthorization',
            []);
    };

    /**
     * Checks if the application is authorized to use the Camera Roll in Photos app.
     *
     * @param {Function} successCallback - The callback which will be called when operation is successful.
     * This callback function is passed a single boolean parameter which is TRUE if access to Camera Roll is authorized.
     * @param {Function} errorCallback -  The callback which will be called when operation encounters an error.
     * This callback function is passed a single string parameter containing the error message.
     */
    Access_Camera.isCameraRollAuthorized = function(successCallback, errorCallback) {
        return cordova.exec(Access._ensureBoolean(successCallback),
            errorCallback,
            'Access_Camera',
            'isCameraRollAuthorized',
            []);
    };

    /**
     * Returns the authorization status for the application to use the Camera Roll in Photos app.
     *
     * @param {Function} successCallback - The callback which will be called when operation is successful.
     * This callback function is passed a single string parameter which indicates the authorization status as a constant in `cordova.plugins.access.permissionStatus`.
     * @param {Function} errorCallback -  The callback which will be called when operation encounters an error.
     * This callback function is passed a single string parameter containing the error message.
     */
    Access_Camera.getCameraRollAuthorizationStatus = function(successCallback, errorCallback) {
        return cordova.exec(successCallback,
            errorCallback,
            'Access_Camera',
            'getCameraRollAuthorizationStatus',
            []);
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
    Access_Camera.requestCameraRollAuthorization = function(successCallback, errorCallback) {
        return cordova.exec(function(status){
                successCallback(status == "authorized" ? Access.permissionStatus.GRANTED : Access.permissionStatus.DENIED);
            },
            errorCallback,
            'Access_Camera',
            'requestCameraRollAuthorization',
            []);
    };

    return Access_Camera;
});
module.exports = new Access_Camera();