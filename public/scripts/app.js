// Client facing scripts here
$(document).ready(function(){
  
  $("form").submit(function(event){
    
    event.preventDefault();
    var formValues = $(form).serializeArray();;
    console.log(formValues);
    
  }); 


});

