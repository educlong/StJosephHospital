<?php 
/*
     I, Nguyen Duc Long, 000837437 certify that this material is my original work.
     No other person's work has been used without due acknowledgement.

     @date Dec 10, 2021
     @author DUC LONG NGUYEN (Paul)
     @A brief description of the file: Final project: St Joseph's Hospital Management;
        file php: delete an element in a databale's table
*/
	include "connectionDb.php";    /*Call connectionDb.php file for interaction to databases*/
	$selectItems = new ConnectionDb();
    $arrTable = $selectItems->listTablesAndColumns();

    $table = filter_input(INPUT_GET, "table", FILTER_SANITIZE_SPECIAL_CHARS);
    $id = filter_input(INPUT_GET, "id", FILTER_VALIDATE_INT);

    $deleteItem=false;

    foreach ($arrTable as $key => $value) {
        if ($key == $table) {
            /*CHECK ITEM IF THIS ITEM EXISTED OR NOT. IF ITEM EXISTED, DELETE THIS ITEM*/
            $checkId = $selectItems->selectItem($table, $value, $id);
            if ($checkId!=NULL) 
                $deleteItem = $selectItems->deleteItem($table, $value, $id);
            else $deleteItem = false;
        }
    }

    if ($deleteItem) 
        echo "delete successfully";
    else echo "delete fail";
 ?>

