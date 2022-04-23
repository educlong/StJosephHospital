<?php 
/*
     I, Nguyen Duc Long, 000837437 certify that this material is my original work.
     No other person's work has been used without due acknowledgement.

     @date Dec 10, 2021
     @author DUC LONG NGUYEN (Paul)
     @A brief description of the file: Final project: St Joseph's Hospital Management;
        file php: login function, 
            set values for sessions when user login with correct email and password
            unset and destroy all the sessions when user login with incorrect email/password
*/
    session_start();

    include "connectionDb.php";     /*Call connectionDb.php file for interaction to databases*/
    $selectItems = new ConnectionDb();

    $email = filter_input(INPUT_GET, "email", FILTER_SANITIZE_SPECIAL_CHARS);
    $password = filter_input(INPUT_GET, "password", FILTER_SANITIZE_SPECIAL_CHARS);

    $userQuery = $selectItems->login($email,$password);

    /*set the values for each session if this user exist*/
    if ($userQuery!=NULL) {
        foreach ($userQuery as $key => $value)
            if (!is_numeric($key))
                $_SESSION[$key] = $value;
        echo json_encode($userQuery);
    }
    /*if this user does not exist, unset and destroy the session*/
    else{
        session_unset();
        session_destroy();
        echo "{}";
    } 
 ?>

