/*XML Node Retriever
 *String filename = Name of file to be searched in XML tree
 *Sets htmlstring variable to file content retrieved in XML
 *Finally, creates window using found data
 *XML Struct: <desktop><file><name>param: filename</name>
 		    <content>retrieved: htmlstring</content></file></desktop>
 */
function retrieveNode(filename) {
	htmlstring = "<h1>File Not Found</h1>"; //Default value
	var xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = function() {
		if (xhttp.readyState == 4 && xhttp.status == 200) {
			datadoc = xhttp.responseXML; //contains all of filedata.xml
			allFiles = datadoc.getElementsByTagName("desktop")[0].getElementsByTagName("file");
			for (i=0; i<allFiles.length; i++)
				if (allFiles[i].getElementsByTagName("name")[0].innerHTML == filename)
					htmlstring = allFiles[i].getElementsByTagName("content")[0].innerHTML;

			createNewWindow(fname,htmlstring);
	    }
	};
	xhttp.open("GET", "filedata.xml", true); //asynchronous
	xhttp.send();
}



//not in use at all
function retrieveFileSystem(){
	var xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = function() {
		if (xhttp.readyState == 4 && xhttp.status == 200) {
			datadoc = xhttp.responseXML; //contains full xml file
			allItems = datadoc.getElementsByTagName("desktop")[0].childNodes;
			for (i=0; i<allItems.length; i++)
				document.body.innerHTML+=""
		}
	};
	xhttp.open("GET", "filestructure.xml", false); //synchronous
	xhttp.send();
}