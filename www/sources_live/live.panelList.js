$( document ).ready(function() {
			//var app;
			var channel;
		
			//Library Loader
			/*fm.liveswitch.Util.addOnLoad(() => {	
				//Create new App.
				app = new chat.App(document.getElementById('ApplicationLog'));
				window.App = app;			
			});*/
				
				
			// for development
			fm.liveswitch.Log.setLogLevel(fm.liveswitch.LogLevel.Debug);
			  
			// for production
			//fm.liveswitch.Log.setLogLevel(fm.liveswitch.LogLevel.None);
			
			//Register a provider
			fm.liveswitch.Log.registerProvider(new fm.liveswitch.ConsoleLogProvider(fm.liveswitch.LogLevel.Debug));
			var name =  sessionStorage.getItem("fulleName");
			var idMeeting =  sessionStorage.getItem("idMetting");
			
			//Connection to the Channel
			var applicationId = "b73a1830-0808-407b-bd22-e72d7b8b18b6";
			var userId = name;
			var userAlias = "User-presentator-alias";
			var deviceId = "01010101-0101-0101-010101010101";
			var channelId = idMeeting;
			let liveswitch = fm.liveswitch;
			let layoutManager = new liveswitch.DomLayoutManager($('#video')[0]);
			
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
			
			//let localMedia = new liveswitch.LocalMedia(true, true, true);
			let localMedia = new liveswitch.LocalMedia(true, true);
			let remoteMedia;


			
			//audio.AudioTrack.Volume = .9;
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
				channel = channels[0];			
				
				//Create MCU
				remoteMedia = new liveswitch.RemoteMedia();
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
				
							
			
				//Refresh the number of the connected users
				channel.addOnMcuVideoLayout(function(videoLayout) {
					this.videoLayout  = videoLayout;
					if (layoutManager != null) {
						layoutManager.layout();
					}
				});
				
				//Start the chat
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
				
				//Add a trigger on the clients connections !
				addTriggerOnClientsStats();
										
			}).fail(function(ex) {
				console.log("registration failed");
			});
			
var layoutManagerLocal = new fm.liveswitch.DomLayoutManager(document.getElementById("video"));
layoutManagerLocal.setLocalView(localMedia.getView());


				
				
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

			//Copy of the videos cameras objects to use it in the Jquery Onchange
			var videosCamerasObjectCopy;
			
			//Flip Camera Button
			$("#cameraFlipBtn").click(function(){
				//Change the flag
				flagVideosList = "cameraFlipBtn";
				//Read The local medial and populate the list else show the error
				localMedia.getVideoSourceInputs().then(getVideoSourceListAndBuildTheList);//.catch(errorAccessVideos);
			});
			
			function getVideoSourceListAndBuildTheList(localMediaVideosObject){
				$('#listCamera').html('');
				//Clear the actual videos cameras list
				$('#cameraFlipListSelect').empty();
				//Remove the trigger onchange on select list
				$("#cameraFlipListSelect").unbind( "change");
				
				//Save the Copy of the Videos Cameras Object
				videosCamerasObjectCopy = localMediaVideosObject;
				
				//Build the cameras videos list items
				var ii = 1;
				
				localMediaVideosObject.forEach(function(item){
					if(ii == 1){
						$('#cameraFlipListSelect').append('<option value="'+item._id+'" selected>Caméra : '+ii+'</option>');
						// $('#listCamera').append('<div><input type="radio" name="cameraList" value="'+item._id+'"  /> Caméra '+ii+' </div>');
					}else{
						$('#cameraFlipListSelect').append('<option value="'+item._id+'">Caméra : '+ii+'</option>');
						// $('#listCamera').append('<div><input type="radio" name="cameraList" value="'+item._id+'" /> Caméra '+ii+' </div>');
					}
					ii++;
					
				});
				//Add the listner on select list change
				//change
				$("#cameraFlipListSelect").change(function(){
				// $("input[@name='cameraList']").change(function(){
					
					var oldValue = this.defaultValue;
					var newValue = this.value;
					alert(newValue);
					//if(oldValue!=newValue){
						//We have to loop on the Videos "cameras" List and change the localMedia Object !
						videosCamerasObjectCopy.forEach(function(item){
							if(newValue==item._id){
								localMedia.stop().then(function(){
									localMedia.changeVideoSourceInput(item).then(function () {
										localMedia.start().then(function () {
											// Remember to set your sinks and view up again
											// because the stop function cleaned them up.
											var localVideoTrack = app.localMedia.getVideoTrack();
											var localVideoSink = new fm.liveswitch.DomVideoSink(localVideoTrack);
											app.layoutManager.setLocalView(localVideoSink.getView());
										});
									});
								});
								return false;
							}
						});
					//}
				});
			}
			

			//Track video size
			/*localMedia.OnVideoSize += (size) =>
			{
				var width = size.Width;
				var height = size.Height;
				console.log(size);
			};
			//Track Audio size
			localMedia.OnAudioLevel += (level) =>
			{
				// level ranges from 0.0-1.0
				console.log(level);
			};*/

			//Capture localMedia
			localMedia.start().then(function(lm){
				console.log("media capture started");				
			}).fail(function(ex) {
				console.log(ex.message);
			});
		
			//Disconnect a user
			$("#userDisconnectBtn").click(function(){
				client.unregister().then(function(result){
					stop();
					window.location.href = "./dashbord.html";
					
				}).fail(function(ex){
					
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
				fm.liveswitch.Log.info('Stopping local media...');
				localMedia.stop();
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
					
					//Call the trigger to refresh the number of connected users
					addTriggerOnClientsStats();
				});
				
				//Send message when the user Leave !
				channel.addOnRemoteClientLeave(function (remoteClientInfo) {
					//var n = remoteClientInfo.getUserAlias() != null ? remoteClientInfo.getUserAlias() : remoteClientInfo.getUserId();
					var n = remoteClientInfo.getUserId();
					peerLeft(n);
					fm.liveswitch.Log.info('Remote client left the channel (client ID: ' + remoteClientInfo.getId() +
						', device ID: ' + remoteClientInfo.getDeviceId() + ', user ID: ' + remoteClientInfo.getUserId() +
						', tag: ' + remoteClientInfo.getTag() + ').');
				
					//Call the trigger to refresh the number of connected users
					addTriggerOnClientsStats();
				});
			}
			
			//Function that load the connected users
			var addTriggerOnClientsStats = function(){
				//Update the list 
				var connectedUsersCount = channel.getRemoteClientInfos().length;
				$("#connectedUsersContainerStatsContainer .stats").text(connectedUsersCount);
				var statsPlurial = "";
				if(connectedUsersCount>1){
					statsPlurial = "s";
				}
				$("#connectedUsersContainerStatsContainer .text").text("utilisateur"+statsPlurial+" connecté"+statsPlurial);
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
			/*fm.liveswitch.Util.observe(toggleAudioMute, 'click', function (evt) {
				var muted = app.toggleAudioMute();
				toggleAudioMute.getElementsByTagName('i')[0].className = 'fa fa-lg ' + (muted ? 'fa-microphone-slash' : 'fa-microphone');
			});
			fm.liveswitch.Util.observe(toggleVideoMute, 'click', function (evt) {
				var muted = app.toggleVideoMute();
				toggleVideoMute.style.backgroundImage = muted ? 'url(images/no-cam.png)' : 'url(images/cam.png)';
			});*/
			
			
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
			
		});