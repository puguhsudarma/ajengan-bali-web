angular.module('ajegliApp.controllers', [])
  .controller('RootCtrl', function ($state) {
    $state.go('login');
  })

  .controller('TicketsCtrl', function ($filter, $scope, $http, DTOptionsBuilder, DTColumnBuilder, Backand, DashService, TicketsService) {

    if (localStorage.getItem("auth") == 'authorized') {
      var self = this;
      var baseUrl = '/1/objects/';
      var baseActionUrl = baseUrl + 'action/';
      var objectName = 'tb_user';
      var filesActionName = 'imageUpload';
      $scope.loading = false;
      $scope.tag = [];
      $scope.tags = [];
      $scope.like = [];
      $scope.loaded = false;
      $scope.sun = false;
      $scope.mon = false;
      $scope.tue = false;
      $scope.wed = false;
      $scope.thu = false;
      $scope.fri = false;
      $scope.sat = false;

      function dataURItoBlob(dataURI) {

        // convert base64/URLEncoded data component to raw binary data held in a string
        var byteString;
        if (dataURI.split(',')[0].indexOf('base64') >= 0)
          byteString = atob(dataURI.split(',')[1]);
        else
          byteString = unescape(dataURI.split(',')[1]);

        // separate out the mime component
        var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];

        // write the bytes of the string to a typed array
        var ia = new Uint8Array(byteString.length);
        for (var i = 0; i < byteString.length; i++) {
          ia[i] = byteString.charCodeAt(i);
        }

        return new Blob([ia], { type: mimeString });
      }

      function upload(filename, filedata) {
        // By calling the files action with POST method in will perform
        // an upload of the file into Backand Storage
        return $http({
          method: 'POST',
          url: Backand.getApiUrl() + baseActionUrl + objectName,
          params: {
            "name": filesActionName
          },
          headers: {
            'Content-Type': 'application/json'
          },
          // you need to provide the file name and the file data
          data: {
            "filename": filename,
            "filedata": filedata.substr(filedata.indexOf(',') + 1, filedata.length) //need to remove the file prefix type
          }
        });
      };

      function getPDetail(id) {
        DashService.getPDetail(id).then(function (result) {
          $scope.PDetail = result.data[0];
          console.log(result.data);
        });
      }


      function getTickets(id) {
        console.log(id);
        TicketsService.getTickets(id).then(function (result) {
          $scope.tickets = result.data;
          console.log($scope.tickets);
        });
      }

      $scope.loadTag = function (id) {
        console.log(id);
        TicketsService.getTag(id).then(function (result) {
          $scope.tags[id] = result.data;
          console.log($scope.tags);
        });
        TicketsService.getLike(id).then(function (result) {
          $scope.like[id] = result.data[0].count;
          console.log($scope.like[id]);
        })
      }

      $scope.getEvent = function (id, name) {
        TicketsService.getEvent(id).then(function (result) {
          $scope.events = result.data;
          $scope.EventName = name;
          console.log($scope.events);

          $(function () {
            $('#modal-event').openModal();
          });
        });
      }

      $scope.chooseEvent = function (date, id) {
        $scope.choosedEvent = date;
        var ticketArray = [];
        var now = $filter('date')(new Date(), 'yyyy-MM-dd');

        console.log(id);
        TicketsService.getRandTicket(id, date).then(function (result) {
          var tmp = result.data;
          for (i = 0; i < tmp.length; i++) {
            ticketArray.push(tmp[i].id)
          }
          console.log(ticketArray);
        });

        $scope.soldOffline = function (count) {
          var UId = [];
          console.log(count);
          for (i = 0; i < count; i++) {
            TicketsService.setSold(ticketArray[i], now);
          }

          $(function () {
            $('#modal-event').closeModal();
          });
          sweetAlert($scope.EventName, "Successfully set sold " + count + " Tickets at " + $scope.choosedEvent + " Event", "success");
          $scope.choosedEvent = null;
          $scope.EventName = null;
        };

      };

      $scope.deleteTicket = function (id) {
        TicketsService.deleteTicket(id).then(function (result) {
          sweetAlert("Successfully Deleted", "Your ticket has been deleted", "success")
          getTickets(localStorage.getItem("idUser"));
        });
      };

      $scope.loadBudaya = function ($query) {
        console.log($scope.tag);
        return TicketsService.getBudayaTags().then(function (result) {
          var budaya = result.data;

          console.log(budaya);
          return budaya.filter(function (bud) {
            return bud.nama_budaya.toLowerCase().indexOf($query.toLowerCase()) != -1;
          });
        });
      };

      $scope.newTicket = function () {
        $(function () {

          function initMap() {
            if (navigator.geolocation) {
              var map = new google.maps.Map(document.getElementById('map'), {
                center: { lat: -8.511726, lng: 115.241275 },
                zoom: 14
              });
              var marker = new google.maps.Marker({ map: map });
              navigator.geolocation.getCurrentPosition(
                function (position) {
                  var pos = {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude
                  };
                  marker.setPosition(pos);
                  marker.setDraggable(true);
                  $("#t_lat").val(position.coords.latitude.toFixed(6));
                  $("#t_long").val(position.coords.longitude.toFixed(6));
                  $scope.lat = position.coords.latitude.toFixed(6);
                  $scope.long = position.coords.longitude.toFixed(6);
                  map.setCenter(pos);

                },
                function () {
                  sweetAlert("Your Browser Doesnt Support Geolocation! ", "Location set to center of Bali Instead!", "error");
                  var error = {
                    lat: -8.511726,
                    lng: 115.241279
                  };
                  marker.setPosition(error);
                  marker.setDraggable(true);
                  $("#t_lat").val(-8.511726);
                  $("#t_long").val(115.241279);
                  $scope.lat = -8.511726;
                  $scope.long = 115.241279;
                  map.setCenter(error);
                  map.setZoom(10);
                }
              );
            }
            else {
              sweetAlert('Your Browser Doesnt Support Geolocation! Location set to center of Bali Instead!', 'error');
              var error = {
                lat: -8.511726,
                lng: 115.241279
              };
              marker.setPosition(error);
              marker.setDraggable(true);
              $("#t_lat").val(-8.511726);
              $("#t_long").val(115.241279);
              $scope.lat = -8.511726;
              $scope.long = 115.241279;

              map.setCenter(error);
            }

            google.maps.event.addListener(marker, 'dragend', function (event) {
              $("#t_lat").val(this.getPosition().lat().toFixed(6));
              $("#t_long").val(this.getPosition().lng().toFixed(6));
              $scope.lat = this.getPosition().lat().toFixed(6);
              $scope.long = this.getPosition().lng().toFixed(6);
            });
          }
          $('#modal-add-ticket').openModal({});
          $("#labelLong").addClass("active");
          $("#labelLat").addClass("active");
          initMap();
        });
      }

      $scope.addTicket = function () {

        var id = localStorage.getItem("idUser");
        var time = $filter('date')($scope.time, 'HH:mm:ss');
        var now = $filter('date')(new Date(), 'yyyy-MM-dd');
        var readerImage = new FileReader();
        $scope.percent = 0;
        var img = dataURItoBlob(self.img.compressed.dataURL);
        var imgName = id + '-t-image-' + now + '.jpeg';
        var fileImg = new File([img], imgName, { type: "image/jpeg" });
        $scope.loading = true;
        console.log(time);
        console.log($scope.lat);
        console.log($scope.long);
        console.log($scope.sun);
        console.log($scope.mon);
        console.log($scope.fri);
        console.log($scope.tue);
        console.log($scope.thu);
        console.log($scope.fri);
        console.log($scope.sat);
        $scope.status = "Uploading Ticket Image";
        readerImage.onload = function (e) {
          upload(fileImg.name, e.currentTarget.result).then(function (res) {
            $scope.img = res.data.url;
            $scope.status = "Adding Tickets Record";
            $scope.percent += 10;
            TicketsService.addTicket(id, $scope.title, $scope.price, $scope.addr, $scope.capacity, time, $scope.lat, $scope.long, $scope.img).then(function (result) { //menambahkan tiket
              var Tid = result.data.__metadata.id;
              $scope.percent += 10;
              console.log(Tid);
              $scope.status = "Generating Events and Ticket UIDs";

              if ($scope.sun == true) {
                TicketsService.addEventDetail(Tid, 0).then(function (result) { //menambahkan event
                  console.log(result.data);
                  $scope.percent += 10;
                });
              }
              else {
                $scope.percent += 10;
              }

              if ($scope.mon == true) {
                TicketsService.addEventDetail(Tid, 1).then(function (result) { //menambahkan event
                  console.log(result.data);
                  $scope.percent += 10;
                });
              }
              else {
                $scope.percent += 10;
              }

              if ($scope.tue == true) {
                TicketsService.addEventDetail(Tid, 2).then(function (result) { //menambahkan event
                  console.log(result.data);
                  $scope.percent += 10;
                });
              }
              else {
                $scope.percent += 10;
              }

              if ($scope.wed == true) {
                TicketsService.addEventDetail(Tid, 3).then(function (result) { //menambahkan event
                  console.log(result.data);
                  $scope.percent += 10;
                });
              }
              else {
                $scope.percent += 10;
              }

              if ($scope.thu == true) {
                TicketsService.addEventDetail(Tid, 4).then(function (result) { //menambahkan event
                  console.log(result.data);
                  $scope.percent += 10;
                });
              }
              else {
                $scope.percent += 10;
              }

              if ($scope.fri == true) {
                TicketsService.addEventDetail(Tid, 5).then(function (result) { //menambahkan event
                  console.log(result.data);
                  $scope.percent += 10;
                });
              }
              else {
                $scope.percent += 10;
              }

              if ($scope.sat == true) {
                TicketsService.addEventDetail(Tid, 6).then(function (result) { //menambahkan event
                  console.log(result.data);
                  $scope.percent += 10;
                });
              }
              else {
                $scope.percent += 10;
              }

              $scope.$watch('percent', function (newValues, oldValues) {
                $scope.percentage = $filter('number')($scope.percent) + '%';
                if ($scope.percent == 90) {
                  var tags = $scope.tag;
                  $scope.status = "Adding Culture Record";
                  for (i = 0; i < tags.length; i++) { //memasukkan relasi budaya dengan tiket
                    TicketsService.addBudayaRelate(Tid, tags[i].id).then(function (result) { });
                  }
                  $scope.percent += 10;
                }

                if ($scope.percent == 100) {
                  $(function () {
                    $('#modal-add-ticket').closeModal();
                  });
                  $scope.formticket.$setPristine();
                  getTickets(localStorage.getItem("idUser"));
                  $scope.loading = false;
                }
              });
            });
          }, function (err) {
            alert(err.data);
          });
        };
        readerImage.readAsDataURL(fileImg);

      };

      $scope.showData = function (id, name) {
        $scope.choosedTicket = name;
        TicketsService.getTD(id).then(function (result) {
          $scope.data = result.data;
          $scope.loaded = true;
        });

        $(function () {
          $('#modal-tickets').openModal();
        });
      }


      getPDetail(localStorage.getItem("idUser"));
      getTickets(localStorage.getItem("idUser"));
    }
    else {
      $state.go('login', { reload: true });
    }
  })

  .controller('AdminDashCtrl', function ($filter, $scope, $http, DTOptionsBuilder, DTColumnBuilder, Backand, DashService, TicketsService) {

    if (localStorage.getItem("auth") == 'authorized') {
      $scope.month = $filter('date')(new Date(), 'LLLL');
      DashService.getAdminData().then(function (result) {
        console.log(result.data);
        var rev = 0;
        result.data.forEach(function (item) {
          var tmp = 0;
          tmp = (item.price * item.sold) * 0.2;
          rev += tmp;
          console.log(tmp);
        }, this);
        $scope.data = result.data;
        $scope.revenue = Math.ceil(rev);
        $scope.convert = function (value) {
          return Math.ceil(value);
        }
      })
    }
    else {
      $state.go('admin-login', { reload: true });
    }
  })

  .controller('AdminLoginCtrl', function ($filter, $state, $scope, LoginService, $http, DTOptionsBuilder, DTColumnBuilder, Backand, DashService, TicketsService) {

    var login = this;
    var e = angular.element(document.querySelector('#username'));
    var p = angular.element(document.querySelector('#password'));
    var el = angular.element(document.querySelector('#email-label'));
    var pl = angular.element(document.querySelector('#password-label'));

    $scope.tryLogin = function () {
      var password = login.password;
      LoginService.adminLogin(login.username, password).then(function (result) {
        console.log(result);
        if (result.data.length == 0) {
          p.addClass("invalid");
          e.addClass("invalid");
          pl.attr('data-error', 'username or password wrong');
          el.attr('data-error', 'username or password wrong');
        }
        else {
          p.removeClass("invalid");
          e.removeClass("invalid");
          localStorage.setItem("admin", result.data[0].id);
          localStorage.setItem("auth", 'authorized');
          console.log(localStorage.getItem("auth"));
          console.log(result.data[0].id);

          $state.go("admin-dashboard");
        }
      });
    };
  })

  .controller('DashCtrl', function ($scope, $state, $http, $filter, DashService, Backand) {

    if (localStorage.getItem("auth") == 'authorized') {

      var baseUrl = '/1/objects/';
      var baseActionUrl = baseUrl + 'action/';
      var objectName = 'tb_user';
      var filesActionName = 'imageUpload';

      var now = $filter('date')(new Date(), 'yyyy-MM-dd');
      var yest = $filter('date')(getYesterdayDate(new Date(), 1), 'yyyy-MM-dd');
      $scope.labels = [];
      $scope.data = [];
      $scope.lchart = true;
      var dateArray = [];

      for (i = 6; i > -1; i--) {
        dateArray.push($filter('date')(getYesterdayDate(new Date(), i), 'yyyy-MM-dd'));
        $scope.labels.push($filter('date')(getYesterdayDate(new Date(), i), 'EEE, d MMM yyyy'));
      }
      getChartData(6);

      var data = [];

      function getChartData(day) {
        if (day == -1) {
          $scope.data = data;
          $scope.lchart = false;
          return;
        }
        DashService.getSalesDate(localStorage.getItem("idUser"), $filter('date')(getYesterdayDate(new Date(), day), 'yyyy-MM-dd')).then(function (result) {
          data.push(result.data[0].sold);
          console.log(result.data[0].sold);
          getChartData(day - 1);
        });
      }

      console.log(dateArray);
      function getPDetail(id) {
        DashService.getPDetail(id).then(function (result) {
          $scope.PDetail = result.data[0];
          console.log(result.data);
        });
      }
      function imageChanged(fileInput) {

        var file = fileInput.files[0];
        var reader = new FileReader();
        var now = $filter('date')(new Date(), 'yyyy-MM-ddHH:mm:ss');
        var username = localStorage.getItem("idUser") + now;

        reader.onload = function (e) {
          upload(username, e.currentTarget.result).then(function (res) {
            localStorage.setItem("uploadUrl", username);
            DashService.updateUserImage(localStorage.getItem("idUser"), res.data.url).then(function (result) {
              getPDetail(localStorage.getItem("idUser"));
              $scope.uploading = false;
              ;

            });
          }, function (err) {
            alert(err.data);
          });
        };

        reader.readAsDataURL(file);
      }


      function initUpload() {
        var fileInput = document.getElementById('file');

        fileInput.addEventListener('change', function (e) {
          console.log(localStorage.getItem("uploadUrl"))
          //deleteFile(localStorage.getItem("uploadUrl"));
          $scope.uploading = true;
          imageChanged(fileInput);
        });
      }

      $scope.initCtrl = function () {
        initUpload();
        console.log('upload initiated');
      }


      function upload(filename, filedata) {
        return $http({
          method: 'POST',
          url: Backand.getApiUrl() + baseActionUrl + objectName,
          params: {
            "name": filesActionName
          },
          headers: {
            'Content-Type': 'application/json'
          },
          // you need to provide the file name and the file data
          data: {
            "filename": filename,
            "filedata": filedata.substr(filedata.indexOf(',') + 1, filedata.length) //need to remove the file prefix type
          }
        });
      }

      function getSalesDate() {

        DashService.getSalesDate(localStorage.getItem("idUser"), now).then(function (result) {
          $scope.today = result.data[0];
          var tsale = result.data[0].sold;
          console.log($scope.today);
          DashService.getSalesDate(localStorage.getItem("idUser"), yest).then(function (result) {
            $scope.yest = result.data;
            var ysale = result.data[0].sold;
            console.log(result.data);

            $scope.progress = (tsale - ysale);

            console.log(ysale);
            console.log(tsale);

          });
        });

        DashService.getSaleByType(localStorage.getItem("idUser"), now, 'admin').then(function (result) {
          $scope.admin = result.data[0].sold;
          var atsale = result.data[0].sold;
          DashService.getSaleByType(localStorage.getItem("idUser"), yest, 'admin').then(function (result) {

            var aysale = result.data[0].sold;
            $scope.aprogress = (atsale - aysale);
            console.log($scope.apogress);

          });
        });

        DashService.getSaleByType(localStorage.getItem("idUser"), now, 'tikettari').then(function (result) {
          $scope.tt = result.data[0].sold;
          var ttsale = result.data[0].sold;
          DashService.getSaleByType(localStorage.getItem("idUser"), yest, 'tikettari').then(function (result) {

            var tysale = result.data[0].sold;
            $scope.tprogress = (ttsale - tysale);
            console.log($scope.tpogress);

          });
        });


        console.log(now);
        console.log(yest);
      }

      getSalesDate();

      function getYesterdayDate(date, dayMin) {
        var resultDate = new Date(date.getTime());

        resultDate.setDate(date.getDate() - dayMin);

        return resultDate;
      }

      $scope.series = ['This Week Sales'];

      $scope.onClick = function (points, evt) {
        console.log(points, evt);
      };
      $scope.colors = ['#FFFFFF'];
      $scope.datasetOverride = [{ yAxisID: 'y-axis-1' }, { yAxisID: 'y-axis-2' }];
      $scope.options = {
        scales: {
          yAxes: [
            {
              id: 'y-axis-1',
              type: 'linear',
              display: true,
              position: 'left'
            }
          ]
        }
      };

      $scope.logout = function () {
        $state.go('login');
        localStorage.setItem("idUser", null);
        localStorage.setItem("auth", 'unauthorized');
      };
      $scope.openDropdown = function () {
        $(function () {
          $('#dropdown').dropdown('open');
        });
      };

      $scope.openModal = function () {
        $(function () {
          $('#profile').openModal();
        });
      };
      getPDetail(localStorage.getItem("idUser"));
    }
    else {
      $state.go('login', { reload: true });
    }
  })

  .controller('MediaCtrl', function ($scope, $filter, $state, MediaService, DashService, $http, Backand) {

    var baseUrl = '/1/objects/';
    var baseActionUrl = baseUrl + 'action/';
    var objectName = 'tb_user';
    var filesActionName = 'imageUpload';
    var id = localStorage.getItem("idUser");
    $scope.loading = false;

    function getPDetail(id) {
      DashService.getPDetail(id).then(function (result) {
        $scope.PDetail = result.data[0];
        console.log(result.data);
      });
    }

    function getMedia(id) {
      MediaService.getMedia(id).then(function (result) {
        $scope.media = result.data;
      });
    }

    function imageChanged(fileInput) {

      var file = fileInput.files[0];
      var reader = new FileReader();
      var now = $filter('date')(new Date(), 'yyyy-MM-ddHH:mm:ss');
      var filename = now + file.name;


      reader.onload = function (e) {
        upload(filename, e.currentTarget.result).then(function (res) {
          MediaService.addMedia(id, res.data.url, filename).then(function (result) {
            getMedia(id);
            $scope.loading = false;
          });
        }, function (err) {
          alert(err.data);
        });
      };
      reader.readAsDataURL(file);
    }

    function initUpload() {
      var fileInput = document.getElementById('fileInput');

      fileInput.addEventListener('change', function (e) {
        $scope.loading = true;
        console.log('changed');
        imageChanged(fileInput);
      });
    }

    function upload(filename, filedata) {
      return $http({
        method: 'POST',
        url: Backand.getApiUrl() + baseActionUrl + objectName,
        params: {
          "name": filesActionName
        },
        headers: {
          'Content-Type': 'application/json'
        },
        // you need to provide the file name and the file data
        data: {
          "filename": filename,
          "filedata": filedata.substr(filedata.indexOf(',') + 1, filedata.length) //need to remove the file prefix type
        }
      });
    }

    $scope.deleteFile = function (id, filename) {

      if (!filename) {
        return;
      }
      $http({
        method: 'DELETE',
        url: Backand.getApiUrl() + baseActionUrl + objectName,
        params: {
          "name": filesActionName
        },
        headers: {
          'Content-Type': 'application/json'
        },
        // you need to provide the file name
        data: {
          "filename": filename
        }
      })
      MediaService.deleteRecord(id).then(function (result) {
        getMedia(localStorage.getItem("idUser"));
      });
    }

    initUpload();
    getMedia(id);
    getPDetail(id);
    console.log('upload initiated');
  })

  .controller('CalCtrl', function ($scope, $compile, uiCalendarConfig, DashService, EventService) {
    var id = localStorage.getItem("idUser");
    function getPDetail(id) {
      DashService.getPDetail(id).then(function (result) {
        $scope.PDetail = result.data[0];
        console.log(result.data);
      });
    }

    $scope.eventSources = [];

    $scope.uiConfig = {
      calendar: {
        height: 600,
        width: 500,
        editable: true,
        header: {
          left: 'month basicWeek basicDay agendaWeek agendaDay',
          center: 'title',
          right: 'today prev,next'
        },
        eventClick: function (date, jsEvent, view) {

          EventService.getEventDetail(date.id).then(function (result) {
            console.log(result.data);
            var e = result.data[0];
            sweetAlert({
              title: date.title,
              text: "<h5 class='text-medium'>Price: $" + e.price + "</h5><h5 class='text-medium'>Capacity: " + e.capacity + " Seats</h5><h5 class='text-medium'>Address: " + e.address + "</h5><h5 class='text-medium'>Time: " + e.time + "</h5>",
              type: "info",
              html: true
            });
          });

          console.log(date);
        },
        eventDrop: $scope.alertOnDrop,
        eventResize: $scope.alertOnResize
      }
    };


    function getEvent(id) {
      EventService.getEvent(id).then(function (result) {
        var tmp = result.data;
        console.log(tmp);
        var array = [];
        for (i = 0; i < tmp.length; i++) { // parsing data menjadi json format fullcalendar
          if (tmp[i].status = 'available') {
            array.push(
              {
                id: tmp[i].id,
                title: tmp[i].event_name,
                start: tmp[i].date,
                end: tmp[i].date,
                backgroundColor: 'green'
              }
            );
          }
          else {
            array.push(
              {
                id: tmp[i].id,
                title: tmp[i].event_name,
                start: tmp[i].date,
                end: tmp[i].date,
                backgroundColor: 'red'
              }
            );
          }


        }


        $scope.eventSources[0] = {};
        $scope.eventSources[0].events = array;
        console.log($scope.eventSources);
      });
    }
    getPDetail(id);
    getEvent(localStorage.getItem("idUser"));
  })

  .controller('LoginCtrl', function ($scope, $state, md5, LoginService) {

    var login = this;
    var e = angular.element(document.querySelector('#email'));
    var p = angular.element(document.querySelector('#password'));
    var el = angular.element(document.querySelector('#email-label'));
    var pl = angular.element(document.querySelector('#password-label'));

    $scope.tryLogin = function () {
      var password = md5.createHash(login.password || '');
      LoginService.login(login.email, password).then(function (result) {
        console.log(result);
        if (result.data.length == 0) {
          p.addClass("invalid");
          e.addClass("invalid");
          pl.attr('data-error', 'username or password wrong');
          el.attr('data-error', 'username or password wrong');
        }
        else {
          p.removeClass("invalid");
          e.removeClass("invalid");
          localStorage.setItem("idUser", result.data[0].id);
          localStorage.setItem("auth", 'authorized');
          console.log(localStorage.getItem("auth"));
          console.log(result.data[0].id);

          $state.go("dashboard");
        }
      });
    };
  })

  .controller('SignupCtrl', function ($scope, $state, SignUpService, md5) {

    var login = this;
    //element
    var fname = angular.element(document.querySelector('#fname'));
    var lname = angular.element(document.querySelector('#lname'));
    var uname = angular.element(document.querySelector('#username'));
    var email = angular.element(document.querySelector('#email'));
    var oname = angular.element(document.querySelector('#oname'));
    var pass = angular.element(document.querySelector('#password'));
    var cpass = angular.element(document.querySelector('#cpassword'));

    //label
    var lfname = angular.element(document.querySelector('#lfname'));
    var llname = angular.element(document.querySelector('#llname'));
    var lusername = angular.element(document.querySelector('#lusername'));
    var loname = angular.element(document.querySelector('#loname'));
    var lemail = angular.element(document.querySelector('#lemail'));
    var lpass = angular.element(document.querySelector('#lpassword'));
    var lcpass = angular.element(document.querySelector('#lcpassword'));

    var error = {};
    $scope.verUsername = function () {
      SignUpService.verUsername($scope.username).then(function (result) {
        console.log(result.data);
        var tmp = result.data;
        console.log($scope.username);


        if (tmp.length == 0) {
          uname.removeClass("invalid");
          uname.addClass("valid");

        }

        else {
          uname.removeClass("valid");
          uname.addClass("invalid");
          lusername.attr('data-error', 'username taken');
        }


      });
    }

    $scope.verEmail = function () {
      SignUpService.verEmail($scope.email).then(function (result) {
        console.log(result.data);
        var tmp = result.data;

        if (tmp.length == 0) {
          email.addClass("valid");
          email.removeClass("invalid");
        }

        else {
          email.removeClass("valid");
          email.addClass("invalid");
          lemail.attr('data-error', 'email already registered');
        }

      });
    }

    $scope.verPass = function () {
      if ($scope.password != $scope.cpassword) {
        pass.removeClass("valid");
        cpass.removeClass("valid");
        pass.addClass("invalid");
        cpass.addClass("invalid");
        lpass.attr('data-error', 'password didnt match');
        lcpass.attr('data-error', 'password didnt match');
      }
      else {
        pass.removeClass("invalid");
        cpass.removeClass("invalid");
        pass.addClass("valid");
        cpass.addClass("valid");

      }
    }

    $scope.signup = function () {
      if ($scope.fname == null) {
        error.fname = true;
        fname.removeClass("valid");
        fname.addClass("invalid");
      }
      else {
        error.fname = false;
        fname.removeClass("invalid");
        fname.addClass("valid");
      }
      if ($scope.lname == null) {
        error.lname = true;
        lname.removeClass("valid");
        lname.addClass("invalid");
      }
      else {
        error.lname = false;
        lname.removeClass("invalid");
        lname.addClass("valid");
      }

      if ($scope.username == null) {
        error.uname = true;
        uname.removeClass("valid")
        uname.addClass("invalid");
      }
      else {
        error.uname = false;
        uname.removeClass("invalid");
        uname.addClass("valid");
      }

      if ($scope.oname == null) {
        error.oname = true;
        oname.removeClass("valid");
        oname.addClass("invalid");
      }
      else {
        error.oname = false;
        oname.removeClass("invalid");
        oname.addClass("valid");
      }

      if ($scope.email == null) {
        error.email = true;
        email.removeClass("valid");
        email.addClass("invalid");
      }
      else {
        error.email = false;
        email.removeClass("invalid");
        email.addClass("valid");
      }

      if ($scope.password == null) {
        error.pass = true;
        pass.removeClass("valid");
        pass.addClass("invalid");
      }
      else {
        error.pass = false;
        pass.removeClass("invalid");
        pass.addClass("valid");
      }

      if ($scope.cpassword == null) {
        error.cpass = true;
        cpass.removeClass("valid");
        cpass.addClass("invalid");
      }
      else {
        error.cpass = false;
        cpass.removeClass("invalid");
        cpass.addClass("valid");
      }

      if (error.fname == false && error.lname == false && error.uname == false && error.oname == false && error.email == false && error.pass == false && error.cpass == false) {
        sweetAlert('Nyak Cings', 'kleng', 'success');
      }
    }
  })

  .controller('AccountCtrl', function ($scope, $state, md5, DashService, LoginService) {

    var login = this;
    var e = angular.element(document.querySelector('#email'));
    var p = angular.element(document.querySelector('#password'));
    var el = angular.element(document.querySelector('#email-label'));
    var pl = angular.element(document.querySelector('#password-label'));

    $scope.tryLogin = function () {
      var password = md5.createHash(login.password || '');
      LoginService.login(login.email, password).then(function (result) {
        console.log(result);
        if (result.data.length == 0) {
          p.addClass("invalid");
          e.addClass("invalid");
          pl.attr('data-error', 'username or password wrong');
          el.attr('data-error', 'username or password wrong');
        }
        else {
          p.removeClass("invalid");
          e.removeClass("invalid");
          localStorage.setItem("idUser", result.data[0].id);
          console.log(result.data[0].id);

          $state.go("dashboard");
        }
      });
    };
  })

  .controller('ChatsCtrl', function (Chats, $scope, Messages, DashService, Backand) {
    var self = this;
    var chatArr = [];
    var id = localStorage.getItem("idUser");
    var chatbox = angular.element(document.querySelector('#chatbox'));
    var chatInput = angular.element(document.querySelector('#chatInput'));


    function getPDetail(id) {
      DashService.getPDetail(id).then(function (result) {
        $scope.PDetail = result.data[0];
        console.log(result.data);
      });
    }

    Backand.on('new_chat' + id, function (data) {
      init(id);
    });

    Backand.on('send', function () {
      init(id);
    });

    function init(id) {
      Chats.getChat(id).then(function (result) {
        $scope.chats = result.data;
        console.log($scope.chats);
        chatArr.push(result.data[0].id);
        console.log(chatArr);
      });
    }

    $scope.getMessage = function (id) {
      $scope.selectedChat = id;

      Backand.on('send_message' + id, function (data) {
        $scope.messages.push({ 'sender_type': data[0], 'message': data[1] });
        console.log(data[0]);
      });

      Messages.get(id).then(function (response) {
        $scope.messages = response.data;
        console.log($scope.messages);
      });
    };

    $scope.sendMessage = function (msg, id) {
      Messages.post(msg, id);
      $(function () {
        $('#chatInput').val('');
      });
    };

    init(id);
    getPDetail(id);

    //  init(localStorage.getItem("idUser"));
    //  console.log(localStorage.getItem("idUser"));
  })

  .controller('ChatDetailCtrl', function ($scope, $stateParams, DashService, Chats, Backand, Messages) {
    var self = this;
    $scope.chatName = $stateParams.chatName;
    if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);

    }



    // Send a message - POST request to the server
    // After the message is added in the server's db, it triggers an action that dispatches the real time event to the clients
    // The action is configured in the Backand app
    self.sendMessage = function () {
      Messages.post(self.chat.newMessage, $stateParams.chatId);
      $scope.chat.newMessage = '';
    };

    function init() {
      // Scroll chats to bottom so the user can see the latest messages
      $ionicScrollDelegate.scrollBottom(true);

      // Listen to real time events for the current chat, and when the event triggers run the callback that adds a new message
      // For more info about real time events in Backand: http://docs.backand.com/en/latest/apidocs/realtime/index.html
      Backand.on('send_message' + $stateParams.chatId, function (data) {
        self.messages.push({ 'sender_type': data[0], 'message': data[1] });
        console.log(data[0]);
        $ionicScrollDelegate.scrollBottom(true);
      });

      // Get the chat from the server to get its metadata
      Chats.getChat($stateParams.chatId).then(function (response) {
        self.chat = response.data;
      });

      // Get the latest messages from the server
      Messages.get($stateParams.chatId).then(function (response) {
        self.messages = response.data;
        console.log(self.messages);
        console.log($stateParams.chatId);
        $ionicScrollDelegate.scrollBottom();
      });
    }

    init();
  })

  .controller('FinanceCtrl', function ($scope, $filter, DashService, FinanceService) {

    var id = localStorage.getItem("idUser");
    DashService.getPDetail(id).then(function (result) {
      $scope.PDetail = result.data[0];
      console.log(result.data);
    });
    console.log(id);
    $scope.month = $filter('date')(new Date(), 'LLLL');
    FinanceService.getInvoice(id).then(function (result) {
      console.log(result.data);
      $scope.invoices = result.data;
    });
    FinanceService.getRevenue(id).then(function (result) {
      console.log(result.data);
      var data = result.data[0];
      var sale = (data.price * data.sold);
      var comp = sale * 0.2;
      $scope.revenue = sale - comp;
      $scope.comp = comp;
      console.log(comp);
    });
  });
