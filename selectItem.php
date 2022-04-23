<?php 
/*
     I, Nguyen Duc Long, 000837437 certify that this material is my original work.
     No other person's work has been used without due acknowledgement.

     @date Dec 10, 2021
     @author DUC LONG NGUYEN (Paul)
     @A brief description of the file: Final project: St Joseph's Hospital Management;
        file php: select an element in a databale's table
*/
    include "connectionDb.php";     /*Call connectionDb.php file for interaction to databases*/
    $selectItems = new ConnectionDb();
    $arrTable = $selectItems->listTablesAndColumns();

    $table = filter_input(INPUT_GET, "table", FILTER_SANITIZE_SPECIAL_CHARS);
    $id = filter_input(INPUT_GET, "id", FILTER_VALIDATE_INT);

    $itemQuery=NULL;

    /*CHECK ITEM IF THIS ITEM EXISTED OR NOT. */
    foreach ($arrTable as $key => $value)
        if ($key == $table) 
            $itemQuery = $selectItems->selectItem($table, $value, $id);

    /*IF ITEM EXISTED, SELECT THIS ITEM*/
    $item = NULL;
    if ($itemQuery!=NULL) 
        foreach ($itemQuery as $key => $value) 
            if (!is_numeric($key)) 
                $item[$key] = $value;

    echo json_encode($item);
 ?>

