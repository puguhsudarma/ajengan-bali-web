app
  .service('LoginService', ['$firebaseAuth', '$firebaseObject', function ($firebaseAuth, $firebaseObject) {
    this.login = function (email, password) {
      return $firebaseAuth().$signInWithEmailAndPassword(email, password);
    };

    this.dataLogin = function () {
      const auth = $firebaseAuth().$getAuth();
      const ref = fb.database().ref(`users/${auth.uid}`);
      return $firebaseObject(ref).$loaded();
    };

    this.logout = function () {
      localStorage.clear();
      return $firebaseAuth().signOut();
    };
  }])

  .service('SignUpService', ['$firebaseAuth', function ($firebaseAuth) {
    this.checkUniqueUsername = function (username) {
      return firebase
        .database()
        .ref('users')
        .orderByChild('username')
        .equalTo(username)
        .once('value');
    };

    this.checkUniqueEmail = function (email) {
      return firebase
        .database()
        .ref('users')
        .orderByChild('email')
        .equalTo(email)
        .once('value');
    };

    this.signUp = function ({ nama, alamat, telp, username, email, password }) {
      const data = { nama, alamat, telp, username, email, level: '1' };
      // sign up proccess
      return $firebaseAuth()
        .$createUserWithEmailAndPassword(email, password)
        .then(user => Promise.resolve(user.uid))
        .then(uid => {
          return firebase
            .database()
            .ref(`users/${uid}`)
            .set(data);
        })
        .catch(err => err);
    };
  }])

  .service('WarungService', ['$firebaseArray', '$firebaseAuth', function ($firebaseArray, $firebaseAuth) {
    this.getWarungWhereOwner = function () {
      const uid = localStorage.getItem('uid');
      const ref = fb.database().ref(`warung`).orderByChild('uid').equalTo(uid);
      return $firebaseArray(ref).$loaded();
    };
  }])


  // -----------------------------
  .service('DashService', function ($http, Backand) {
    var service = this;

    service.getAdminData = function () {
      return $http({
        method: 'GET',
        url: Backand.getApiUrl() + '/1/query/data/getMonthlySales'
      });
    }
    service.updateUserImage = function (id, url) {
      return $http({
        method: 'PUT',
        url: Backand.getApiUrl() + '/1/objects/tb_penyelenggara/' + id,
        data: {
          img_path: url
        }
      });
    }

    service.getPDetail = function (id) {
      return $http({
        method: 'GET',
        url: Backand.getApiUrl() + '/1/query/data/getPenyelenggaraById',
        params: {
          parameters: {
            id: id
          }
        }
      });
    }

    service.getSalesDate = function (id, date) {
      return $http({
        method: 'GET',
        url: Backand.getApiUrl() + '/1/query/data/getPenDailySales',
        params: {
          parameters: {
            pid: id,
            date: date
          }
        }
      });
    }

    service.getSaleByType = function (id, date, type) {
      return $http({
        method: 'GET',
        url: Backand.getApiUrl() + '/1/query/data/getPenDailySaleByType',
        params: {
          parameters: {
            pid: id,
            type: type,
            date: date
          }
        }
      });
    }
  })

  .service('TicketsService', function ($http, Backand) {
    var service = this;

    service.getTickets = function (id) {
      return $http({
        method: 'GET',
        url: Backand.getApiUrl() + '/1/query/data/getPenyelenggaraTickets',
        params: {
          parameters: {
            id: id
          }
        }
      });
    }

    service.getLike = function (id) {
      return $http({
        method: 'GET',
        url: Backand.getApiUrl() + '/1/query/data/getLikebyTicketID',
        params: {
          parameters: {
            id: id
          }
        }
      });
    }

    service.setSold = function (id, now) {
      return $http({
        method: 'PUT',
        url: Backand.getApiUrl() + '/1/objects/tb_tiketDetail/' + id,
        data: {
          sold_by: "Admin",
          available: "SOLD",
          sold_date: now
        }
      });
    }

    service.getRandTicket = function (id, date) {
      return $http({
        method: 'GET',
        url: Backand.getApiUrl() + '/1/query/data/getRandTicketbyEvent',
        params: {
          parameters: {
            ticketID: id,
            date: date
          }
        }
      });
    }

    service.getEvent = function (id) {
      return $http({
        method: 'GET',
        url: Backand.getApiUrl() + '/1/query/data/getEventByTicket',
        params: {
          parameters: {
            id: id
          }
        }
      });
    }

    service.getTag = function (id) {
      return $http({
        method: 'GET',
        url: Backand.getApiUrl() + '/1/query/data/getTicketTag',
        params: {
          parameters: {
            id: id
          }
        }
      });
    }

    service.getTD = function (id) {
      return $http({
        method: 'GET',
        url: Backand.getApiUrl() + '/1/query/data/getPenyelenggaraTD',
        params: {
          parameters: {
            tiketID: id
          }
        }
      });
    }

    service.deleteTicket = function (id) {
      return $http({
        method: 'DELETE',
        url: Backand.getApiUrl() + '/1/objects/tb_tiket/' + id
      });
    }

    service.addTicket = function (id, title, price, addr, cap, time, lat, long, img) {

      return $http({
        method: 'POST',
        url: Backand.getApiUrl() + '/1/objects/tb_tiket/?parameters=%7B%7D',
        data: {
          "title": title,
          "price": price,
          "penyelenggara": id,
          "address": addr,
          "latitude": lat,
          "longitude": long,
          "time": time,
          "capacity": cap,
          "img_path": img
        }
      });
    }

    service.getBudayaTags = function () {
      return $http({
        method: 'GET',
        url: Backand.getApiUrl() + '/1/query/data/getBudayaForTags',
        cache: true,
        params: {
          parameters: {}
        }
      });
    }

    service.addBudayaRelate = function (id_tiket, id_bud) {
      return $http({
        method: 'POST',
        url: Backand.getApiUrl() + '/1/objects/tb_relasiTB',
        data: {
          "tiket": id_tiket,
          "budaya": id_bud
        }
      });
    }

    service.addEventDetail = function (Tid, day) {
      return $http({
        method: 'GET',
        url: Backand.getApiUrl() + '/1/objects/action/tb_tiket/' + Tid + '?name=setTicketDetail',
        params: {
          parameters: {
            day: day
          }
        }
      });
    }

  })

  .service('FinanceService', function ($http, Backand) {
    var service = this;

    service.getRevenue = function (id) {
      return $http({
        method: 'GET',
        url: Backand.getApiUrl() + '/1/query/data/getRevenue',
        params: {
          parameters: {
            id: id
          }
        }
      });
    }

    service.getInvoice = function (id) {
      return $http({
        method: 'GET',
        url: Backand.getApiUrl() + '/1/query/data/getPenyelenggaraInvoice',
        params: {
          parameters: {
            id: id
          }
        }
      });
    }
  })

  .service('MediaService', function ($http, Backand) {
    var service = this;

    service.addMedia = function (id, url, filename) {
      return $http({
        method: 'POST',
        url: Backand.getApiUrl() + '/1/objects/tb_penyelenggaraMedia',
        data: {
          "id_penyelenggara": id,
          "img_path": url,
          "filename": filename
        }
      });
    }

    service.deleteRecord = function (id) {
      return $http({
        method: 'DELETE',
        url: Backand.getApiUrl() + '/1/objects/tb_penyelenggaraMedia/' + id
      });
    }

    service.getMedia = function (id) {
      return $http({
        method: 'GET',
        url: Backand.getApiUrl() + '/1/query/data/getpenyelenggaraMedia',
        params: {
          parameters: {
            id: id
          }
        }
      });
    }
  })

  .service('AccountService', function ($http, Backand) {
    var service = this;

    service.getUserData = function (username) {
      return $http({
        method: 'GET',
        url: Backand.getApiUrl() + '/1/query/data/getUserDetail',
        params: {
          parameters: {
            username: username
          }
        }
      });
    }

    service.updateUserImage = function (id, url) {
      return $http({
        method: 'PUT',
        url: Backand.getApiUrl() + '/1/objects/tb_user/' + id,
        data: {
          img_path: url
        }
      });
    }

    service.updateUserDetail = function (firstName, lastName, id) {
      return $http({
        method: 'PUT',
        url: Backand.getApiUrl() + '/1/objects/tb_user/' + id,
        data: {
          first_name: firstName,
          last_name: lastName
        }
      });
    }

    service.changePassword = function (oldPass, newPass) {

    }
  })

  .service('Chats', function ($http, Backand) {
    var service = this;

    service.getChat = function (id) {
      return $http({
        method: 'GET',
        url: Backand.getApiUrl() + '/1/query/data/getChatByPenId',
        params: {
          parameters: {
            id: id
          }
        }
      });
    }




    service.add = function (idUser, idPenyelenggara) {
      return $http({
        method: 'POST',
        url: Backand.getApiUrl() + '/1/objects/tb_chat',
        data: {
          user: idUser,
          penyelenggara: idPenyelenggara
        }
      });
    }
  })

  .service('EventService', function ($http, Backand) {
    var service = this;

    service.getEvent = function (id) {
      return $http({
        method: 'GET',
        url: Backand.getApiUrl() + '/1/query/data/getPenCalEvent',
        params: {
          parameters: {
            id: id
          }
        }
      });
    }

    service.getEventDetail = function (id) {
      return $http({
        method: 'GET',
        url: Backand.getApiUrl() + '/1/query/data/getEventDetail',
        params: {
          parameters: {
            id: id
          }
        }
      });
    }
  })

  .service('Messages', function ($http, Backand) {
    var self = this;

    // Triggers the SendMessage action on the Backand app
    self.post = function (message, chatId) {
      return $http({
        method: 'POST',
        url: Backand.getApiUrl() + '/1/objects/tb_message',
        data: {
          sender_type: 0,
          message: message,
          chat: chatId

        }
      });
    }

    self.get = function (chatID) {
      return $http({
        method: 'GET',
        url: Backand.getApiUrl() + '/1/query/data/getChatMessage',
        params: {
          parameters: {
            chatID: chatID
          }
        }
      });
    }
  });
