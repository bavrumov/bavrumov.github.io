//NOTEPADICONPATH="ico/notepad.png";
NOTEPADICONPATH="/ico/classic/txt_file-1.png";
FOLDERICONPATH="ico/folder.png";
PICTUREICONPATH="ico/jpeg.png";
FOLDERHEADER="ico/folderico.png";

// Desktop item object, requires type and name from xml. this.icon isn't useful at the moment.
function item(type, name){
	this.type = type; 
	this.name = name;
	if (name.substring(name.length-4)==".txt")
		this.icon = NOTEPADICONPATH;
	else
		if (name.substring(name.length-4)==".jpg")
			this.icon = PICTUREICONPATH;
		else
			this.icon = FOLDERICONPATH;
}

// DOM-ready desktop item, constructs the html element using item object as parameter and returns it.
function domItem(item){
	i = document.createElement("p");
		i.setAttribute("class",item.type);
	one = document.createElement("span");
		if (item.type == "folder")
			one.setAttribute("class","fileicon fol");
		else{
			extension = item.name.substring(item.name.length - 3);
			className = "fileicon " + extension;
			one.setAttribute("class",className);
		}
	i.appendChild(one);
	i.innerHTML+="<br />";
	two = document.createElement("span");
		two.setAttribute("class","filename");
		two.innerHTML = item.name;
	i.appendChild(two);
	return i;
}


// universal window object, to be customized later depending on whether file or folder.
// function basicWindow(title, height, width){
// 	this.title = title;
// 	this.height = height;
// 	this.width = width;

// }

function folder(title, height, width){
	myWin = document.createElement('div');
	myWin.setAttribute("class","resizable window foldwin");
	//myWin.style.Zindex = ""+globalZindexCounter++;
		header = document.createElement('div');
		header.setAttribute("class","header");
			icon = document.createElement('img');
			icon.setAttribute("class","icon");
			icon.src=FOLDERHEADER;
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
		content.setAttribute("class","innerFolder");
	myWin.appendChild(header);
	myWin.appendChild(content);
	myWin.style.width = width +"px";
	myWin.style.height = height +"px";
	this.windowElement = myWin;
	this.folderBody=content;
}