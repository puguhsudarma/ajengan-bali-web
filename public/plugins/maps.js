
$(document).ready(function(){


      function initMap() {


        if (navigator.geolocation) {
          var map = new google.maps.Map(document.getElementById('map'), {
            center: {lat: -8.511726, lng: 115.241275},
            zoom: 14
          });
          var marker = new google.maps.Marker({map: map});
          navigator.geolocation.getCurrentPosition(
            function(position) {
            var pos = {
              lat: position.coords.latitude,
              lng: position.coords.longitude
            };
            marker.setPosition(pos);
            marker.setDraggable(true);
            $("#t_lat").val(position.coords.latitude.toFixed(6));
            $("#t_long").val(position.coords.longitude.toFixed(6));

            map.setCenter(pos);

          },
          function(){
            alert("Geolocation not allowed! Location set to center of Bali instead!");
            var error = {
              lat: -8.511726,
               lng: 115.241279
            };
            marker.setPosition(error);
            marker.setDraggable(true);
            $("#t_lat").val(-8.511726);
            $("#t_long").val(115.241279) ;

            map.setCenter(error);
            map.setZoom(10);
          }
        );
        }
        else {
          alert('Your Browser Doesnt Support Geolocation! Location set to center of Bali Instead!');
          var error = {
            lat: -8.511726,
             lng: 115.241279
          };
          marker.setPosition(error);
          marker.setDraggable(true);
          $("#t_lat").val(-8.511726);
          $("#t_long").val(115.241279) ;

          map.setCenter(error);
        }

        google.maps.event.addListener(marker, 'dragend', function (event) {
            $("#t_lat").val(this.getPosition().lat().toFixed(6));
            $("#t_long").val(this.getPosition().lng().toFixed(6));
        });
      }


    $("#btn-add").click(function(){
        initMap();
    });



  });
