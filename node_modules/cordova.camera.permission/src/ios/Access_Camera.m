/*
 *  Access_Camera.m
 *  Access Plugin - Camera Module
 *
 */

#import "Access_Camera.h"


@implementation Access_Camera

// Internal reference to Access singleton instance
static Access* cameraAccess;

// Internal constants
static NSString*const LOG_TAG = @"Access_Camera[native]";

- (void)pluginInitialize {
    
    [super pluginInitialize];

    cameraAccess = [Access getInstance];
}

/********************************/
#pragma mark - Plugin API
/********************************/

- (void) isCameraAvailable: (CDVInvokedUrlCommand*)command
{
    [self.commandDelegate runInBackground:^{
        @try {
            [cameraAccess sendPluginResultBool:[self isCameraPresent] && [self isCameraAuthorized] :command];
        }
        @catch (NSException *exception) {
            [cameraAccess handlePluginException:exception :command];
        }
    }];
}

- (void) isCameraPresent: (CDVInvokedUrlCommand*)command
{
    [self.commandDelegate runInBackground:^{
        @try {
            [cameraAccess sendPluginResultBool:[self isCameraPresent] :command];
        }
        @catch (NSException *exception) {
            [cameraAccess handlePluginException:exception :command];
        }
    }];
}

- (void) isCameraAuthorized: (CDVInvokedUrlCommand*)command
{
    [self.commandDelegate runInBackground:^{
        @try {
            [cameraAccess sendPluginResultBool:[self isCameraAuthorized] :command];
        }
        @catch (NSException *exception) {
            [cameraAccess handlePluginException:exception :command];
        }
    }];
}

- (void) getCameraAuthorizationStatus: (CDVInvokedUrlCommand*)command
{
    [self.commandDelegate runInBackground:^{
        @try {
            NSString* status;
            AVAuthorizationStatus authStatus = [AVCaptureDevice authorizationStatusForMediaType:AVMediaTypeVideo];

            if(authStatus == AVAuthorizationStatusDenied || authStatus == AVAuthorizationStatusRestricted){
                status = AUTHORIZATION_DENIED;
            }else if(authStatus == AVAuthorizationStatusNotDetermined){
                status = AUTHORIZATION_NOT_DETERMINED;
            }else if(authStatus == AVAuthorizationStatusAuthorized){
                status = AUTHORIZATION_GRANTED;
            }
            [cameraAccess logDebug:[NSString stringWithFormat:@"Camera authorization status is: %@", status]];
            [cameraAccess sendPluginResultString:status:command];
        }
        @catch (NSException *exception) {
            [cameraAccess handlePluginException:exception :command];
        }
    }];
}

- (void) requestCameraAuthorization: (CDVInvokedUrlCommand*)command
{
    [self.commandDelegate runInBackground:^{
        @try {
            [AVCaptureDevice requestAccessForMediaType:AVMediaTypeVideo completionHandler:^(BOOL granted) {
                [cameraAccess sendPluginResultBool:granted :command];
            }];
        }
        @catch (NSException *exception) {
            [cameraAccess handlePluginException:exception :command];
        }
    }];
}

- (void) isCameraRollAuthorized: (CDVInvokedUrlCommand*)command
{
    [self.commandDelegate runInBackground:^{
        @try {
            [cameraAccess sendPluginResultBool:[[self getCameraRollAuthorizationStatus]  isEqual: AUTHORIZATION_GRANTED] :command];
        }
        @catch (NSException *exception) {
            [cameraAccess handlePluginException:exception :command];
        }
    }];
}

- (void) getCameraRollAuthorizationStatus: (CDVInvokedUrlCommand*)command
{
    [self.commandDelegate runInBackground:^{
        @try {
            NSString* status = [self getCameraRollAuthorizationStatus];
            [cameraAccess logDebug:[NSString stringWithFormat:@"Camera Roll authorization status is: %@", status]];
            [cameraAccess sendPluginResultString:status:command];
        }
        @catch (NSException *exception) {
            [cameraAccess handlePluginException:exception :command];
        }
    }];
}

- (void) requestCameraRollAuthorization: (CDVInvokedUrlCommand*)command
{
    [self.commandDelegate runInBackground:^{
        @try {
            [PHPhotoLibrary requestAuthorization:^(PHAuthorizationStatus authStatus) {
                NSString* status = [self getCameraRollAuthorizationStatusAsString:authStatus];
                [cameraAccess sendPluginResultString:status:command];
            }];
        }
        @catch (NSException *exception) {
            [cameraAccess handlePluginException:exception :command];
        }
    }];
}


/********************************/
#pragma mark - Internals
/********************************/

- (BOOL) isCameraPresent
{
    BOOL cameraAvailable =
    [UIImagePickerController
     isSourceTypeAvailable:UIImagePickerControllerSourceTypeCamera];
    if(cameraAvailable) {
        [cameraAccess logDebug:@"Camera available"];
        return true;
    }
    else {
        [cameraAccess logDebug:@"Camera unavailable"];
        return false;
    }
}

- (BOOL) isCameraAuthorized
{
    AVAuthorizationStatus authStatus = [AVCaptureDevice authorizationStatusForMediaType:AVMediaTypeVideo];
    if(authStatus == AVAuthorizationStatusAuthorized) {
        return true;
    } else {
        return false;
    }
}

- (NSString*) getCameraRollAuthorizationStatus
{
    PHAuthorizationStatus authStatus = [PHPhotoLibrary authorizationStatus];
    return [self getCameraRollAuthorizationStatusAsString:authStatus];

}

- (NSString*) getCameraRollAuthorizationStatusAsString: (PHAuthorizationStatus)authStatus
{
    NSString* status;
    if(authStatus == PHAuthorizationStatusDenied || authStatus == PHAuthorizationStatusRestricted){
        status = AUTHORIZATION_DENIED;
    }else if(authStatus == PHAuthorizationStatusNotDetermined ){
        status = AUTHORIZATION_NOT_DETERMINED;
    }else if(authStatus == PHAuthorizationStatusAuthorized){
        status = AUTHORIZATION_GRANTED;
    }
    return status;
}
@end
