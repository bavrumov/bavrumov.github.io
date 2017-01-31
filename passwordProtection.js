//Uses Jquery, requires page to be loaded
function clearDefaultAction() {
	$(".password").unbind("dblclick");
}

function setPasswordProtection() {
	$(".password").dblclick( function() {
		userPass = prompt("I'm going to need a password to open this..");
		if (userPass === false || userPass === null)
			return;	
		checkPassword(userPass);
	});
}

function checkPassword(input) {
	salted = "gottem," + input;
	hash = CryptoJS.MD5(salted).toString();
	found = false;
	$.ajax({
		type: "GET",
		url: "hashlookup.xml",
		dataType: "xml",
		success: function(xml) {
			$encryptedFiles = $(xml).find('desktop').children();
			$encryptedFiles.each(function(){
				nameTag = $(this).children()[0];
				contentTag = $(this).children()[1];
				if ($(nameTag).text() == hash) {
					found = true;
					textBody = '<div class="innerWindow">' + contentTag.innerHTML + '</div>';
					console.log(textBody);
					createNewWindow(input, textBody);
				}
			});
			if (!found)
				createNewWindow("Wrong Password", "<h1>Access denied.</h1>");
		}
	});
}

function activateEncryption(){
	clearDefaultAction();
	setPasswordProtection();
}