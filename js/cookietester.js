/*function log sends actions from the webpage back to the server.
 * */
 devmode=true;


function log(operation,machine) {

//Commented out variables for more to github would replace with REST in future if need to log. 
//var p_url="https://isdportal.oracle.com/pls/portal/tsr_admin.CUSTOMIZE.sf_audit_click?p_code=C_CLICK&p_id1=";
//var params = p_url+machine+"&p_id2=&p_user_layout="+operation;

if (devmode){
console.log( operation+ '  '+machine);
}
else {
var http = new XMLHttpRequest();
http.open("GET", params, true);
http.onreadystatechange = function() {
	if(http.readyState == 4 && http.status == 200) {
		//alert(http.responseText);
	}
}
http.send(null);
}

}
