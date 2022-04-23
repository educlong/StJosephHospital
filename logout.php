<?php 
/*
     I, Nguyen Duc Long, 000837437 certify that this material is my original work.
     No other person's work has been used without due acknowledgement.

     @date Dec 10, 2021
     @author DUC LONG NGUYEN (Paul)
     @A brief description of the file: Final project: St Joseph's Hospital Management;
        file php: logout function, unset and destroy all the sessions when user logout
*/
    session_start();
    session_unset();
    session_destroy();
 ?>

