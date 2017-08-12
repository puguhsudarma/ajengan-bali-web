  function initMap() {
        var map = new google.maps.Map(document.getElementById('map'), {
          center: {lat: -8.511726, lng: 115.241275},
          zoom: 14
        });
        var marker = new google.maps.Marker({map: map});

        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(
            function(position) {
            var pos = {
              lat: position.coords.latitude,
              lng: position.coords.longitude
            };
            marker.setPosition(pos);
            marker.setDraggable(true);
            $("#t_lat").value = position.coords.latitude.toFixed(6);
            document.getElementById("t_long").value = position.coords.longitude.toFixed(6);

            map.setCenter(pos);

          });
        }
        else {
          var error = {
            lat: -8.511726,
             lng: 115.241279
          };
          marker.setPosition(error);
          marker.setDraggable(true);
          document.getElementById("t_lat").value = -8.511726;
          document.getElementById("t_long").value = 115.241279;

          map.setCenter(error);
          alert('disini');
        }

        google.maps.event.addListener(marker, 'dragend', function (event) {
            document.getElementById("t_lat").value = this.getPosition().lat().toFixed(6);
            document.getElementById("t_long").value = this.getPosition().lng().toFixed(6);
        });
      }

    $("#btn-add").click(function(){
        initMap();

    });

    $("#t_regency").change(function(){
      id = this.val();
      alert("");

    });
