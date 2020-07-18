
		$( document ).ready(function() {
			
			
		// for development
		fm.liveswitch.Log.setLogLevel(fm.liveswitch.LogLevel.Debug);
		  
		// for production
		//fm.liveswitch.Log.setLogLevel(fm.liveswitch.LogLevel.None);
		
		//Register a provider
		fm.liveswitch.Log.registerProvider(new fm.liveswitch.ConsoleLogProvider(fm.liveswitch.LogLevel.Debug));


			//Connection to the Channel
			var applicationId = "b73a1830-0808-407b-bd22-e72d7b8b18b6";
			var userId = "User Presentator Name";
			var userAlias = "User-presentator-alias";
			var deviceId = "01010101-0101-0101-010101010101";
			var channelId = "11111111-1111-1111-1111-111111111111";
			var channel;
			let liveswitch = fm.liveswitch;
			let layoutManager = new liveswitch.DomLayoutManager($('#video')[0]);
			//Handling local Media
			var audio = {
				sampleSize: 16,
				channelCount: 2,
				echoCancellation: false
			};
			/*var video = {
				width: 320,
				height: 240,
				frameRate: 30
			};*/
			
			var audio = true;
			var video = {
				facingMode: 'user' // use the front camera
			};
			var screen = false;
			let localMedia = new liveswitch.LocalMedia(true, true);
			//let localMedia = new liveswitch.LocalMedia(audio, video, screen);
			
			//audio.AudioTrack.Volume = .9;
console.log(localMedia);
			//localMedia.AudioTrack.Gain = .5;
			
	  
			var client = new fm.liveswitch.Client("https://cloud.liveswitch.io/", applicationId, userId, deviceId, null, ["role1", "role2"]);
			//Set User Alias
			client.setUserAlias(userAlias);
			
			var token = fm.liveswitch.Token.generateClientRegisterToken(
				applicationId,
				client.getUserId(),
				client.getDeviceId(),
				client.getId(),
				client.getRoles(),
				[new fm.liveswitch.ChannelClaim(channelId)],
				"c345c82b8ac74f86a1c06b820dfae5e3f591d37ed63b4ef985893c0b86745f5f"
			);



			//init the connection from the channel (when the user registred to the channel)
			//Check if the user's connected to the channel
			client.register(token).then(function(channels) {

				
				let channel = channels[0];
console.log(channel);
console.log("connected to channel: " + channels[0].getId());
			
				
				//Create MCU
				
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
				
				mcuConnection.open().then(function(result) {
					console.log("mixed connection established");
				}).fail(function(ex) {
					console.log("an error occurred");
				});


				$(remoteMedia.getView()).dblclick(() => {
					mcuConnection.close();
				});
				
				
	
console.log(localMedia);
			
			}).fail(function(ex) {
				console.log("registration failed");
			});
				
				
			//Handle FullScreen
			// Handle event: doc has entered/exited fullscreen. 
			var fullscreenChange = function () {
				var icon = document.getElementById('fullscreen-icon'), fullscreenElement = document.fullscreenElement ||
					document.mozFullScreenElement ||
					document.webkitFullscreenElement ||
					document.msFullscreenElement;
				if (fullscreenElement) {
					icon.classList.remove('fa-expand');
					icon.classList.add('fa-compress');
				}
				else {
					icon.classList.add('fa-expand');
					icon.classList.remove('fa-compress');
				}
			};

			//Flip Camera Button
			
		
			//Disconnect a user
			$("#userDisconnectBtn").click(function(){
				client.unregister().then(function(result){
					disconnect_live();
					console.log("unregistration succeeded");
				}).fail(function(ex){
					console.log("unregistration failed");
				});
			});
			
			//Capture localMedia
	localMedia.start().then(function(lm){
		console.log("media capture started");
	}).fail(function(ex) {
		console.log(ex.message);
	});
	
			
			$(window).on('beforeunload', () => {
				client.unregister();
				layoutManager.unsetLocalView();
				localMedia.stop();
			});
		
			
		});