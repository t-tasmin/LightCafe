// Client facing scripts here
$(document).ready(function(){
  
  $("button").click(function(){
    var item_Name = [];
    var number_of_Items = [];

    $.each($("input[name='itemName']:checked"), function(){
      item_Name.push($(this).val());
    });

    $.each($("input[type='text']"), function(){
        if ($(this).val()!==""){
        number_of_Items.push($(this).val()); 
      }
  }) 
  console.log(item_Name);
  console.log(number_of_Items);
  
  alert(item_Name.join(", ")+ number_of_Items.join(", "));

});

});



