globalZindexCounter=1;
NOTEPADICONTITLE="ico/notepad-1.png";
FOLDERICONPATH="ico/folder.png";

/*Window Object Factory
 *Provides default values to parameters that aren't passed or are falsey
 *width and height are 35% of current browser width and height
 *String title = file/window name in header
 *Appends newly constructed window to the html body
 */
function createNewWindow(title, content, height, width) {
	var height = height || Math.floor(window.outerHeight*0.35);
	var width = width || Math.floor(window.outerWidth*0.44);
	var head = title || 'Window';
	var bod = content || ('This is window #' + globalZindexCounter);
	var myWin = new uiWindow(head, bod, height, width);
	document.body.appendChild(myWin.windowElement);
	// Expand width if content overflows vertically
	if (myWin.windowElement.scrollHeight > window.outerHeight * 0.75) {
		tempWidth = 40;
		myWin.windowElement.style.width = tempWidth + '%';
	}
	while (myWin.windowElement.scrollHeight > window.outerHeight * 0.75) {
		myWin.windowElement.style.width = (tempWidth += 5) + '%';
	}
	// Make draggable and place randomly
	$(myWin.windowElement).draggable({ handle: '.header' });
	$(myWin.windowElement).css({
		top:  Math.floor(window.outerHeight * 0.6 * Math.random()),
		left: Math.floor(100 + window.outerWidth * 0.6 * Math.random())
	});
	wireUpWindowButtons(myWin.windowElement, head);
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
	myWin.style.zIndex = '' + globalZindexCounter++;
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
		header.appendChild(butts);
		header.appendChild(icon);
		var titleSpan = document.createElement('span');
		titleSpan.className = 'window-title';
		titleSpan.textContent = title;
		header.appendChild(titleSpan);
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