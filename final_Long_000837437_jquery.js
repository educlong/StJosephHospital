/**
     I, Nguyen Duc Long, 000837437 certify that this material is my original work.
     No other person's work has been used without due acknowledgement.

     @date Dec 10, 2021
     @author DUC LONG NGUYEN (Paul)
     @A brief description of the file: Final project: St Joseph's Hospital Management;
        file jQuery
        - decentralization for users
        - handling for login/logout/register button, user button and menu button
*/
 $(function() {


	/*============== PROCESSINNG: SESSION MANAGEMENT ================*/
    let urlSession = "getSession.php";
    fetch(urlSession, {credentials: 'include'}).then(response => response.json()).then(function(jsonSession){
        sessionManagement(jsonSession);
    });

    /*  <summary>session management for list of menus</summary>
        <param name="jsonSession">the json text is retured from ajax request</param>
        <returns></returns>
    */
    function sessionManagement(jsonSession){
        $('.sessions').addClass("d-none");
        /*display register and login when sessions are not set*/
        if (jsonSession && Object.keys(jsonSession).length===0 && Object.getPrototypeOf(jsonSession)===Object.prototype){
            $(".sessions.session-register").removeClass("d-none");
            $(".sessions.session-login").removeClass("d-none");
        }
        /*decentralization for user based on authoritative column in the finalproject_users table*/
        else{
            $(".sessions.session-user").removeClass("d-none");
            $(".sessions.session-menu").removeClass("d-none");
            var session = [];    
            for (var [key, value] of Object.entries(jsonSession)) {
                session[key] = value;
            }
            var authoritative = session['authoritative'];
            if (authoritative=='A') {
            	$('.sessions').removeClass("d-none");
	            $(".sessions.session-register").addClass("d-none");
	            $(".sessions.session-login").addClass("d-none");
            }
            if (authoritative=='U' || authoritative=='P'){
	            $(".sessions.session-departments").removeClass("d-none");
	            $(".sessions.session-medications").removeClass("d-none");
	            $(".sessions.session-nursing_units").removeClass("d-none");
	            $(".sessions.session-physicians").removeClass("d-none");
                if (authoritative=='P') {
                    $(".sessions.session-admissions").removeClass("d-none");
                    $(".sessions.session-patients").removeClass("d-none");
                    $(".sessions.session-encounters").removeClass("d-none");
                }
            }
            if (authoritative=='D' || authoritative=='N'){
	            $(".sessions.session-admissions").removeClass("d-none");
	            $(".sessions.session-medications").removeClass("d-none");
	            $(".sessions.session-nursing_units").removeClass("d-none");
	            $(".sessions.session-patients").removeClass("d-none");
	            $(".sessions.session-unit_dose_orders").removeClass("d-none");
	            $(".sessions.session-encounters").removeClass("d-none");
	            $(".sessions.session-physicians").removeClass("d-none");
	            $(".sessions.session-items").removeClass("d-none");
	            $(".sessions.session-new").removeClass("d-none");
            }
            if (authoritative=='M') {
            	$('.sessions').removeClass("d-none");
	            $(".sessions.session-register").addClass("d-none");
	            $(".sessions.session-login").addClass("d-none");
	            $(".sessions.session-new").addClass("d-none");
	            $(".sessions.session-encounters").addClass("d-none");
	            $(".sessions.session-provinces").addClass("d-none");
            }

            /*display user's email for change password function*/
	        let urlItem = "selectItem.php?table=users&id="+session['user_id'];
	            fetch(urlItem, {credentials: 'include'}).then(response => response.text()).then(function(jsonUpdate){
                var detailsUpdate = [];
                var arrJsonUpdate = jsonUpdate.replace("{","").replace("}","").split('","');
                for (var i = 0; i < arrJsonUpdate.length-1; i++) {
                    var arrUpdateKeyValue = arrJsonUpdate[i].split('":"');
                    detailsUpdate[i] = arrUpdateKeyValue[1].replace('"',"");
                }
                $("input.userDetails")[0].value = detailsUpdate[0];
                $("input.userDetails")[1].value = detailsUpdate[1];
            });	
        }
    }







    /*============== PROCESSINNG: MENU BUTTON HANDLING ================*/
    /*When Menu button is clicked, display the content of Menu*/
    $(".container .controlMenu.btn.btn-link.btn-lg").click(function(event) {
        $(".blackBackground").addClass("menuContentDisplay");   /*open black background*/
        $(".menuContent").addClass("menuContentDisplay")        /*open black background*/
    });



    /*============== PROCESSINNG: USER BUTTON HANDLING ================*/
    $("button.controlUser").click(function(event) {
        $(".blackBackground").addClass("menuContentDisplay");
        $(".infoUser").addClass("infoUserDisplay");
        $("em.change-password-announcement").addClass("d-none");
    });



    /*============== PROCESSINNG: LOGIN BUTTON HANDLING ==========*/
    $("button.controlLogin").click(function(event) {
        $(".blackBackground").addClass("menuContentDisplay");
        $(".infoLogin").addClass("infoLoginDisplay");  
    });



    /*============== PROCESSINNG: REGISTER BUTTON HANDLING ================*/
    $("button.controlRegister").click(function(event) {
        $(".blackBackground").addClass("menuContentDisplay");
        $(".infoRegister").addClass("infoRegisterDisplay");
    });



    /*============== PROCESSINNG: LOGOUT BUTTON HANDLING ================*/
    $("button.btnLogout").click(function(event) {
        let urlLogout = "logout.php?";
        fetch(urlLogout, { credentials: 'include' }).then(response => response.text())
            .then(function(jsonLogin){  /*destroy session*/
        });
        window.location.reload();       /*reload web app*/
    });
});