
let liveswitch = fm.liveswitch;
 
liveswitch.Log.setProvider(new liveswitch.ConsoleLogProvider(liveswitch.LogLevel.Debug));
 
$('#register').click(() => {
 
    let appId = 'my-app-id';
    let client = new liveswitch.Client('http://localhost:8080/sync', appId);
    let layoutManager = new liveswitch.DomLayoutManager($('#videos')[0]);
    let localMedia = new liveswitch.LocalMedia(true, true);
 
    client.setUserAlias($('#name').val());
 
    // WARNING: DON'T DO THIS HERE. THE SHARED SECRET SHOULD
    // BE USED BY YOUR APP SERVER TO GENERATE THIS TOKEN
    let sharedSecret = '--replaceThisWithYourOwnSharedSecret--';
    let channelClaims = [
        new liveswitch.ChannelClaim('333333')
    ];
    let token = liveswitch.Token.generateClientRegisterToken(appId, client.getUserId(), client.getDeviceId(), client.getId(), client.getRoles(), channelClaims, sharedSecret);
 
    // register and join a channel at the same time
    client.register(token).then((channels) => {
        let channel = channels[0];
 
        let mcuButton = $('button');
        mcuButton.text('MCU');
        mcuButton.click(() => {
            let remoteMedia = new liveswitch.RemoteMedia();
            let audioStream = new liveswitch.AudioStream(localMedia, remoteMedia);
            let videoStream = new liveswitch.VideoStream(localMedia, remoteMedia);
            let mcuConnection = channel.createMcuConnection(audioStream, videoStream);
            mcuConnection.addOnStateChange((connection) => {
                if (mcuConnection.getState() == liveswitch.ConnectionState.Connected) {
                    layoutManager.addRemoteView(remoteMedia.getId(), remoteMedia.getView());
                } else if (mcuConnection.getState() == liveswitch.ConnectionState.Failing ||
                    mcuConnection.getState() == liveswitch.ConnectionState.Closing) {
                    layoutManager.removeRemoteView(remoteMedia.getId());
                }
            });
            mcuConnection.open();
            $(remoteMedia.getView()).dblclick(() => {
                mcuConnection.close();
            });
        });
        $('#participants').append(mcuButton);
 
        let upstreamButton = $('button');
        upstreamButton.text('SFU Upstream');
        upstreamButton.click(() => {
            let audioStream = new liveswitch.AudioStream(localMedia);
            let videoStream = new liveswitch.VideoStream(localMedia);
            let sfuUpstreamConnection = channel.createSfuUpstreamConnection(audioStream, videoStream);
            sfuUpstreamConnection.open();
            $(localMedia.getView()).dblclick(() => {
                sfuUpstreamConnection.close();
            });
        });
        $('#participants').append(upstreamButton);
 
        let addRemoteConnection = (remoteConnectionInfo: fm.liveswitch.ConnectionInfo) => {
            var clientDiv = $('#' + remoteConnectionInfo.getClientId());
            if (!clientDiv && remoteConnectionInfo.getClientId().indexOf('sip:') == 0) {
                clientDiv = $('#sip');
            }
            let connectionDiv = $('div');
            connectionDiv.attr('id', remoteConnectionInfo.getId());
            connectionDiv.text(remoteConnectionInfo.getId() + ' (' + remoteConnectionInfo.getClientId() + ')');
            let downstreamButton = $('button');
            downstreamButton.text('SFU Downstream');
            downstreamButton.click(() => {
                let remoteMedia = new liveswitch.RemoteMedia();
                let audioStream = new liveswitch.AudioStream(localMedia, remoteMedia);
                let videoStream = new liveswitch.VideoStream(localMedia, remoteMedia);
                let sfuDownstreamConnection = channel.createSfuDownstreamConnection(remoteConnectionInfo, audioStream, videoStream);
                sfuDownstreamConnection.addOnStateChange((connection) => {
                    if (sfuDownstreamConnection.getState() == liveswitch.ConnectionState.Connected) {
                        layoutManager.addRemoteView(remoteMedia.getId(), remoteMedia.getView());
                    } else if (sfuDownstreamConnection.getState() == liveswitch.ConnectionState.Failing ||
                        sfuDownstreamConnection.getState() == liveswitch.ConnectionState.Closing) {
                        layoutManager.removeRemoteView(remoteMedia.getId());
                    }
                });
                sfuDownstreamConnection.open();
                $(remoteMedia.getView()).dblclick(() => {
                    sfuDownstreamConnection.close();
                });
            });
            connectionDiv.append(downstreamButton);
            $('#participants').append(connectionDiv);
        };
 
        channel.addOnRemoteUpstreamConnectionOpen((remoteConnectionInfo) => {
            addRemoteConnection(remoteConnectionInfo);
        });
        channel.addOnRemoteUpstreamConnectionClose((remoteConnectionInfo) => {
            $('#' + remoteConnectionInfo.getId()).remove();
        });
        for (let remoteConnectionInfo of channel.getRemoteUpstreamConnectionInfos()) {
            addRemoteConnection(remoteConnectionInfo);
        }
 
        let addRemoteClient = (remoteClientInfo: fm.liveswitch.ClientInfo) => {
            let clientDiv = $('div');
            clientDiv.attr('id', remoteClientInfo.getId());
            clientDiv.text(remoteClientInfo.getUserAlias());
            let callButton = $('button');
            callButton.text('P2P Call');
            callButton.click(() => {
                let remoteMedia = new liveswitch.RemoteMedia();
                let audioStream = new liveswitch.AudioStream(localMedia, remoteMedia);
                let videoStream = new liveswitch.VideoStream(localMedia, remoteMedia);
                let peerConnection = channel.createPeerConnection(remoteClientInfo, audioStream, videoStream);
                peerConnection.addOnStateChange((connection) => {
                    if (peerConnection.getState() == liveswitch.ConnectionState.Connected) {
                        layoutManager.addRemoteView(remoteMedia.getId(), remoteMedia.getView());
                    } else if (peerConnection.getState() == liveswitch.ConnectionState.Failing ||
                        peerConnection.getState() == liveswitch.ConnectionState.Closing) {
                        layoutManager.removeRemoteView(remoteMedia.getId());
                    }
                });
                peerConnection.open();
                $(remoteMedia.getView()).dblclick(() => {
                    peerConnection.close();
                });
            });
            clientDiv.append(callButton);
            $('#participants').append(clientDiv);
        };
 
        channel.addOnRemoteClientJoin((remoteClientInfo) => {
            addRemoteClient(remoteClientInfo);
        });
        channel.addOnRemoteClientLeave((remoteClientInfo) => {
            $('#' + remoteClientInfo.getId()).remove();
        });
        for (let remoteClientInfo of channel.getRemoteClientInfos()) {
            addRemoteClient(remoteClientInfo);
        }
 
        channel.addOnPeerConnectionOffer((offer) => {
            if (confirm('Peer-connect to ' + offer.getRemoteClientInfo().getUserAlias() + '?')) {
                let remoteMedia = new liveswitch.RemoteMedia();
                let audioStream = new liveswitch.AudioStream(localMedia, remoteMedia);
                let videoStream = new liveswitch.VideoStream(localMedia, remoteMedia);
                let peerConnection = offer.accept(audioStream, videoStream);
                peerConnection.addOnStateChange((c) => {
                    if (peerConnection.getState() == liveswitch.ConnectionState.Connected) {
                        layoutManager.addRemoteView(remoteMedia.getId(), remoteMedia.getView());
                    } else if (peerConnection.getState() == liveswitch.ConnectionState.Failing ||
                        peerConnection.getState() == liveswitch.ConnectionState.Closing) {
                        layoutManager.removeRemoteView(remoteMedia.getId());
                    }
                });
                peerConnection.open();
                $(remoteMedia.getView()).dblclick(() => {
                    peerConnection.close();
                });
            } else {
                offer.reject();
            }
        });
 
        channel.addOnMessage((remoteClientInfo, message) => {
            console.log(message);
        });
    }, (ex) => {
        liveswitch.Log.error('Could not register.', ex);
    });
     
    localMedia.start().then((localMedia) => {
        layoutManager.setLocalView(localMedia.getView());
    }, (ex) => {
        liveswitch.Log.error('Could not start local media.', ex);
    });
     
    $(window).on('beforeunload', () => {
        client.unregister();
        layoutManager.unsetLocalView();
        localMedia.stop();
    });
});