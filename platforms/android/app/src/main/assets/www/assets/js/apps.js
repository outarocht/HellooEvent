function menuLeft(){
	var userConnected = sessionStorage.getItem("userConnected");
	
	var sendingData = {
	   action: "menuLeft",
	   userConnected: userConnected
	}  
	
	$.ajax({
		type: 'POST',
		url: 'https://hellooevent.com/partials/class.controller.php',	
		data: sendingData,
        dataType: 'json',
        success: function (data) {
			$("#menu-include").html(data.menuHtml);
        },
		
		error: function(XMLHttpRequest, textStatus, errorThrown) {
			alert('error: ' + JSON.stringify(XMLHttpRequest));
		}
		
     });
	 
}

function dashbordHtml(){
	var userConnected = sessionStorage.getItem("userConnected");
	
	var sendingData = {
	   action: "dashbordHtml",
	   userConnected: userConnected
	}
	 $.ajax({
		type: 'POST',
        async:false,
		url: 'https://hellooevent.com/partials/class.controller.php',		
		data: sendingData,
        dataType: 'json',
        success: function (data) {
			$("#dashbord-include").html(data.menuHtml);
        }
     });
}

$(document).ready(function(){
    $('#notification').change(function(){
		
    if($('#notification').val() == '0'){
	    var notif = 1;
    }else{
       var notif = 0;
    }
	
	var userConnected = sessionStorage.getItem("userConnected");
	var sendingData = {
	   action		: "changeNotif",
	   param		: notif,
	   userConnected: userConnected
	}	
	
	$.ajax({
		type: 'POST',
        async:false,
		url: 'https://hellooevent.com/partials/class.controller.php',		
		data: sendingData,
        dataType: 'html',
        success: function (data) {
			$(".msg_update").html('<div class="alert alert-success mb-1" role="alert"> A simple success alert—check it out!</div>');
			$(".msg_update").show('slow').delay(2000).fadeOut();
			settingHtml();
        }
     });	
		
    });
});

function settingHtml(){
	var userConnected = sessionStorage.getItem("userConnected");
	
	var sendingData = {
	   action: "settingHtml",
	   userConnected: userConnected
	}
	 $.ajax({
		type: 'POST',
        async:false,
		url: 'https://hellooevent.com/partials/class.controller.php',		
		data: sendingData,
        dataType: 'json',
        success: function (data) {
			$("#dashbord-include").html(data.menuHtml);
        }
     });
}


function login_user(){
	var userConnected = sessionStorage.getItem("userConnected");
	
	var sendingData = {
	   action	: "connexion",
	   email	: $("#email").val(),
	   password	: $("#password").val()
	}
	 $.ajax({
		type: 'POST',
        async:false,
		url: 'https://hellooevent.com/partials/class.controller.php',		
		data: sendingData,
        dataType: 'json',
        success: function (data) {
			if(data.returnLogin == "success"){
				sessionStorage.setItem("userConnected",data.idUser);
				window.location = "dashbord.html"; 
			}else{
				$('#msg-error').html('<div class="alert alert-danger" role="alert"> E-mail ou mot de passe non valide !</div>');
				$("#msg-error").show('slow').delay(2000).fadeOut();
			}
			
        }
     });
}

function logOut(){
	sessionStorage.setItem("userConnected","");
	window.location = "index.html";
}

function getUser(){
	var userConnected = sessionStorage.getItem("userConnected");
	
	var sendingData = {
	   action		: "getUser",
	   userConnected: userConnected
	}
	 $.ajax({
		type: 'POST',
        async:false,
		url: 'https://hellooevent.com/partials/class.controller.php',		
		data: sendingData,
        dataType: 'json',
        success: function (data) {
			$("#lastname").val(data.last_name);
			$("#firstname").val(data.first_name);
        }
     });
}

function update_full_name(){
	var userConnected = sessionStorage.getItem("userConnected");
	
	var sendingData = {
	   action		: "update_full_name",
	   lastname		: $("#lastname").val(),
	   firstname	: $("#firstname").val(),
	   userConnected: userConnected
	}
	 $.ajax({
		type: 'POST',
        async:false,
		url: 'https://hellooevent.com/partials/class.controller.php',		
		data: sendingData,
        dataType: 'html',
        success: function (data) {
			window.location.href = "./setting.html"; 
        }
     });
}

function check_metting(){
	var userConnected = sessionStorage.getItem("userConnected");
	var sendingData = {
	   action		: "check_metting",
	   userConnected: userConnected
	}
	
	$.ajax({
		type: 'POST',
        async:false,
		url: 'https://hellooevent.com/partials/class.controller.php',		
		data: sendingData,
        dataType: 'json',
        success: function (data) {
			$("#idMeeting").html(data.idMeeting);
			$("#idMeetingHidden").val(data.idMeeting);
	    }
     });
	
}

function send_invitation(){
	alert("send invitation");
}

function joindre_meeting(){
	var userConnected = sessionStorage.getItem("userConnected");
	var idMetting = $("#idMetting").val();
	
	var sendingData = {
	   action		: "joindre_meeting",
	   idMetting	: idMetting,
	   userConnected: userConnected
	}
	 $.ajax({
		type: 'POST',
        async:false,
		url: 'https://hellooevent.com/partials/class.controller.php',		
		data: sendingData,
        dataType: 'json',
        success: function (data) {
			
			if(data.return == 1){
				window.location.href = "./live_visitor.html"; 
			}
			if(data.return == 0){
				$('#msg-error').html('<div class="alert alert-danger" role="alert"> ID de réunion non valide. Vérifiez et réessayez. </div><br />');
				$("#msg-error").show('slow').delay(4000).fadeOut();
			}
			if(data.return == 9){
				$('#msg-error').html('<div class="alert alert-danger" role="alert"> ID de réunion non valide. Vérifiez et réessayez. </div><br />');
				$("#msg-error").show('slow').delay(4000).fadeOut();
			}
			
        }
     });
	
}


function add_metting(){
	var userConnected 	= sessionStorage.getItem("userConnected");
	var idMeeting 		= $("#idMeetingHidden").val();
	
	var sendingData = {
	   action			: "check_metting",
	   userConnected	: userConnected,
	   idMeeting		: idMeeting
	}
	
	$.ajax({
		type: 'POST',
        async:false,
		url: 'https://hellooevent.com/partials/class.controller.php',		
		data: sendingData,
        dataType: 'json',
        success: function (data) {
			if(data.return == 0){
				var sendingDataClose = {
				   action		: "close_metting",
				   idMeeting	: data.idMeeting,
				   userConnected: userConnected
				}
	
				$.confirm({
					animation: 'Rotate',
					closeAnimation: 'Rotate',
					animateFromElement: false,
					title: 'Voulez-vous quitter cette réunion et en commencer une autre ?',
					content: '',
					buttons: {
						Oui: function () {
							$.ajax({
								type: 'POST',
								async:false,
								url: 'https://hellooevent.com/partials/class.controller.php',		
								data: sendingDataClose,
								dataType: 'html',
								success: function (data) {
									window.location.href = "live_presentator.html";
								}
							});
						},
						Non: function () {
							window.location.href = "live_presentator.html";
						}
					}
				});
			}
			
			if(data.return == 1){
				window.location.href = "live_presentator.html";
			}
        }
     });
	
}

function getMetting(){
	var userConnected 	= sessionStorage.getItem("userConnected");
	var sendingData = {
	   action			: "getMetting",
	   userConnected	: userConnected
	}
	
	$.ajax({
		type: 'POST',
        async:false,
		url: 'https://hellooevent.com/partials/class.controller.php',		
		data: sendingData,
        dataType: 'json',
        success: function (data) {
			$("#idMeeting").val(data.idMeeting);
	    }
     });
	
}

function disconnect_live(){
	var idMeeting = $("#idMeeting").val();
	var userConnected 	= sessionStorage.getItem("userConnected");
	
	var sendingData = {
	   action			: "disconnect_live",
	   userConnected	: userConnected,
	   idMeeting		: idMeeting
	}
	$.ajax({
		type: 'POST',
        async:false,
		url: 'https://hellooevent.com/partials/class.controller.php',		
		data: sendingData,
        dataType: 'html',
        success: function (data) {
			window.location.href = "dashbord.html"; 
	    }
     });
	
}

function getRoleId(){
	var sendingData = {
	   action	: "get_role_id"
   }
	$.ajax({
		type: 'POST',
		async:false,
		url: 'https://hellooevent.com/partials/class.controller.php',		
		data: sendingData,
		dataType: 'json',
		success: function (data) {
			$("#idRole").html(data.html);
		}
	 });
}

function update_password(){
	var userConnected = sessionStorage.getItem("userConnected");
	
	var sendingData = {
	   action				: "update_password",
	   verify_password		: $("#verify_password").val(),
	   new_password			: $("#new_password").val(),
	   confirm_password		: $("#confirm_password").val(),
	   userConnected		: userConnected
	}
	var validVerify 	= true;
	var validNew		= true;
	var validConfirm 	= true;
	
	if(sendingData.verify_password  == ''){
		var validVerify = false;
		$("#verify_password").css("border-bottom", "1px solid red");
	}else{
		$("#verify_password").css("border-bottom", "1px solid green");
	}
	
	if(sendingData.new_password  == ''){
		var validNew = false;
		$("#new_password").css("border-bottom", "1px solid red");
	}else{
		$("#new_password").css("border-bottom", "1px solid green");
	}
	
	if(sendingData.confirm_password  == ''){
		var validConfirm = false;
		$("#confirm_password").css("border-bottom", "1px solid red");
	}else{
		$("#confirm_password").css("border-bottom", "1px solid green");
	}
	
	if(validVerify == true && validNew == true && validConfirm == true ){
		$.ajax({
			type: 'POST',
			async:false,
			url: 'https://hellooevent.com/partials/class.controller.php',		
			data: sendingData,
			dataType: 'json',
			success: function (data) {
				if(data.returnUpdate == 0){
					$('#msg-error').html('<div class="alert alert-danger" role="alert"> L\'ancien mot de passe que vous avez saisi ne correspond pas ! </div>');
					$("#msg-error").show('slow').delay(4000).fadeOut();
				}
				if(data.returnUpdate == 2){
					$('#msg-error').html('<div class="alert alert-danger" role="alert">Les deux mots de passe ne sont pas identiques !  </div>');
					$("#msg-error").show('slow').delay(4000).fadeOut();
				}
				if(data.returnUpdate == 1){
					window.location.href = "./setting.html"; 
				}
				
				// window.location.href = "./setting.html"; 
			}
		 });
	}
	 
}


function create_user(){
	
	var sendingData = {
	   action		: "create_user",
	   idRole		: $("#idRole").val(),
	   lastname		: $("#lastname").val(),
	   firstname	: $("#firstname").val(),
	   email		: $("#email").val(),
	   password		: $("#password").val()
	}
	
	var idRole 		= true;
	var lastname 	= true;
	var firstname 	= true;
	var email 		= true;
	var password 	= true;
	
	if (sendingData.idRole == 0 ){
		$("#idRole").css("border-bottom", "1px solid red");
		idRole = false;
	}else{
		$("#idRole").css("border-bottom", "1px solid #8cc63f");
	}
	
	if ( sendingData.lastname == '' || sendingData.lastname.length < 2 ){
		$("#lastname").css("border-bottom", "1px solid red");
		lastname = false;
	}else{
		$("#lastname").css("border-bottom", "1px solid #8cc63f");
	}
	
	if ( sendingData.firstname == '' || sendingData.firstname.length < 2 ){
		$("#firstname").css("border-bottom", "1px solid red");
		firstname = false;
	}else{
		$("#firstname").css("border-bottom", "1px solid #8cc63f");
	}
	
	
	if(!$("#email").val().match(/^[+a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/i)){
		$("#email").css("border-bottom", "1px solid red");
		email = false;
	}else{
		$("#email").css("border-bottom", "1px solid #8cc63f");
	}
	
	if ( sendingData.password == '' || sendingData.password.length < 3 ){
		$("#password").css("border-bottom", "1px solid red");
		password = false;
	}else{
		$("#password").css("border-bottom", "1px solid #8cc63f");
	}
	
	
	if(idRole == true && lastname == true && firstname == true &&  email == true && password == true ){
		
		$.ajax({
			type: 'POST',
			async:false,
			url: 'https://hellooevent.com/partials/class.controller.php',		
			data: sendingData,
			dataType: 'json',
			success: function (data) {
				if(data.returnCreate == 0){
					$('#msg-error').html('<div class="alert alert-danger" role="alert">Cette adresse email existe déjà ! </div>');
					$("#msg-error").show('slow').delay(2000).fadeOut();
				}else{
					$('#msg-error').html('<div class="alert alert-success" role="alert">Compte HelloEvent a été créé avec succès</div>');
					$("#msg-error").show('slow').delay(2000).fadeOut();
					setTimeout(function(){
						window.location.href = "./dashbord.html"; 
					 }, 2000);
				}
				 
			}
		 });
	}
}


function doesConnectionExist(){
	/*
	var xhr = new XMLHttpRequest();
	var file = "https://hellooevent.com/www/assets/img/logo.png";
	var randomNum = Math.round(Math.random() * 10000);
 
	xhr.open('HEAD', file + "?rand=" + randomNum, true);
	xhr.send();
	 
	xhr.addEventListener("readystatechange", processRequest, false);
 
	function processRequest(e) {
	  if (xhr.readyState == 4) {
		if (xhr.status >= 200 && xhr.status < 304) {
		  
		} else {
			$.confirm({
			title: 'Erreur',
			content: 'La connexion internet n\'existe pas! ',
			autoClose: 'logoutUser|5000000',
			buttons: {
				logoutUser: {
					text: 'Fermer',
					action: function () {
					}
				}
				
			}
			});
		}
	  }
	}
	*/
}

