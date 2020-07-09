jQuery.extend(jQuery.validator.messages, {
    required: "This field is required.",
    remote: "Already exists.",
    email: "Please enter a valid email address.",
    url: "Please enter a valid URL. (eg. http://www.example.com)",
    date: "Please enter a valid date.",
    dateISO: "Please enter a valid date (ISO).",
    number: "Please enter a valid number.",
    digits: "Please enter only digits.",
    creditcard: "Please enter a valid credit card number.",
    equalTo: "Both password must be same.",
    accept: "Please enter a value with a valid extension.",
    maxlength: "Please do not exceed the limit of {0} character.",
    minlength: "This field must be at least of {0} characters in length.",
    rangelength: "Please enter a value between {0} and {1} characters long.",
    range: "Please enter a value between {0} and {1}.",
    max: "Please do not exceed the limit of {0} character",
    min: "Please enter at least {0} character."
});

$(function(){
	//$.validator.messages.maxlength = 'Please do not exceed the limit of {0} character';
	$.validator.addMethod("alphanum", function(value, element) { 
		return this.optional(element) || /^[a-z0-9/_]+$/i.test(value); 
	}, "Please enter only alphanumeric characters.");
	
	$.validator.addMethod("CharsOnly", function(value, element) { 
		return this.optional(element) || /^[^0-9/_]+$/i.test(value); 
	}, "Please enter only characters.");
	
	$.validator.addMethod("NoSpecialCharacters", function(value, element) { 
       return this.optional(element) || /^[^!@#$%^&*-+|\?<>]+$/i.test(value);
	}, "Special characters are not allowed.");
	
	$.validator.addMethod("OnlyFloat", function(value, element) { 
       return this.optional(element) || /^\d*(\.\d{1})?\d{0,1}$/i.test(value);
	}, "Please enter only numeric/float value.");
	
	
	$.validator.addMethod("NoSpecialCharactersForMailingAddress", function(value, element) { 
       return this.optional(element) || /^[^!@#$%^&*-+|\?<>]+$/i.test(value);
	}, "Special characters are not allowed. (eg. Washington Ave, Memorial Park)");
	
	$.validator.addMethod("NoSpecialCharactersWithoutDollar", function(value, element) { 
       return this.optional(element) || /^[^!@#%^&*-+|\?<>]+$/i.test(value);
	}, "Special characters are not allowed.");
	
	
	$.validator.addMethod("mobileFormat", function(value, element) {
	if($('.mobile').val()){

       var status = phoneFormat2($('.mobile').val());
		   if(status)
		   return true;
		   return false;
		} else {
			return true;
		}
	}, "Invalid phone number.");
	
	$.validator.addMethod("mobileFormatWithDot", function(value, element) {
		return this.optional(element) || /^(\+\d{1,2}\s)?\(?\d{3}\)?[\s.-]\d{3}[\s.-]\d{4}$/.test(value);
	}, "Invalid phone number.");

jQuery.validator.addMethod("noSpace", function(value, element) { 
     return value.indexOf(" ") < 0 && value != ""; 
  }, "Space are not allowed");


$.validator.addMethod("imageValidate", function(value, element) { 
       var status = userImageValidate();
		   if(status)
		   return true;
		   return false;
	}, "Please upload JPG|JPEG|PNG|GIF.");



$.validator.addMethod("imageANDDocValidate", function(value, element) { 
       var status = userImageWithDocXlsValidate();
		   if(status)
		   return true;
		   return false;
	}, "Please upload JPG | JPEG | PNG | GIF | DOCX | XLSX file only.");
	
jQuery.validator.addMethod("keywordValidate", function(value, element) {
	
	
	var searchBy = $('#searchBy').val();
	var keyword = $('#keyword').val();
	
	if(searchBy=='5')
	return true;
	else{
		
			if(keyword!='')
			return true;
			return false;
	}
	 
     return value.indexOf(" ") < 0 && value != ""; 
  }, "Required field.");
	
	
	$.validator.addMethod("DateTo", function(value, element) { 
       var status = DateCheck($('.mem_start_date').val(),$('.mem_end_date').val());
		   if(status)
		   return true;
		   return false;
	}, "End date must be greater than or equal to start date.");

    $.validator.addMethod("imageValidateMp4", function(value, element) { 
       var status = userImageValidateMp4();
           if(status)
           return true;
           return false;
    }, "Please upload only MP4 File.");

    $.validator.addMethod("imageValidateMp4Size", function(value, element) { 
       var status = userImageValidateMp4Size();
           if(status)
           return true;
           return false;
    }, "Video Size should not be more than 2 MB.");

    $.validator.addMethod("imageValidateSize", function(value, element) { 
       var status = userImageValidateSize();
		   if(status)
		   return true;
		   return false;
	}, "Image Size should not be more than 2 MB.");

    $.validator.addMethod("imageValidatePDF", function(value, element) { 
	   var status = userImageValidatePDF();
	       if(status)
	       return true;
	       return false;
	}, "File Format should be PDF,DOCX,DOC.");


    $.validator.addMethod("validateFilePDF", function(value, element) { 
	   var status = userValidateFilePDF();
	       if(status)
	       return true;
	       return false;
	}, "File Format should be PDF!");
    

	$.validator.addMethod("imageValidatePdfSize", function(value, element) { 
		
       var status = userImageValidatePdfSize();
           if(status)
           return true;
           return false;
    }, "Document Size should not be more than 10 MB.");
 


   $.validator.addMethod("imageValidatePDFAndSize", function(value, element) { 
	   var status = userImageValidatePDFAndSize();
           if(status)
           return true;
           return false;
	}, "Image Size should not be more than 2 MB.");

   $.validator.addMethod("imageValidateNewsSize", function(value, element) { 
	   var status = userImageValidateNewsSize();
           if(status)
           return true;
           return false;
	}, "Image Size should not be more than 2 MB.");


    jQuery.validator.addMethod("greaterThan", 
		function(value, element, params) {

		    if (!/Invalid|NaN/.test(new Date(value))) {
		        return new Date(value) > new Date($(params).val());
		    }

		    return isNaN(value) && isNaN($(params).val()) 
		        || (Number(value) > Number($(params).val())); 
		},'Must be greater than {0}.');

    jQuery.validator.addMethod(
    "multiemail",
     function(value, element) {
         if (this.optional(element)) // return true on optional element 
             return true;
         var emails = value.split(/[;,]+/); // split element by , and ;
         valid = true;
         for (var i in emails) {
             value = emails[i];
             valid = valid &&
                     jQuery.validator.methods.email.call(this, $.trim(value), element);
         }
         return valid;
     },

    jQuery.validator.messages.email
);

});



function requiredOptionSelected() { 
		var optionV = $("input[type='radio'][name='option']:checked").val();
		if(optionV=='1' && $('#emailSelected').val()==''){
			
			return true;
			
		}else{
			
			return false;
		}
		
}
	
	
	$.validator.addMethod("GroupCheckboxOneRequired", function(value, elem, param) {
    if($(".onechkbox:checkbox:checked").length > 0){
       return true;
   }else {
       return false;
   }
},"Please check at least one.");


$.validator.addMethod("InputAginstRequired", function(value, elem, param) {
	var x=0;
   $('.onechkbox').each(function(){
   var $this = $(this);
    if ($this.is(':checked')) {
		
		 var InputVal = $(this).parent().parent().find('input[type=text]').val();
			if(InputVal==''){
				x=1;
			}
    }
    
});

if(x==1) return false;
return true;   
   
},"Please enter float value in all box.");


jQuery.validator.setDefaults({
    errorPlacement: function(error, element){
    if(element.attr("name") == "price[]"){
        error.appendTo($('#errorbox'));
    }
    if(element.attr("name") == "options_values_id[]"){
        error.appendTo($('#errorbox'));
    }
}
});

 function userImageValidate()
 {
		var userImage = $("#upload").val();

		if(userImage != "") {
		
	        var extension = userImage.split('.').pop().toUpperCase();
	        
	        if (extension!="PNG" && extension!="JPG" && extension!="GIF" && extension!="JPEG"){
	            return 0;
	        }
	        else {
	            return 1;
	        }
	        
 		} else {

 			return 1;

 		}
	}
 
 
 function phoneFormat2(mobile) { 
    var phoneRegEx =/^\(\d{3}\) \d{3}-\d{4}$/; 
     if(mobile.match(phoneRegEx)) {
         return 1;            
     } else{
          return 0;      
     }
    
}

 function userImageValidatePDF()
 {
        var userImage = $("#upload").val();
        if(userImage!=""){
        
        var extension = userImage.split('.').pop().toUpperCase();
        
        if (extension!="PDF" && extension!="DOCX" && extension!="DOC"){
            return 0;
        }
        else {
            return 1;
        }
    }
    else{
        return 1;
    }
 }

  function userValidateFilePDF()
 {
        var userImage = $("#upload").val();
        if(userImage!=""){
        
        var extension = userImage.split('.').pop().toUpperCase();
        
        if (extension!="PDF"){
            return 0;
        }
        else {
            return 1;
        }
    }
    else{
        return 1;
    }
 }

 function phoneFormat(mobile) { 
    var phoneRegEx =/^(\+\d{1,2}\s)?\(?\d{3}\)?[\s.-]\d{3}[\s.-]\d{4}$/; 
     if(mobile.match(phoneRegEx)) {
         return 1;            
     } else{
          return 0;      
     }
    
}

function userImageValidateMp4()
 {
        var userImage = $("#video").val();
        if(userImage!=""){
        
        var extension = userImage.split('.').pop().toUpperCase();
        
        if (extension!="MP4"){
            return 0;
        }
        else {
            return 1;
        }
    }
    else{
        return 1;
    }
 }

 function userImageValidateMp4Size()
 {
        var video = $("#video").val();
        if(video!=""){
        var userImage = $("#video")[0].files[0].size;
        
        if (userImage > "2097152"){
            return 0;
        }
        else {
            return 1;
        }
    }else{
        return 1;
    }
 }

  function userImageValidateSize()
 {
        var video = $("#upload").val();
        if(video!=""){
        var userImage = $("#upload")[0].files[0].size;
        
        if (userImage > "2097152"){
            return 0;
        }
        else {
            return 1;
        }
    }else{
        return 1;
    }
 }

function userImageValidatePDFAndSize(){
	var video = $("#upload").val();
        if(video!=""){
        var userImage = $("#upload")[0].files[0].size;
        
        if (userImage > "2097152"){
            return 0;
        }
        else {
            return 1;
        }
    }else{
        return 1;
    }
}


 function userImageValidatePdfSize()
 {
        var video = $("#pdf").val();
        if(video!=""){
        var userImage = $("#pdf")[0].files[0].size;
        
        if (userImage > "10000000"){
            return 0;
        }
        else {
            return 1;
        }
    }else{
        return 1;
    }
 }

function userImageValidateNewsSize()
 {
        var video = $("#image").val();
        if(video!=""){
        var userImage = $("#image")[0].files[0].size;
        if (userImage > "2097152"){
            return 0;
        }
        else {
            return 1;
        }
    }else{
        return 0;
    }
 }


  function userImageValidatePdfSize()
 {
        var video = $("#upload").val();
        if(video!=""){
        var userImage = $("#upload")[0].files[0].size;
        
        if (userImage > "10000000"){
            return 0;
        }
        else {
            return 1;
        }
    }else{
        return 1;
    }
 }


function DateCheck(start,end){

    /*var st = start.split('-');
    st = st[1]+'/'+st[0]+'/'+st[2];

    var en = end.split('-');
    en = en[1]+'/'+en[0]+'/'+en[2];*/

	var s = new Date(start);
    var e = new Date(end);
    //console.log(s);
    //console.log(e);
   if(end!=''){

	if(s.getTime() > e.getTime()){
			return 0;	
		}else{
			return 1;
		}
	}else{
		return 1;
	}	
}


$(document).ready(function() {
	
	
/*---------------Start Validate pages-----------------*/

/*---------------Start Validation for Add User-----------------*/


$("#loginform").validate({
		
    debug: false,
    errorClass: "errorClass",
    errorElement: "span",
    rules: {
        "username": {
            required: true,
            email: true,
            noSpace: true, 
        },
        "password": {
            required: true,
        },
    },
    errorPlacement: function(error, element) {
        error.insertAfter(element.parent("div"));
    }
});

$("#changePass").validate({
		
    debug: false,
    errorClass: "errorClass",
    errorElement: "span",
    rules: {
        "currentpass": {
            required: true,
            noSpace: true,
        },
        "password": {
            required: true,
            noSpace: true,
        },
        "cpassword": {
            required: true,
            equalTo: "#password"
        }
    },
    errorPlacement: function(error, element) {
        error.insertAfter(element);
    }
});

$("#forgotpwd").validate({
		
    debug: false,
    errorClass: "errorClass",
    errorElement: "span",
    rules: {
        "email": {
            required: true,
            email: true,
            noSpace: true, 
        }
    },
    errorPlacement: function(error, element) {
        error.insertAfter(element.parent("div"));
    }
});

});