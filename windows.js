NOTEPADICONPATH="ico/notepad.png";
FOLDERICONPATH="ico/folder.png";
PICTUREICONPATH="ico/jpeg.png";

function basicWindow(title, height, width){
	this.title = title;
	this.height = height;
	this.width = width;

}

function folder(){
	this.window = new basicWindow
}

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