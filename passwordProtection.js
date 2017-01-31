//Uses Jquery, requires page to be loaded
function clearDefaultAction() {
	$(".password").unbind("dblclick");
}

function setPasswordProtection() {
	$(".password").dblclick( function() {
		userPass = prompt("I'm going to need a password to open this");
		checkPassword(userPass);
		// if (userPass == "hello")
		// 	console.log(CryptoJS.MD5(userPass).toString());
		// else
		// 	console.log("nope");
	});
}

function checkPassword(input) {
	salted = "gottem," + input;
	hash = CryptoJS.MD5(salted).toString();
	found = false;
	$.ajax({
		type: "GET",
		url: "filedata.xml",
		dataType: "xml",
		success: function(xml) {
			$desktopItems = $(xml).find('desktop').children();
			$desktopItems.each(function(){
				nameTag = $(this).children()[0];
				contentTag = $(this).children()[1];
				if ($(nameTag).text() == hash) {
					found = true;
					textBody = '<div class="innerWindow">' + $(contentTag).text() + '</div>';
					createNewWindow(hash, textBody);
				}
			});
			if (!found)
				createNewWindow(hash, "<h1>Password incorrect;<br />Access denied.</h1>");
		}
	});
}

function activateEncryption(){
	clearDefaultAction();
	setPasswordProtection();
}