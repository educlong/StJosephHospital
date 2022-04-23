<?php 
/*
     I, Nguyen Duc Long, 000837437 certify that this material is my original work.
     No other person's work has been used without due acknowledgement.

     @date Dec 10, 2021
     @author DUC LONG NGUYEN (Paul)
     @A brief description of the file: Final project: St Joseph's Hospital Management;
        file php: select all the elements in a databale's table
*/
    include "connectionDb.php";     /*Call connectionDb.php file for interaction to databases*/
	$selectItems = new ConnectionDb();

    $table = filter_input(INPUT_GET, "table", FILTER_SANITIZE_SPECIAL_CHARS);
    $id = filter_input(INPUT_GET, "id", FILTER_SANITIZE_SPECIAL_CHARS);

    /*SELECT ALL THE ITEMS IN THIS TABLE*/
    $allItems = $selectItems->selectAllItems($table, $id);
    
    echo $allItems
 ?>

