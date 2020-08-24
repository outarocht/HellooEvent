	$( document ).ready(function() {
		    console.log( "ready!" );
			
			
		// for development
		fm.liveswitch.Log.setLogLevel(fm.liveswitch.LogLevel.Debug);
		  
		// for production
		//fm.liveswitch.Log.setLogLevel(fm.liveswitch.LogLevel.None);
		
		//Register a provider
		fm.liveswitch.Log.registerProvider(new fm.liveswitch.ConsoleLogProvider(fm.liveswitch.LogLevel.Debug));




			var name =  sessionStorage.getItem("fulleName");
			//Connection to the Channel
			var applicationId = "b73a1830-0808-407b-bd22-e72d7b8b18b6";
			var userId = name;
			var userAlias = "User-visitor-alias";
			var deviceId = "02020202-0202-0202-020202020202";
			var channelId = "11111111-1111-1111-1111-111111111111";
			var channel;
			let liveswitch = fm.liveswitch;

	  
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
			
			
			
			//Handling local Media
			/*var audio = {
				sampleSize: 16,
				channelCount: 2,
				echoCancellation: false
			};
			var video = {
				width: 320,
				height: 240,
				frameRate: 30
			};
			var localMedia = new fm.liveswitch.LocalMedia(audio, video);*/



			//Add Canvas to the page
			//var canvas = document.getElementById('videoCanvas');
			var canvasFrameRate = 3;
			//if (!canvas) {
				// Create the canvas if it doesn't exist yet.
				canvas = document.createElement('canvas');
				canvas.id = 'videoCanvas';
				canvas.style.position = 'absolute';
				document.body.appendChild(canvas);
				// Load a static image.
				var image = new Image();
				image.onload = function() {
					// Resize the canvas to match the image size.
					canvas.width = image.width;
					canvas.height = image.height;
					canvas.style.left = '-' + image.width + 'px';
					canvas.style.top = '-' + image.height + 'px';
					// Draw the initial image.
					var context = canvas.getContext('2d');
					context.drawImage(image, 0, 0, image.width, image.height, 0, 0, canvas.width, canvas.height);
					// Refresh the image on a regular interval.
					window.setInterval(function() {
						context.clearRect(0, 0, canvas.width, canvas.height);
						context.drawImage(image, 0, 0, image.width, image.height, 0, 0, canvas.width, canvas.height);
					}, 1000.0 / canvasFrameRate);
				};
				image.src = 'https://v1.liveswitch.fm/images/static.jpg';
			//}
			var audio = true;
			var video = true;
			var localMedia = new fm.liveswitch.LocalMedia(audio, video);
console.log("Canvas creation OK");
console.log(canvas);

			//Controlling Media Capture
			/*localMedia.start().then(function(lm) {
				console.log("media capture started");
			}).fail(function(ex) {
				console.log(ex.message);
			});*/


			//init the connection from the channel (when the user registred to the channel)



			//init the connection from the channel (when the user registred to the channel)
			//Check if the user's connected to the channel
			client.register(token).then(function(channels) {

				let layoutManager = new liveswitch.DomLayoutManager($('#video')[0]);
				let channel = channels[0];
console.log(channel);
console.log("connected to channel: " + channels[0].getId());
			
				
				//Create 
							

				var remoteMedia = new fm.liveswitch.RemoteMedia();
				var audioStream = new fm.liveswitch.AudioStream(null, remoteMedia);
				var videoStream = new fm.liveswitch.VideoStream(null, remoteMedia);
				console.log(channel);
				var connection = channel.createMcuConnection(audioStream, videoStream);
				layoutManager.addRemoteView(remoteMedia.getId(), remoteMedia.getView());
				connection.addOnStateChange((connection) => {
					if (connection.getState() == liveswitch.ConnectionState.Connected) {
						layoutManager.addRemoteView(remoteMedia.getId(), remoteMedia.getView());
					} else if (connection.getState() == liveswitch.ConnectionState.Failing ||
						connection.getState() == liveswitch.ConnectionState.Closing) {
						layoutManager.removeRemoteView(remoteMedia.getId());
					}
				});
				connection.open();						
				
			
			}).fail(function(ex) {
				console.log("registration failed");
			});

		
		
	localMedia.start().then(function(lm){
		console.log("media capture started");
	}).fail(function(ex) {
		console.log(ex.message);
	});
			
		
			//Disconnect a user
			$("#userDisconnectBtn").click(function(){
			//Close P2P
				/*clientconnection.close().then(function(result) {
					console.log("connection closed");
				}).fail(function(ex) {
					console.log("an error occurred");
				});*/

				client.unregister().then(function(result){
					console.log("unregistration succeeded");
				}).fail(function(ex){
					console.log("unregistration failed");
				});
			});
			
			
			
		});
	