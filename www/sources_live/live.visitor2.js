
	function visitorInit(){
		var channel;
			
			
			// for development
			fm.liveswitch.Log.setLogLevel(fm.liveswitch.LogLevel.Debug);
			  
			// for production
			//fm.liveswitch.Log.setLogLevel(fm.liveswitch.LogLevel.None);
			
			//Register a provider
			fm.liveswitch.Log.registerProvider(new fm.liveswitch.ConsoleLogProvider(fm.liveswitch.LogLevel.Debug));


			//Connection to the Channel
			var applicationId = "b73a1830-0808-407b-bd22-e72d7b8b18b6";
			var userId = "User Visitor Name";
			var userAlias = "User-visitor-alias";
			var deviceId = "02020202-0202-0202-020202020202";
			var channelId = "11111111-1111-1111-1111-111111111111";
			var channel;
			let liveswitch = fm.liveswitch;
			let layoutManager = new liveswitch.DomLayoutManager($('#video')[0]);
	  
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
			
			//Chat content
			var sendButton = document.getElementById('sendButton');
			var sendInput = document.getElementById('sendInput');
			var chatContent = document.getElementById('chatContent');
			
			//Fullscreen variables
			var icon = document.getElementById('fullscreen-icon')
			var video = document.getElementById('video');
			
			
			
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
			
			var audio = true;
			var video = {
				facingMode: 'user' // use the front camera
			};
			var screen = false;
			let localMedia = new liveswitch.LocalMedia(audio, video, screen);*/
			//let localMedia = new liveswitch.LocalMedia(true, true);



			//Add Canvas to the page
			//var canvas = document.getElementById('videoCanvas');
			/*var canvasFrameRate = 3;
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
			//}*/
			var LocalMediaAudio = true;
			var LocalMediaVideo = true;
			var localMedia = new fm.liveswitch.LocalMedia(LocalMediaAudio, LocalMediaVideo);
/*console.log("Canvas creation OK");
console.log(canvas);*/

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

				channel = channels[0];
console.log("connected to channel: " + channel);
			
				
				//Create the content (receive)
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

				//Trigger on the channel if a message was add !
				channel.addOnMessage(function (client, message) {
					if (incomingMessage == null)
						return;
					//var n = client.getUserAlias() != null ? client.getUserAlias() : client.getUserId();
					var n = client.getUserId();
					incomingMessage(n, message);
				});	

				//Write a message that the user has joined the channel
				writeMessage('<b>Vous avez rejoint la conférence n° ' + channel.getId() + ' en tant que ' + userId + '.</b>');
				
				//Add a trigger when a user Leave or Join
				addTriggerOnUserJoinAndLeave();
			
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
		
			localMedia.start().then(function(lm){
				console.log("media capture started");
			}).fail(function(ex) {
				console.log(ex.message);
			});
			
		
			//Disconnect a user
			$("#userDisconnectBtn").click(function(){
				client.unregister().then(function(result){
					console.log("unregistration succeeded");
				}).fail(function(ex){
					console.log("unregistration failed");
				});
			});
			
			//Disconnect a user
			$("#userDisconnectBtn").click(function(){
				client.unregister().then(function(result){
					//stop();
					console.log("unregistration succeeded");
				}).fail(function(ex){
					console.log("unregistration failed");
				});
			});
								
			//Clear everything before unload the page
			$(window).on('beforeunload', () => {
				client.unregister();
				layoutManager.unsetLocalView();
				localMedia.stop();
			});
			
			//Function that we have to close specific elements after the chat is finished
			var stop = function () {
				// Stop the local media.
				//fm.liveswitch.Log.info('Stopping local media...');
				//localMedia.stop();
			};
						
			//Send message when the user Join or Leave !
			var addTriggerOnUserJoinAndLeave = function () {
				//Send message when the user Join !
				channel.addOnRemoteClientJoin(function (remoteClientInfo) {
					fm.liveswitch.Log.info('Remote client joined the channel (client ID: ' +
						remoteClientInfo.getId() + ', device ID: ' + remoteClientInfo.getDeviceId() +
						', user ID: ' + remoteClientInfo.getUserId() + ', tag: ' + remoteClientInfo.getTag() + ').');
					//var n = remoteClientInfo.getUserAlias() != null ? remoteClientInfo.getUserAlias() : remoteClientInfo.getUserId();
					var n = remoteClientInfo.getUserId();				
					peerJoined(n);
				});
				
				//Send message when the user Leave !
				channel.addOnRemoteClientLeave(function (remoteClientInfo) {
					//var n = remoteClientInfo.getUserAlias() != null ? remoteClientInfo.getUserAlias() : remoteClientInfo.getUserId();
					var n = remoteClientInfo.getUserId();
					peerLeft(n);
					fm.liveswitch.Log.info('Remote client left the channel (client ID: ' + remoteClientInfo.getId() +
						', device ID: ' + remoteClientInfo.getDeviceId() + ', user ID: ' + remoteClientInfo.getUserId() +
						', tag: ' + remoteClientInfo.getTag() + ').');
				});
			}
			
			//Function that send Message
			var sendMessage = function (content) {
				//If content is defined that mean we forced the sent value
				if(typeof content!='undefined'){
					channel.sendMessage(msg);
				}else{
					var msg = sendInput.value;
					sendInput.value = '';
					if (msg != '') {
						channel.sendMessage(msg);
					}
				}				
			};
			
			//Function to write a message
			var incomingMessage = function (name, message) {
				writeMessage('<b>' + name + ':</b> ' + message);
			};
			
			//Someone left the channel
			var peerLeft = function (name, string) {
				writeMessage('<font color="red">* <b>' + name + '</b> a quitté la conférence !</font>')
			};

			//Someone joined the channel
			var peerJoined = function (name, string) {
				writeMessage('<font color="green">* <b>' + name + '</b> a rejoint la conférence !</font>');
			};

			//Write a message in the chatContainer
			var writeMessage = function (msg) {
				var content = document.createElement('p');
				content.innerHTML = msg;
				chatContent.appendChild(content);
				chatContent.scrollTop = chatContent.scrollHeight;
			};
			
			//Add Observers
			fm.liveswitch.Util.observe(sendInput, 'keydown', function (evt) {
				// Treat Enter as button click.
				var charCode = (evt.which) ? evt.which : evt.keyCode;
				if (charCode == 13) {
					sendMessage();
					return false;
				}
			});
			fm.liveswitch.Util.observe(sendButton, 'click', function (evt) {
				sendMessage();
			});
			/*fm.liveswitch.Util.observe(leaveButton, 'click', function (evt) {
				stop();
			});*/
			fm.liveswitch.Util.observe(window, 'beforeunload', function (evt) {
				stop();
			});	

			//FullScreen Trigger and functions
			$("#fullscreenBtn").click(function(){
				//Check the status of the icon
				if(icon.classList.contains('fa-expand')){
					enterFullScreen();
				}else{
					exitFullScreen();
				}
			});			
			
			// Put video element into fullscreen.
			var enterFullScreen = function(){
				if(video.requestFullscreen){
					video.requestFullscreen();
				}else if(video.mozRequestFullScreen){
					video.mozRequestFullScreen();
				}else if(video.webkitRequestFullscreen){
					video.webkitRequestFullscreen();
				}else if(video.msRequestFullscreen){
					video.msRequestFullscreen();
				}else{
console.log(video);
					// Add "fake" fullscreen via CSS.
					icon.classList.remove('fa-expand');
					icon.classList.add('fa-compress');
					video.classList.add('fs-fallback');
				}
			};
			// Take doc out of fullscreen.
			var exitFullScreen = function(){
				if(document.exitFullscreen){
					document.exitFullscreen();
				}else if(document.mozCancelFullScreen){
					document.mozCancelFullScreen();
				}else if(document.webkitExitFullscreen){
					document.webkitExitFullscreen();
				}else if(document.msExitFullscreen){
					document.msExitFullscreen();
				}else{
					// Remove "fake" CSS fullscreen.
					icon.classList.add('fa-expand');
					icon.classList.remove('fa-compress');
					video.classList.remove('fs-fallback');
				}
			};
			// Handle event: doc has entered/exited fullscreen. 
			var fullscreenChange = function () {
				var fullscreenElement = document.fullscreenElement ||
					document.mozFullScreenElement ||
					document.webkitFullscreenElement ||
					document.msFullscreenElement;
				if (fullscreenElement) {
					icon.classList.remove('fa-expand');
					icon.classList.add('fa-compress');
				}else{
					icon.classList.add('fa-expand');
					icon.classList.remove('fa-compress');
				}
			};
			
			//Add Triggers on FullScreen change
			// Register for handling fullscreen change event.
			fm.liveswitch.Util.observe(document, 'fullscreenchange', function (evt) { fullscreenChange(); });
			fm.liveswitch.Util.observe(document, 'webkitfullscreenchange', function (evt) { fullscreenChange(); });
			fm.liveswitch.Util.observe(document, 'mozfullscreenchange', function (evt) { fullscreenChange(); });
			fm.liveswitch.Util.observe(document, 'msfullscreenchange', function (evt) { fullscreenChange(); });
			
		
	}