(function($){
  $(function(){


    $('.tiketID').click(function(){

        $('#modal-tickets').openModal();
    });



    $('.button-collapse').sideNav();
    $('.parallax').parallax();

    $('.modal-trigger').leanModal({
     dismissible: false, // Modal can be dismissed by clicking outside of the modal
     opacity: .5, // Opacity of modal background
     in_duration: 300, // Transition in duration
     out_duration: 200, // Transition out duration
     starting_top: '4%', // Starting top style attribute
     ending_top: '10%', // Ending top style attribute
   }
 );


  }); // end of document ready
})(jQuery); // end of jQuery name space
