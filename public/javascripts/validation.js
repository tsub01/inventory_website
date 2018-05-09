// Validate form
function validForm(){
	if(validId(document.product_information.id)){
		if(validName(document.product_information.name)){
			if(validPrice(document.product_information.price)){
				if(validQuantity(document.product_information.quantity)){
					return true;
				}
			}
		}
	}
	return false;
}

function validId(id){
	var requiredLength = 5;
	if(notEmpty(id)){
		if(id.value.length === requiredLength){
			if(allNumeric(id)){
				return true;
			}
		}
		else{
			alert("ID field must be " + requiredLength + " digits long");
		}
	}
	return false;
}


function validName(name){
	var maxLength = 15;
	if(notEmpty(name)){
		if(allAlpha(name)){
			if(name.value.length <= maxLength){
				return true;
			}
			else{
				alert("Name field must not contain more than " + maxLength + " characters");
			}
		}
	}
	return false;
}

function validPrice(price){
	var priceExp1 = RegExp("^[0-9]*\.[0-9][0-9]$");
	var priceExp2 = RegExp("^[0-9]+");
	if(notEmpty(price)){
		if(priceExp1.test(price.value) || priceExp2.test(price.value)){
			if(price.value <= 9999.99){
				return true;
			}
			else{
				alert("Price cannot exceed $9999.99");
			}
		}
		else{
			alert("Price must be in the form of either XXXX or XXXX.XX");
		}
	}
	return false;
}

function validQuantity(quantity){
	if(notEmpty(quantity)){
		if(allNumeric(quantity)){
			if(quantity.value.length <= 999999){
				return true;
			}
			else{
				alert("Quantity cannot exceed 999999");
			}
		}
	}
	return false;
}


function notEmpty(input){
	if(input.value.length !== 0){
		return true;
	}
	var fieldName = input.name;
	alert(fieldName + " field cannot be empty.");
	return false;
}

function allNumeric(input){
	var numbers = RegExp("^[0-9]+$");
	if(numbers.test(input.value)){
		return true;
	}
	var fieldName = input.name;
	alert(fieldName + " field must contain only numeric characters");
	return false;
}

function allAlpha(input){
	var letters = RegExp("^[A-Za-z]+[A-Za-z ]*$");
	if(letters.test(input.value)){
		return true;
	}
	var fieldName = input.name;
	alert(fieldName + " field must contain only alphabetical characters");
	return false;
}