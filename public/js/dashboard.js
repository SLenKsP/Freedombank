$('#nav-account').on('click',function(){
    $(".send-money").hide();
    $('.loans').hide();
    $('.update-account').hide();
    $('.account').show();
    $('.deposit').hide();
})
$('#nav-deposit').on('click',function(){
    $('.deposit').show();
    $(".send-money").hide();
    $('.loans').hide();
    $('.update-account').hide();
    $('.account').hide();
})
$('#nav-send-money').on('click',function(){
    $('.account').hide();
    $('.loans').hide();
    $('.update-account').hide();
    $('.send-money').show();
    $('.deposit').hide();
})

$('#nav-loans').on("click",function(){
    $('.account').hide();
    $('.update-account').hide();
    $('.send-money').hide();
    $('.loans').show();
    $('.deposit').hide();
})

$('#nav-update-account').on('click',function(){
    $('.account').hide();
    $('.loans').hide();
    $('.send-money').hide();
    $('.update-account').show();
    $('.deposit').hide();
})

$('#send-money-button').on('click',function(){
    event.preventDefault()
    let amount = $('#send-money-input').val().trim()
    let email = $("#send-email-input").val().trim()

    $('#sendmoneyamount').text(`You are sending $${amount}`)
    $('#sendemail').text(`to the Email Address of ${email}`)
    $('.send-money-modal').css('display','block')
})

$('#cancel-money').on('click',function(){
    event.preventDefault()
    $('.send-money-modal').css('display','none')
})

$('#send-money-confirm').on('click',function(){

})
$(".account-edit-button").click(function(e) {
    e.preventDefault();
    $(`.account-info`).hide();
    $(this).hide();
    $(".edit-info").show();
    $("#save-changes").show();
    $("#cancel-editing").show();
  });
  $("#save-changes").click(function(e) {
    e.preventDefault();
  
    var updatedFirstName = $(`#edit-firstName`)
      .val()
      .trim();
    var updatedLastName = $(`#edit-lastName`)
      .val()
      .trim();
    var updatedAddress = $(`#edit-address`)
      .val()
      .trim();
    var emailUsed = $(`#affected-email`).attr("value");
    console.log(
      `New name is ${updatedFirstName}\n ${updatedLastName} \n ${updatedAddress}`
    );
    var editData = {
      first_name: updatedFirstName,
      last_name: updatedLastName,
      email: emailUsed,
      address: updatedAddress
    };
  
    console.log(`Sending data is ${JSON.stringify(editData, null, 2)}`);
    $.ajax({
      type: "PUT",
      url: "/api/updateaccount",
      data: editData,
    }).then((result) => {
      location.reload();
      console.log(`The Result is ${JSON.stringify()}`);
    });
  
  
    $(".edit-info").hide();
    $(this).hide();
    $("#cancel-editing").hide();
    $(`.account-info`).show();
    $(".account-edit-button").show();
  });
  $("#cancel-editing").click(function(e) {
    e.preventDefault();
    $(".edit-info").hide();
    $(this).hide();
    $("#save-changes").hide();
    $(`.account-info`).show();
    $(".account-edit-button").show();
  });
  