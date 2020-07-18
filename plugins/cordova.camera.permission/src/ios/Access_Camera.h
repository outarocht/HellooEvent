/*
 *  Access_Camera.h
 *  Access Plugin - Camera Module
 *
 */

#import <Cordova/CDV.h>
#import <Cordova/CDVPlugin.h>
#import "Access.h"

#import <AVFoundation/AVFoundation.h>
#import <Photos/Photos.h>


@interface Access_Camera : CDVPlugin

- (void) isCameraAvailable: (CDVInvokedUrlCommand*)command;
- (void) isCameraPresent: (CDVInvokedUrlCommand*)command;
- (void) isCameraAuthorized: (CDVInvokedUrlCommand*)command;
- (void) getCameraAuthorizationStatus: (CDVInvokedUrlCommand*)command;
- (void) requestCameraAuthorization: (CDVInvokedUrlCommand*)command;
- (void) isCameraRollAuthorized: (CDVInvokedUrlCommand*)command;
- (void) getCameraRollAuthorizationStatus: (CDVInvokedUrlCommand*)command;

@end
