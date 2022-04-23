<?php 
/*
     I, Nguyen Duc Long, 000837437 certify that this material is my original work.
     No other person's work has been used without due acknowledgement.

     @date Dec 10, 2021
     @author DUC LONG NGUYEN (Paul)
     @A brief description of the file: Final project: St Joseph's Hospital Management;
        file php: update an element in a databale's table
*/
	include "connectionDb.php";    /*Call connectionDb.php file for interaction to databases*/
	$selectItems = new ConnectionDb();
    $arrTable = $selectItems->listTablesAndColumns();

    $table = filter_input(INPUT_GET, "table", FILTER_SANITIZE_SPECIAL_CHARS);

    /*set the values for each column in the table*/
    $arrColumns = array();
    foreach ($arrTable as $key => $columnName)
        if ($key==$table)
            for ($i = 0; $i < count($columnName); $i++)
                $arrColumns[$i] = filter_input(INPUT_GET, $columnName[$i]."");

    $updateItem=false;
    foreach ($arrTable as $key => $columnName)
        if ($key == $table) {
            /*CHECK ITEM IF THIS ITEM EXISTED OR NOT*/
            $checkId = $selectItems->selectItem($table, $columnName, $arrColumns[0]);
            
            /*set the values for each column in the table*/
            $listParam = array();
            for ($i = 1; $i < count($arrColumns); $i++)
                $listParam[$i] = $arrColumns[$i];

            /*IF THIS ITEM EXISTED, UPDATE THIS ITEM. IF THIS ITEM DOES NOT EXIST, INSERT THIS ITEM INTO THE TABLE*/
            if ($checkId!=NULL)     /*this $id was exist*/
                $updateItem = $selectItems->updateItem($arrColumns[0],$table,$columnName,$listParam);
            else $updateItem = $selectItems->insertItem($table, $columnName, $listParam);
        }


    if ($updateItem) 
        echo "update/insert successfully";
    else echo "update/insert fail";
 ?>

