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
	//console.log(hash);
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
					//console.log(textBody);
					createNewWindow(input, textBody);
				}
			});
			if (!found)
				createNewWindow("Wrong Password", "<h1>Access denied.</h1>");
		}
	});
}

function activateEncryption() {
	clearDefaultAction();
	setPasswordProtection();
}

//param:value is the input text from the input window
function secretCursor(value) {
	//console.log(value);
	val = "url(" + value + "), default";
	$("body").css("cursor", val);
}

function holoDesktop(value) {
	value = parseInt(value) * 1000;
	if (value != 0)
		timer = setInterval(function() {
			document.getElementsByClassName('jscolor')[0].value = random_hex_color();
			$(".jscolor").trigger("change");
		}, value);
	else
		clearInterval(timer);
}

function random_hex_color()
{
    /* get random red, green, and blue from 0 to 255 */
    var randomred = Math.floor(Math.random() * 255);
    var randomgreen = Math.floor(Math.random() * 255);
    var randomblue = Math.floor(Math.random() * 255);

    /* convert each decimal number to hexadecimal */
    var hred = new String(randomred.toString(16));
    var hgreen = new String(randomgreen.toString(16));
    var hblue = new String(randomblue.toString(16));

    /* pad with 0 if necessary 
        (e.g. make sure to output 05 instead of just 5) */
    hred = String('00'+hred).slice(-2);
    hgreen = String('00'+hgreen).slice(-2);
    hblue = String('00'+hblue).slice(-2);

    return hred+hgreen+hblue;
}