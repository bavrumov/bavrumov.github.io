globalZindexCounter=1;
NOTEPADICONTITLE="ico/notepad-1.png";
FOLDERICONPATH="ico/folder.png";

/*Window Object Factory
 *Provides default values to parameters that aren't passed or are falsey
 *width and height are 35% of current browser width and height
 *String title = file/window name in header
 *Appends newly constructed window to the html body
 */
function createNewWindow(title, content, height, width) { //Window Factory
	var height = height || Math.floor(window.outerHeight*0.35);
	var width = width || Math.floor(window.outerWidth*0.44);
    var head = title || ("Border Patrol");
    var bod = content || ("This is window #"+globalZindexCounter);
	myWin = new uiWindow(head, bod, height, width);
	document.body.appendChild(myWin.windowElement);
	//Stops long files from overflowing off the page, adjusts them until they fit snugly
		if (myWin.windowElement.scrollHeight > window.outerHeight * 0.75) {
			tempWidth = 40;
			myWin.windowElement.style.width = tempWidth + "%";
		}
		while (myWin.windowElement.scrollHeight > window.outerHeight * 0.75) {
			tempWidth+=5;
			myWin.windowElement.style.width = tempWidth + "%";
		}
}

/*Window Object Constructor
 *int height = new window height	
 *int width = new window width
 *String title = file/window name in header
 *body:
	String: internal window text
	DOM Element: appended into the window
 *this.windowElement = constructed window object
 */
function uiWindow(title, body, height, width) {
	myWin = document.createElement('div');
	myWin.setAttribute("class","resizable window");
	myWin.style.Zindex = ""+globalZindexCounter++;
		header = document.createElement('div');
		header.setAttribute("class","header");
			icon = document.createElement('img');
			icon.setAttribute("class","icon");
			icon.src=NOTEPADICONTITLE;
			if (title.substring(title.length-4)==".jpg")
				icon.src = PICTUREICONPATH;
			butts = document.createElement("div");
			butts.setAttribute("class","buttons");
				b1 = document.createElement('button');
					min = document.createElement('span');
					min.setAttribute("class","minimize");
				b1.appendChild(min);
				b2 = document.createElement('button');
					max = document.createElement('span');
					max.setAttribute("class","maximize");
				b2.appendChild(max);
				b3 = document.createElement('button');
				b3.setAttribute("onclick","this.parentElement.parentElement.parentElement.remove()");
				b3.innerHTML = "X";
			butts.appendChild(b1);
			butts.appendChild(b2);
			butts.appendChild(b3);
		header.appendChild(icon);
		header.innerHTML+=title;
		header.appendChild(butts);
		content = document.createElement('div');
		content.setAttribute("class","content");
			// text = document.createElement('h3');
			// if (typeof body == 'string')
			// 	text.innerHTML = body;
			// else
			//	text.appendChild(body);
			// content.appendChild(text);
			text="";
			if (typeof body == 'string')
				content.innerHTML = body;
			else{
				content.appendChild(body);
			}
	myWin.appendChild(header);
	myWin.appendChild(content);
	this.windowElement = myWin;
	//this.windowElement.style.height = parseInt(height)+"px";
	//this.windowElement.style.width = parseInt(width)+"px";
}