
  $(document).ready(function() {

    var now;
    var id;
    /* initialize the external events
    -----------------------------------------------------------------*/
    $('#external-events .fc-event').each(function() {

      // store data so the calendar knows to render an event upon drop
      $(this).data('event', {
        title: $.trim($(this).text()), // use the element's text as the event title
        stick: true, // maintain when user navigates (see docs on the renderEvent method)
        color: '#00bcd4'
      });

      // make the event draggable using jQuery UI
      $(this).draggable({
        zIndex: 999,
        revert: true,      // will cause the event to go back to its
        revertDuration: 0  //  original position after the drag
      });

    });

    function getToday(){
      var date = new Date();
      var month = date.getUTCMonth() + 1; //months from 1-12
      var day = date.getUTCDate();
      var year = date.getUTCFullYear();

      now = year + "-" + month + "-" + day;
      id = $('.event').data('id');
    }

    getToday();

    /* initialize the calendar
    -----------------------------------------------------------------*/
    $('#calendar').fullCalendar({
      header: {
        left: 'prev,next today',
        center: 'title',
        right: 'month,basicWeek,basicDay'
      },
      defaultDate: now,
      events: function(start, end, timezone, callback) {
        jQuery.ajax({
          type:"POST",
          url: "http://localhost/tikettari/index.php/extranet/getEvent",
          dataType: "text",
          data:{id: id},
          async: true,
            success: function(response) {
                var eventr = [];
                var obj = $.parseJSON(response);
                var events = $('#calendar').fullCalendar();
                $.each(obj,function(index, object) {
                  if(object['status']=='available'){
                    eventr.push({
                            title: object['event_name'],
                            start: object['date'],
                            end: object['date'],
                            color: '#00C853'

                      });
                    }
                  else{
                    eventr.push({
                            title: object['event_name'],
                            start: object['date'],
                            end: object['date'],
                            color: '#D50000'
                      });      
                  }


                  });

                console.log(eventr);
                callback(eventr);
            }
        });
    }
    });

  });
