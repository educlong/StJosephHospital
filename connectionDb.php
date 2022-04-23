<?php 
/*
     I, Nguyen Duc Long, 000837437 certify that this material is my original work.
     No other person's work has been used without due acknowledgement.

     @date Dec 10, 2021
     @author DUC LONG NGUYEN (Paul)
     @A brief description of the file: Final project: St Joseph's Hospital Management;
        file php: interaction with databases including:
        	- connection the database
        	- select all the items in a table
        	- select an item in a table
        	- insert an item in a table
        	- update an item in a table
        	- delete an item in a table
        	- select an user from finalproject_users table through user's email and password
*/
	class ConnectionDb {
		/* 	<summary>CONNECT TO DATABASE</summary>
			<returns>a dbh</returns>
        */
		public function connectDBH()
		{
			$DBH=null;
			try {
				$DB_CONNECTION="mysql";
				$DB_HOST="localhost";
				$DB_DATABASE="id18180065_paul";
				$DB_USERNAME="id18180065_educlong";
				$DB_PASSWORD="P@ul@dmin1001";
				$DBH=new PDO($DB_CONNECTION.":host=".$DB_HOST.";dbname=".$DB_DATABASE,$DB_USERNAME,$DB_PASSWORD);
			} catch (PDOException  $e) {
				echo "ERROR: CANNOT CONNECT TO THE DATABASE. ".$e->getMessage();
			}
			return $DBH;
		}

		/* 	<summary>List of table and column for each table in the database</summary>
			<returns>an array represents a database including all the tables and columns for each table</returns>
        */
		public function listTablesAndColumns()
		{
			$admissions = ["admissions_id", "patient_id", "admission_date", "discharge_date", "primary_diagnosis", 
                "secondary_diagnoses", "attending_physician_id", "nursing_unit_id", "room","bed"];
		    $departments = ["department_id", "department_name", "manager_first_name", "manager_last_name"];
		    $encounters = ["encounter_id", "patient_id", "physician_id", "encounter_date_time", "notes"];
		    $medications = ["medication_id", "medication_description", "medication_cost", "package_size", "strength", 
		                    "sig", "units_used_ytd", "last_prescribed_date"];
		    $items = ["item_id", "item_description", "item_cost", "quantity_on_hand", "usage_ytd", "primary_vendor_id", 
		                    "primary_vendor_id", "primary_vendor_id"];
		    $nursing_units = ["nursing__id", "nursing_unit_id", "specialty", "manager_first_name", "manager_last_name", 
		                    "beds", "extension"];
		    $patients = ["patient_id", "first_name", "last_name", "gender", "birth_date", "street_address", "city",
		                     "province_id", "postal_code", "health_card_num", "allergies", "patient_height", "patient_weight"];
		    $physicians = ["physician_id", "first_name", "last_name", "specialty", "phone", "ohip_registration"];
		    $provinces = ["id", "province_id", "province_name"];
		    $purchase_orders = ["purchase_order_id", "order_date", "department_id", "vendor_id", "total_amount", "order_status"];
		    $purchase_order_lines = ["purchase_order_lines_id", "purchase_order_id", "line_num", "item_id", "quantity", 
		                                "unit_cost", "received", "cancelled", "last_arrived_date"];
		    $unit_dose_orders = ["unit_dose_order_id", "patient_id", "medication_id", "dosage", "sig", "dosage_route", 
		                            "pharmacist_initials", "entered_date"];
		    $vendors = ["vendor_id", "vendor_name", "street_address", "city", "province_id", "postal_code", "contact_first_name", 
		                    "contact_last_name", "purchases_ytd"];
			$users = ["user_id", "user_email", "user_password", "authoritative", "patient_id"];

		    $arrTable = [
		        'admissions' => $admissions, 
		        'departments' => $departments,
		        'encounters' => $encounters,
		        'medications' => $medications,
		        'items' => $items,
		        'nursing_units' => $nursing_units,
		        'patients' => $patients,
		        'physicians' => $physicians,
		        'provinces' => $provinces,
		        'purchase_orders' => $purchase_orders,
		        'purchase_order_lines' => $purchase_order_lines,
		        'unit_dose_orders' => $unit_dose_orders,
		        'vendors' => $vendors,
		        'users' => $users
		    ];
		    return $arrTable;
		}

    

	    /* 	<summary>SELECT ALL ITEMS IN TABLE</summary>
        	<param name="table">the name of the table</param>
        	<param name="id">the name of column id (the primary key) for this table (sort by id desc)</param>
			<returns>a json array all the items in this table</returns>
        */
        public function selectAllItemsWithDeleted($table, $id) {
			$command='SELECT VALUE FROM `st_joseph_hospital_management` WHERE `name`=?';
			$stmt=$this->connectDBH()->prepare($command);
			$params=[$table];
			$success=$stmt->execute($params);
			$items = null;
			if ($success)
				while ($rowElement=$stmt->fetch())
					$items = $rowElement['VALUE'];
			$arrItems = [];
    	    foreach (json_decode($items) as $item)
    	        foreach ($item as $key => $value)
    	            if($key==='isDelete')
	    	            array_push($arrItems, $item);
    	    $arrItems = array_reverse($arrItems);
	        return json_encode($arrItems);
	    }
	    public function selectAllItems($table, $id) {
			$command='SELECT VALUE FROM `st_joseph_hospital_management` WHERE `name`=?';
			$stmt=$this->connectDBH()->prepare($command);
			$params=[$table];
			$success=$stmt->execute($params);
			$items = null;
			if ($success)
				while ($rowElement=$stmt->fetch())
					$items = $rowElement['VALUE'];
			$arrItems = [];
    	    foreach (json_decode($items) as $item)
    	        foreach ($item as $key => $value)
        	       if($key==='isDelete' && $value==='0')
    	    	        array_push($arrItems, $item);
    	    $arrItems = array_reverse($arrItems);
	        return json_encode($arrItems);
	    }

	    /* 	<summary>SELECT AN ITEM IN TABLE</summary>
        	<param name="table">the name of the table</param>
        	<param name="columns">an array of all the columns in this table (excluding isDelete column)</param>
        	<param name="id">the value of column id (the primary key) in this table</param>
			<returns>an item in this table if this item exist. Else, the method returns null value</returns>
        */
	    public function selectItem($table, $columns, $id) {
	        $arrItems = json_decode($this->selectAllItems($table, $id));
	        $arrItem = null;
	        foreach ($arrItems as $item) 
	            foreach ($item as $keyItem => $valueItem) 
	                if($keyItem===$columns[0] && intval($valueItem)===intval($id))
	                   foreach ($item as $key => $value) 
    	                    if(!is_numeric($key))
    	                        $arrItem[$key] = $value;
            return $arrItem;
	    }

	    /* 	<summary>IF ITEM DOES NOT EXIST, INSERT THIS ITEM</summary>
        	<param name="table">the name of the table</param>
        	<param name="columns">an array of all the columns in this table (excluding isDelete column)</param>
        	<param name="listParam">an array of all the values 
        			for each column in this table (excluding isDelete column and id column)</param>
			<returns>true if insertion this item into the databae is successful. Else, return false.</returns>
        */
	    public function insertItem($table, $columns, $listParam){
	        $arrItems = json_decode($this->selectAllItemsWithDeleted($table, $columns[0]));
	        //sort by id ascending
            usort($arrItems, function($item1, $item2) {
                foreach ($item1 as $key1 => $value1){
                    if(intval($key1)=='0')
                        foreach ($item2 as $key2 => $value2)
                            if(intval($key2)=='0')
                                return intval($value1) > intval($value2);
                }
            });
	        $newItem = null;
	        //set id
			foreach ($arrItems[count($arrItems)-1] as $key => $value)
			    if($key===$columns[0] || $key==='0')
				    $newItem->$key = strval(intval($value)+1);
			//set value
	        foreach ($listParam as $key => $value)
				$newItem->$key = $value;
			//set isdelete
			$indexIsDelete = strval(count($columns));
			$newItem->$indexIsDelete = '0';
	        foreach ($columns as $keyColumn => $valueColumn)
	            foreach ($listParam as $keyValue => $valueValue)
	                if($keyColumn===$keyValue)
	                    $newItem->$valueColumn = $valueValue;
			//set isdelete
			$newItem->isDelete = '0';
            $arrItems = array_merge($arrItems,[$newItem]);
			
			$command='UPDATE `st_joseph_hospital_management` SET `value`=? WHERE `name`=?';
			$stmt=$this->connectDBH()->prepare($command);
			$params=[json_encode($arrItems),$table];
			$success=$stmt->execute($params);
			if ($success)  return true;
			else return false;
	    }

	    /* 	<summary>IF ITEM EXISTED, UPDATE THIS ITEM</summary>
        	<param name="id">the value of id column ( the value of the primary key) for the table</param>
        	<param name="table">the name of the table</param>
        	<param name="columns">an array of all the columns in this table (excluding isDelete column)</param>
        	<param name="listParam">an array of all the values 
        			for each column in this table (excluding isDelete column and id column)</param>
			<returns>true if updation this item into the databae is successful. Else, return false.</returns>
        */
	    public function  updateItem($id, $table, $columns, $listParam){
	        $arrItems = json_decode($this->selectAllItemsWithDeleted($table, $columns[0]));
	        //sort by id ascending
            usort($arrItems, function($item1, $item2) {
                foreach ($item1 as $key1 => $value1){
                    if(intval($key1)=='0')
                        foreach ($item2 as $key2 => $value2)
                            if(intval($key2)=='0')
                                return intval($value1) > intval($value2);
                }
            });
	        $newItem = null;
	        //set id
			foreach ($arrItems[count($arrItems)-1] as $key => $value)
			    if($key===$columns[0] || $key==='0')
				    $newItem->$key = $id;
			//set value
	        foreach ($listParam as $key => $value)
				$newItem->$key = $value;
			//set isdelete
			$indexIsDelete = strval(count($columns));
			$newItem->$indexIsDelete = '0';
	        foreach ($columns as $keyColumn => $valueColumn)
	            foreach ($listParam as $keyValue => $valueValue)
	                if($keyColumn===$keyValue)
	                    $newItem->$valueColumn = $valueValue;
			//set isdelete
			$newItem->isDelete = '0';
			
			//remove the previous value in the array
            $itemRemove = null;
            foreach ($arrItems as $item) 
	            foreach ($item as $keyItem => $valueItem) 
	                if($keyItem===$columns[0] && intval($valueItem)===intval($id))
	                   $itemRemove = $item;
	        if (($key = array_search($itemRemove, $arrItems)) !== false)
                unset($arrItems[$key]);
            
            //add the new value into the array
            $arrItems = array_merge($arrItems,[$newItem]);
			//sort by id ascending
            usort($arrItems, function($item1, $item2) {
                foreach ($item1 as $key1 => $value1){
                    if(intval($key1)=='0')
                        foreach ($item2 as $key2 => $value2)
                            if(intval($key2)=='0')
                                return intval($value1) > intval($value2);
                }
            });
			$command='UPDATE `st_joseph_hospital_management` SET `value`=? WHERE `name`=?';
			$stmt=$this->connectDBH()->prepare($command);
			$params=[json_encode($arrItems),$table];
			$success=$stmt->execute($params);
			if ($success)  return true;
			else return false;
	    }

	    /* 	<summary>IF ITEM EXISTED, DELETE THIS ITEM</summary>
        	<param name="table">the name of the table</param>
        	<param name="columns">an array of all the columns in this table (excluding isDelete column)</param>
        	<param name="id">the value of id column ( the value of the primary key) for the table</param>
			<returns>true if deletion this item from the databae is successful. Else, return false.</returns>
        */
	    public function deleteItem($table, $columns, $id)
	    {
	        $arrItems = json_decode($this->selectAllItemsWithDeleted($table, $columns[0]));
	        $arrItem = null;
	        //change the value of the 'isDelete' column
	        foreach ($arrItems as $item) 
	            foreach ($item as $keyItem => $valueItem) 
	                if($keyItem===$columns[0] && intval($valueItem)===intval($id))
	                   foreach ($item as $key => $value){
    	                   $arrItem[$key] = $value;
    	                   if($key==='isDelete') $arrItem[$key] = '1';
	                   }
           foreach ($arrItems as $item) 
	            foreach ($item as $keyItem => $valueItem) 
	                if($keyItem===$columns[0] && intval($valueItem)===intval($id))
	                   foreach ($item as $key => $value)
    	                   if($key==(count($arrItem)/2-1)) $arrItem[$key] = '1';
            //push the deleted value into the array
            $itemRemove = null;
            foreach ($arrItems as $item) 
	            foreach ($item as $keyItem => $valueItem) 
	                if($keyItem===$columns[0] && intval($valueItem)===intval($id))
	                   $itemRemove = $item;
	        if (($key = array_search($itemRemove, $arrItems)) !== false)
                unset($arrItems[$key]);
            $arrItems = array_merge($arrItems,[$arrItem]);
            //sort by id descending
            usort($arrItems, function($item1, $item2) {
                foreach ($item1 as $key1 => $value1){
                    if(intval($key1)=='0')
                        foreach ($item2 as $key2 => $value2)
                            if(intval($key2)=='0')
                                return intval($value1) > intval($value2);
                }
            });
			$command='UPDATE `st_joseph_hospital_management` SET `value`=? WHERE `name`=?';
			$stmt=$this->connectDBH()->prepare($command);
			$params=[json_encode($arrItems),$table];
			$success=$stmt->execute($params);
			if ($success)  return true;
			else return false;
	    }
	    

	    /* 	<summary>LOGIN FUNCTION</summary>
        	<param name="email">the user's email</param>
        	<param name="password">the user's password</param>
			<returns>an user if this user exist. Else, the method returns null value</returns>
        */
	    public function login($email, $password)
	    {
	        $arrItems = json_decode($this->selectAllItems("users", "user_id"));
	        $arrItem = null;
	        $isEmail = false;
	        $isPassword = false;
	        foreach ($arrItems as $item) {  //check email
	            foreach ($item as $keyItem => $valueItem) {
	                $isEmail = ($keyItem==="user_email" && $valueItem===$email);
	                if($isEmail) break;
	            }
	            if($isEmail) break;
	        }
	        foreach ($arrItems as $item) {  //check password
	            foreach ($item as $keyItem => $valueItem) {
	                $isPassword = ($keyItem==="user_password" && $valueItem===$password);
	                if($isPassword) break;
	            }
	            if($isPassword) break;
	        }
	        
	        foreach ($arrItems as $item)    ////check email and password
	            foreach ($item as $keyItem => $valueItem) 
	                if($isEmail && $isPassword)
	                   foreach ($item as $key => $value)
                            $arrItem[$key] = $value;
            return $arrItem;
	    }
	}

 ?>