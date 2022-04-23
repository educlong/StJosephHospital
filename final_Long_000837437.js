/**
     I, Nguyen Duc Long, 000837437 certify that this material is my original work.
     No other person's work has been used without due acknowledgement.

     @date Dec 10, 2021
     @author DUC LONG NGUYEN (Paul)
     @A brief description of the file: Final project: St Joseph's Hospital Management;
        file native Javascript, 
*/

document.addEventListener("DOMContentLoaded",function () {
    var admissions = ["admissions_id", "patient_id", "admission_date", "discharge_date", "primary_diagnosis", 
                    "secondary_diagnoses", "attending_physician_id", "nursing_unit_id", "room","bed"];
    var departments = ["department_id", "department_name", "manager_first_name", "manager_last_name"];
    var encounters = ["encounter_id", "patient_id", "physician_id", "encounter_date_time", "notes"];
    var medications = ["medication_id", "medication_description", "medication_cost", "package_size", "strength", 
                    "sig", "units_used_ytd", "last_prescribed_date"];
    var items = ["item_id", "item_description", "item_cost", "quantity_on_hand", "usage_ytd", "primary_vendor_id", 
                    "order_quantity", "order_point"];
    var nursing_units = ["nursing__id", "nursing_unit_id", "specialty", "manager_first_name", "manager_last_name", 
                    "beds", "extension"];
    var patients = ["patient_id", "first_name", "last_name", "gender", "birth_date", "street_address", "city",
                     "province_id", "postal_code", "health_card_num", "allergies", "patient_height", "patient_weight"];
    var physicians = ["physician_id", "first_name", "last_name", "specialty", "phone", "ohip_registration"];
    var provinces = ["id", "province_id", "province_name"];
    var purchase_orders = ["purchase_order_id", "order_date", "department_id", "vendor_id", "total_amount", "order_status"];
    var purchase_order_lines = ["purchase_order_lines_id", "purchase_order_id", "line_num", "item_id", "quantity", 
                                "unit_cost", "received", "cancelled", "last_arrived_date"];
    var unit_dose_orders = ["unit_dose_order_id", "patient_id", "medication_id", "dosage", "sig", "dosage_route", 
                            "pharmacist_initials", "entered_date"];
    var vendors = ["vendor_id", "vendor_name", "street_address", "city", "province_id", "postal_code", "contact_first_name", 
                    "contact_last_name", "purchases_ytd"];
    var users = ["user_id", "user_email", "user_password", "authoritative", "patient_id"];

    /*list all of the tables and their columns in the database*/
    var arrTable = {admissions, departments, encounters, medications, items, nursing_units, patients,
                physicians, provinces, purchase_orders, purchase_order_lines, unit_dose_orders, vendors, users};





    /*============== PROCESSINNG: MENU BUTTON ================*/
    var button = document.querySelectorAll(".button.btn");
    var thead = document.querySelector("thead");
    var tbody = document.querySelector("tbody");
    var btnNew = document.querySelector("button.btnNew");
    /*When the user click to choose a table in the list of menu*/
    for (var i = 0; i < button.length; i++) {
        button[i].addEventListener("click", function(){
            btnNew.classList.remove("d-none");

            showInfos();
            var tableSelect = this.classList[4];
            selectItems(tableSelect);       
            document.getElementById("kindOfInteractDb").value="update|"+tableSelect+"|0";
        })
    }




    /*============== PROCESSINNG: DELETE BUTTON (for each menu) ================*/
    var buttonDelete = document.querySelector("button.btn.btn-danger.btnDeleteItem");
    /*When the user click to delete an item from a table in a table/tbody tag*/
    buttonDelete.addEventListener("click", function(){
        var kindOfInteractDb = document.getElementById("kindOfInteractDb").value.split("|");
        if (kindOfInteractDb[0] == "update") return;
        var tableDelete = kindOfInteractDb[1];
        var idDelete = kindOfInteractDb[2];
        
        let urlItem = "selectItem.php?table="+tableDelete+"&id="+idDelete;  /*Ajax request to select a item*/
        fetch(urlItem, {credentials: 'include'}).then(response => response.text()).then(function(jsonDelete){
            
            detailsDelete = "";
            var arrJsonDelete = jsonDelete.replace("{","").replace("}","").split('","');
            for (var i = 1; i < arrJsonDelete.length-1; i++) {
                var arrDeleteKeyValue = arrJsonDelete[i].split('":"');
                detailsDelete += "__"+arrDeleteKeyValue[0].replace('"',"")+" : "+arrDeleteKeyValue[1].replace('"',"")+"\n";
            }

            var confirmDelete = window.confirm("Do you want to delete data with id = "
                +idDelete+" in table ["+tableDelete+"]?\nMore details:\n"+detailsDelete);
            if (confirmDelete) {    /*confirm to delete*/
                let urlDeleteItem = "deleteItem.php?table="+tableDelete+"&id="+idDelete;
                /*Ajax request to delete a item*/
                fetch(urlDeleteItem, {credentials: 'include'}).then(response => response.text()).then(function(text){
                    selectItems(tableDelete);
                });
            }
            showInfos();
        });

    });






    /*============== PROCESSINNG: UPDATE CONFIRM BUTTON and UPDATE BUTTON ================*/
    var blackBackground =document.querySelector(".blackBackground"); /*background when Menu button is clicked*/
    var infoUpdate =document.querySelector(".infoUpdate");  /*Contents are appeared when Menu button is clicked*/
    var divUpdates = document.querySelectorAll(".updates");

    var buttonConfirmUpdate = document.querySelector("button.btn.btn-warning.btnUpdateItem");
    var update =  document.querySelectorAll(".update");
    var buttonUpdate = document.querySelector("button.btn.btnUpdate");

    /*confirm to update/insert when the user click to update an item into a table in a table/tbody tag*/
    buttonConfirmUpdate.addEventListener("click", function(){
        var kindOfInteractDb = document.getElementById("kindOfInteractDb").value.split("|");
        if (kindOfInteractDb[0] == "delete") return;
        var tableUpdate = kindOfInteractDb[1];
        var idUpdate = kindOfInteractDb[2];

        var inputUpdate = document.querySelectorAll(".form-control.update-"+tableUpdate);
        showInfos();

        for (var i = 0; i < divUpdates.length; i++) {
            divUpdates[i].classList.add("d-none");
        }
        inputUpdate[0].parentNode.parentNode.parentNode.parentNode.parentNode.classList.remove("d-none");

        blackBackground.classList.add("menuContentDisplay");  /*open black background*/
        infoUpdate.classList.add("infoUpdateDisplay");        /*open black background*/
        selects(tableUpdate, idUpdate, inputUpdate, update);
    });

    /*when the user click to update/insert an item into a table in a table/tbody tag*/
    buttonUpdate.addEventListener("click", function(){
        var tableUpdate = document.getElementById("kindOfInteractDb").value.split("|")[1];
        var inputUpdate = document.querySelectorAll(".form-control.update-"+tableUpdate);
        showInfos();

        let urlUpdate = "updateItem.php?table="+tableUpdate;    /*Ajax request to update/insert a item*/
        for (var i = 0; i < inputUpdate.length; i++) {
            urlUpdate += "&"+arrTable[tableUpdate][i]+"="+inputUpdate[i].value;
        }
        fetch(urlUpdate, {credentials: 'include'}).then(response=>response.text()).then(function(jsonUpdate){
            selectItems(tableUpdate);
        })
    })





    /*============== PROCESSINNG: NEW BUTTON (INSERT BUTTON) ================*/
    var menuContentUpdate =document.querySelector(".menuContentUpdate");
    /*when the user click to insert an item into a table from a new button */
    btnNew.addEventListener("click",function(){
        blackBackground.classList.add("menuContentDisplay");
        menuContentUpdate.classList.add("menuContentDisplayUpdate");
        var kindOfInteractDb = document.getElementById("kindOfInteractDb").value.split("|");
        crudItem(kindOfInteractDb[0],kindOfInteractDb[1],0);
    })







    /*============== PROCESSINNG: SUBMIT LOGIN BUTTON HANDLING ==========*/
    var submitLogin = document.querySelector("button.btnLogin");
    var inputLogin = document.querySelectorAll("input.login");
    var loginAnnouncement = document.querySelector("em.login-announcement");
    loginAnnouncement.classList.add("d-none");
    /*when the user click to login from a login button */
    submitLogin.addEventListener("click",function(){
        loginAnnouncement.classList.add("d-none");
        var checkEmpty = true;
        for (var i = 0; i < inputLogin.length; i++)
            if(inputLogin[i].value.trim()=="") checkEmpty=false;
        if(checkEmpty==false){
            loginAnnouncement.innerHTML = "Your inputs are not validated!";
            loginAnnouncement.classList.remove("d-none");
            return;
        }
        loginAnnouncement.classList.add("d-none");

        /*Ajax request to perform login function for a user*/
        let urlLogin = "login.php?email="+inputLogin[0].value+"&password="+inputLogin[1].value;
        fetch(urlLogin, { credentials: 'include' }).then(response => response.json())
            .then(function(jsonLogin){
            /*make an announcement if login is not successful*/
            if (jsonLogin&&Object.keys(jsonLogin).length===0&&Object.getPrototypeOf(jsonLogin)===Object.prototype){
                loginAnnouncement.classList.remove("d-none");
                loginAnnouncement.innerHTML="Your email or password is wrong";
            }
            /*reload the page to update the session if login is successful*/
            else{
                loginAnnouncement.classList.add("d-none");
                window.location.reload();
            }
        });
    })




    /*============== PROCESSINNG: SUBMIT REGISTER BUTTON HANDLING ================*/
    var inputRegister = document.querySelectorAll("input.registers");
    var submitRegister = document.querySelector("button.btnSubmit");
    var patientIdRegister = document.querySelector("input.registers.patient_id");
    var registersAnnouncement = document.querySelector("em.registers-announcement");
    registersAnnouncement.classList.add("d-none");
    /*when the user click to register an user from a submit button */
    submitRegister.addEventListener("click",function(){

        /*=========CASE 1: Your input are wrong (Email format, Password format, inputs must not be empty)*/
        registersAnnouncement.classList.add("d-none");
        var validateYourEmail = validateEmail(inputRegister[0].value);
        var validateYourPassword=validatePassword(inputRegister[1].value)&&(inputRegister[1].value==inputRegister[2].value);

        if(validateInput(inputRegister)==false || validateYourEmail==false || validateYourPassword==false){
            registersAnnouncement.innerHTML = "Your inputs are not validated! "
                +"<br>(Note: Your password must be at least one uppercase letter, at least one lowercase letter,"
                +" at least one digit, at least one special symbol, and more than 8 character.)";
            registersAnnouncement.classList.remove("d-none");
            return;
        }

        /*=========CASE 2: You are not patient*/
        registersAnnouncement.classList.add("d-none");
        if (inputRegister[3].value.trim()=="") {    
            let urlGuest = "updateItem.php?table=users&user_id=0&user_email="
                        +inputRegister[0].value+"&user_password="+inputRegister[1].value
                        +"&authoritative=U";
            updates(urlGuest,registersAnnouncement,"Your registration is successful!",inputRegister);
            window.location.reload();
        }
        /*=========CASE 3: You are a patient*/
        else{
            let urlPatient = "selectItem.php?table=patients&id="+patientIdRegister.value;
            fetch(urlPatient, { credentials: 'include' }).then(response => response.json()).then(function(jsonPatient){
                    
                    /*=========CASE 4: Patient does not exist*/
                    if (jsonPatient == null){
                        registersAnnouncement.innerHTML = "This patients does not exist!";
                        registersAnnouncement.classList.remove("d-none");
                    }
                    else{
                        registersAnnouncement.classList.add("d-none");
                        let urlAllUsers = "selectItems.php?table=users&id=user_id";
                        fetch(urlAllUsers, { credentials: 'include' }).then(response => response.json())
                            .then(function(jsonAllUsers){
                                var checkRegister = false;
                                for (var i = 0; i < jsonAllUsers.length; i++) {
                                    if(jsonAllUsers[i]['patient_id']==patientIdRegister.value){
                                        checkRegister = true;
                                        break;
                                    }
                                }
                                
                                /*=========CASE 5: This patient registered*/
                                if (checkRegister) {
                                    registersAnnouncement.innerHTML = "This patients registered!";
                                    registersAnnouncement.classList.remove("d-none");
                                }
                                /*=========CASE 6: successful*/
                                else{
                                    let urlUser = "updateItem.php?table=users&user_id=0&user_email="
                                                +inputRegister[0].value+"&user_password="+inputRegister[1].value
                                                +"&authoritative=P&patient_id="+inputRegister[3].value;
                                    updates(urlUser,registersAnnouncement,"Your registration is successful!",inputRegister);
                                    window.location.reload();
                                }
                        });
                    }
            });
        }
    })









    /*============== PROCESSINNG: CHANGE PASSWORD BUTTON HANDLING ================*/
    var buttonChangePassword = document.querySelector("button.btnChangePassword");
    var changePasswordAnnouncement = document.querySelector("em.change-password-announcement");
    var inputchangePassword = document.querySelectorAll(".changePass");
    
    /*when the user click to change password from the change password button */
    buttonChangePassword.addEventListener("click",function(){
        
        /*_____ First of all, check and validate the password*/
        changePasswordAnnouncement.classList.add("d-none");
        var validateYourPassword = validatePassword(inputchangePassword[2].value)
                                    && validatePassword(inputchangePassword[3].value)
                                    &&(inputchangePassword[3].value==inputchangePassword[4].value);
        if(validateInput(inputchangePassword)==false || validateYourPassword==false){
            changePasswordAnnouncement.innerHTML = "Your inputs are not validated! "
                +"<br>(Note: Your password must be at least one uppercase letter, at least one lowercase letter,"
                +" at least one digit, at least one special symbol, and more than 8 character.)";
            changePasswordAnnouncement.classList.remove("d-none");
            return;
        }

        /*_____ Ajax request to login.php to confirm password after validate the password*/
        changePasswordAnnouncement.classList.add("d-none");
        let urlCheckAccount="login.php?email="+inputchangePassword[1].value+"&password="+inputchangePassword[2].value;
        fetch(urlCheckAccount, { credentials: 'include' }).then(response => response.json())
            .then(function(jsonLogin){

            /*=====CASE 1: Email or password is wrong*/
            if (jsonLogin&&Object.keys(jsonLogin).length===0&&Object.getPrototypeOf(jsonLogin)===Object.prototype){
                changePasswordAnnouncement.classList.remove("d-none");
                changePasswordAnnouncement.innerHTML="Your email or password is wrong";
            }

            /*=====CASE 2: Email and password are correct*/
            else{
                changePasswordAnnouncement.classList.add("d-none");
                var idUser = inputchangePassword[0].value;
                var emailUser = inputchangePassword[1].value;
                var patientId = "";
                if (jsonLogin['patient_id']!=null) 
                    patientId = "&patient_id="+jsonLogin['patient_id'];
                let urlChangePass = "updateItem.php?table=users&user_id="+idUser+"&user_email="
                        +emailUser+"&user_password="+inputchangePassword[3].value
                        +"&authoritative="+jsonLogin['authoritative']+patientId; /*Ajax request to change password*/
                updates(urlChangePass,changePasswordAnnouncement,"Your password is changed!",inputchangePassword);
                inputchangePassword[0].value = idUser;
                inputchangePassword[1].value = emailUser;
                showInfos();
            }
        });
    })









    /*============== FUNCTION: SELECT ALL ITEMS FROM A TABLE ================*/
    /*  <summary>SELECT ALL ITEMS FROM A TABLE</summary>
        <param name="table">the name of the table</param>
        <returns></returns>
    */
    function selectItems(table){
        /*Ajax request to get and set for all the sessions*/
        fetch("getSession.php", {credentials: 'include'}).then(response => response.json()).then(function(jsonHeader){
            var session = [];    
            for (var [key, value] of Object.entries(jsonHeader)) {
                session[key] = value;
            }
            
            /*Ajax request to get all the items from a table in the database 
              and set values for sessions based on the the values of each item*/
            let urlLoadItems = "selectItems.php?table="+table+"&id="+arrTable[table][0];
            fetch(urlLoadItems, { credentials: 'include' }).then(response => response.json())
                .then(function(jsonText){

                    /*print for header*/
                    var headerTable = "";
                    for(var key in arrTable){
                        if(key == table){
                            headerTable +="<tr>";
                            for (var j = 0; j < arrTable[key].length; j++) {
                                if (arrTable[key][j] != "user_password")
                                    headerTable += "<th>"+arrTable[key][j]+"</th>";
                            }
                            /*decentralization for user if this user can update/delete the items*/
                            if (session['authoritative']=='A'
                             || session['authoritative']=='D' || session['authoritative']=='N') {
                                if ((table!='nursing_units' && table!='physicians') || session['authoritative']=='A'){
                                    headerTable +="<th>Update</th></tr>";
                                }
                            }
                        }
                    }   /*end print for header*/
                    thead.innerHTML = headerTable;  

                    /*print for body*/
                    var onlyPatient =[];

                    /*decentralization for user if this user can update/delete the items*/
                    for (var i = 0; i < jsonText.length; i++) for(var key in arrTable) if (key == table)
                        if(session['authoritative']=='P'
                            && ((key=='patients' && session['patient_id']==jsonText[i][arrTable[key][0]])
                                || ((key=='admissions' || key=='encounters')
                                    && session['patient_id'] == jsonText[i][arrTable[key][1]])))
                            onlyPatient.push(jsonText[i]);
                    listItems = (session['authoritative']=='P' 
                        && (table=='patients' || table=='admissions' || table=='encounters')) ? onlyPatient : jsonText;
                    var bodyTable = "";
                    for (var i = 0; i < listItems.length; i++) {
                        for(var key in arrTable){
                            if (key == table) {
                                bodyTable += "<tr>";
                                for (var j = 0; j < arrTable[key].length; j++) {
                                    if (arrTable[key][j] != "user_password")
                                        bodyTable += "<th>"+listItems[i][arrTable[key][j]]+"</th>";
                                }
            
                                /*decentralization for user if this user can update/delete the items*/
                                if (session['authoritative']=='A'
                                 || session['authoritative']=='D' || session['authoritative']=='N') {
                                    if ((table!='nursing_units' && table!='physicians') || session['authoritative']=='A'){
                                        bodyTable += '<th class="d-flex justify-content-center">'
                                            +'<button type="button" class="btn btn-danger btn-sm '
                                            +table+listItems[i][0]
                                            +'" onclick="crudItem(\'delete\',\''+table.trim()+'\','+listItems[i][0]
                                            +')"><i class="fas fa-trash"></i></button>'+
                                            '<button type="button" class="btn btn-warning btn-sm '
                                            +table+listItems[i][0]
                                            +'" onclick="crudItem(\'update\',\''+table.trim()+'\','+listItems[i][0]
                                            +')"><i class="fas fa-pen-alt"></i></button>'
                                            +'</th></tr>';
                                    }
                                }
                            }
                        }
                    }   /*end print for body*/
                    tbody.innerHTML = bodyTable;

            }); /*end fetch*/
        });

    }





    /*  <summary>validate an email. The format of an email: ***@**.**</summary>
        <param name="email">the input email</param>
        <returns>true if the format of this email is correct. Else, return false</returns>
    */
    function validateEmail(email) {
        const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(String(email).toLowerCase());
    }

    /*  <summary>
        validate an password. The format of an password includes:
            - The password must be  at least one uppercase letter, 
                                    at least one lowercase letter, 
                                    at least one digit, 
                                    at least one special symbol (.),(,),(@),($), 
                                    and more than 8 character.

        </summary>
        <param name="password">the input password</param>
        <returns>true if the format of this password is correct. Else, return false</returns>
    */
    function validatePassword(password) {
        var res =false;
        if (password.match(/[a-z]/g) && password.match(/[A-Z]/g) && password.match(/[0-9]/g) 
            && password.match(/[^a-zA-Z\d]/g) && password.length >= 8)
            res = true;
        else res = false;
        return res;
    }

    /*  <summary>validate inputs. the inputs must not be null </summary>
        <param name="inputs">the inputs</param>
        <returns>true if the format of inputs is correct. Else, return false</returns>
    */
    function validateInput(inputs) {
        var checkEmpty = true;
        for (var i = 0; i < inputs.length-1; i++)
            if(inputs[i].value.trim()=="") checkEmpty=false;
        return checkEmpty;
    }


    var menuContent =document.querySelector(".menuContent");
    var menuContentDelete =document.querySelector(".menuContentDelete");
    var infoLogin =document.querySelector(".infoLogin");
    var infoRegister =document.querySelector(".infoRegister");
    var infoUser =document.querySelector(".infoUser");
    
    /*  <summary>display an dark screen for information including: confirmation, update, delete, etc.</summary>
        <returns></returns>
    */
    function showInfos(){
        blackBackground.classList.remove("menuContentDisplay");/*remove black background*/
        menuContent.classList.remove("menuContentDisplay");      /*remove black background*/
        menuContentDelete.classList.remove("menuContentDisplayDelete");
        menuContentUpdate.classList.remove("menuContentDisplayUpdate");
        infoUpdate.classList.remove("infoUpdateDisplay");
        infoUser.classList.remove("infoUserDisplay");
        infoRegister.classList.remove("infoRegisterDisplay");
        infoLogin.classList.remove("infoLoginDisplay");
    }
    /*When the player clicks on black background, hide the content of Menu*/
    blackBackground.addEventListener("click",function(){showInfos()});




    /*  <summary>display the information of a item when user click to upadte this item</summary>
        <param name="tableUpdate">the name of the table</param>
        <param name="idUpdate">the value of column id (the primary key) in this table</param>
        <param name="inputUpdate">the array of tags in the html file, 
            display the responded values from ajax request</param>
        <param name="update">the array of columns in the table</param>
        <returns></returns>
    */
    function selects(tableUpdate, idUpdate, inputUpdate, update){
        let urlItem = "selectItem.php?table="+tableUpdate+"&id="+idUpdate;

        /*reset all the inputs when the id does not match*/
        if (idUpdate==0){
            inputUpdate[0].value=0;
            for (var i = 1; i < inputUpdate.length; i++) {
                inputUpdate[i].value="";
            }
        }
        else{   /*Ajax request to get the information of an item*/
            fetch(urlItem, {credentials: 'include'}).then(response => response.text()).then(function(jsonUpdate){

                var detailsUpdate = [];
                var arrJsonUpdate = jsonUpdate.replace("{","").replace("}","").split('","');
                for (var i = 0; i < arrJsonUpdate.length-1; i++) {
                    var arrUpdateKeyValue = arrJsonUpdate[i].split('":"');
                    detailsUpdate[i] = arrUpdateKeyValue[1].replace('"',"");
                }
                for (var i = 0; i < update.length; i++) {
                    /*set the values for inputs from jsonUpdate of the ajax request*/
                    if (update[i].classList[4] == ("update-"+tableUpdate)){
                        for (var j = 0; j < detailsUpdate.length; j++) {
                            if(inputUpdate[j].type=="datetime-local"){
                                inputUpdate[j].value = detailsUpdate[j].replace(" ","T");
                            }
                            else inputUpdate[j].value = detailsUpdate[j];
                        }
                    }
                }
            });
        }
    }





    /*  <summary>Ajax request to update an item into a table</summary>
        <param name="url">fetch the url</param>
        <param name="announcement">the announcement tag in the html file</param>
        <param name="yourAnnouncement">the announcement to know if this updation is successful or not</param>
        <param name="inputs">the updated tags in the html file</param>
        <returns></returns>
    */
    function updates(url, announcement, yourAnnouncement, inputs){
        fetch(url, { credentials: 'include' }).then(response => response.text())
            .then(function(jsonText){
                if (jsonText=="update/insert successfully"){
                    announcement.innerHTML = yourAnnouncement;
                    announcement.classList.remove("d-none");
                    showInfos();
                    for (var i = 0; i < inputs.length; i++)
                        inputs[i].value="";         
                }
                else{
                    announcement.innerHTML="Your inputs are wrong";
                    announcement.classList.add("d-none");
                }
        });
    }
});


/*  <summary>set the kindOfInteractDb input</summary>
    <param name="crud">the kind of interaction (select, insert, update or delete)</param>
    <param name="table">which table is the user interacting</param>
    <param name="id">which id of this table is the user interacting</param>
    <returns></returns>
*/
function crudItem(crud, table, id) {
    document.getElementById("kindOfInteractDb").value=crud+"|"+table+"|"+id;
    document.querySelector(".blackBackground").classList.add("menuContentDisplay");
    if (crud=="delete")
        document.querySelector(".menuContentDelete").classList.add("menuContentDisplayDelete");
    else document.querySelector(".menuContentUpdate").classList.add("menuContentDisplayUpdate");
}