app
  .service('AuthService', ['$firebaseAuth', '$firebaseObject', function ($firebaseAuth, $firebaseObject) {
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
      return fb.auth().signOut();
    };

    this.signUp = function (email, password) {
      return $firebaseAuth()
        .$createUserWithEmailAndPassword(email, password);
    };

    this.updateAkun = function (data) {
      const auth = $firebaseAuth().$getAuth();
      return fb.database().ref(`users/${auth.uid}`).update(data);
    };

    this.resetPassword = function (email) {
      return fb.auth().sendPasswordResetEmail(email);
    };
  }])

  .service('WarungService', ['$firebaseArray', '$firebaseStorage', function ($firebaseArray, $firebaseStorage) {
    this.getWarungVerified = function () {
      const ref = fb.database()
        .ref(`warung`)
        .orderByChild('verifikasi')
        .equalTo(true);
      return $firebaseArray(ref).$loaded();
    };

    this.getWarungUnverified = function () {
      const ref = fb.database()
        .ref('warung')
        .orderByChild('verifikasi')
        .equalTo(false);
      return $firebaseArray(ref).$loaded();
    };

    this.verifikasiDataWarung = function (key, uid) {
      const ref = fb.database().ref('warung');
      return ref.child(key).update({
        verifikasi: true,
        indexUidVerifikasi: `${true}_${uid}`,
      });
    };

    this.getWarungWhereOwner = function () {
      const uid = localStorage.getItem('uid');
      const ref = fb
        .database()
        .ref(`warung`)
        .orderByChild('indexUidVerifikasi')
        .equalTo(`${true}_${uid}`);
      return $firebaseArray(ref).$loaded();
    };

    this.getWarungUnverifiedWhereOwner = function () {
      const uid = localStorage.getItem('uid');
      const ref = fb
        .database()
        .ref(`warung`)
        .orderByChild('indexUidVerifikasi')
        .equalTo(`${false}_${uid}`);
      return $firebaseArray(ref).$loaded();
    };

    this.getKategori = function () {
      const ref = fb.database().ref('masterData/jenisMakanan');
      return $firebaseArray(ref).$loaded();
    };

    this.putImage = function (file, filename) {
      function guid() {
        function s4() {
          return Math.floor((1 + Math.random()) * 0x10000)
            .toString(16)
            .substring(1);
        }
        return `${s4() + s4()}-${s4()}-${s4()}-${s4()}-${s4() + s4() + s4()}`;
      }
      const ref = fb.storage().ref(`warung/${guid()}_${filename}`);
      return $firebaseStorage(ref).$put(file);
    };

    this.pushDataWarung = function (data) {
      const ref = fb.database().ref('warung');
      return $firebaseArray(ref).$add(data);
    };

    this.updateDataWarung = function (key, data) {
      const ref = fb.database().ref(`warung/${key}`);
      return ref.update(data);
    };

    this.deleteDataWarung = function (key) {
      const ref = [
        fb.database().ref('warung').child(key).remove(),
        fb.database().ref('rating/warung').child(key).remove()
      ];
      return Promise.all(ref);
    };
  }])

  .service('MakananService', ['$firebaseArray', '$firebaseStorage', function ($firebaseArray, $firebaseStorage) {
    this.getKategori = function () {
      const ref = fb.database().ref('masterData/jenisMakanan');
      return $firebaseArray(ref).$loaded();
    };

    this.getWarungAll = function () {
      const ref = fb.database()
        .ref(`warung`)
        .orderByChild('verifikasi')
        .equalTo(true);
      return $firebaseArray(ref).$loaded();
    }

    this.getWarung = function () {
      const uid = localStorage.getItem('uid');
      const ref = fb.database()
        .ref(`warung`)
        .orderByChild('indexUidVerifikasi')
        .equalTo(`${true}_${uid}`);
      return $firebaseArray(ref).$loaded();
    }

    this.getMakananAll = function () {
      const ref = fb.database().ref(`makanan`);
      return $firebaseArray(ref).$loaded();
    }

    this.getMakanan = function () {
      const uid = localStorage.getItem('uid');
      const ref = fb.database()
        .ref(`makanan`)
        .orderByChild('uid')
        .equalTo(uid);
      return $firebaseArray(ref).$loaded();
    }

    this.putImage = function (file, filename) {
      function guid() {
        function s4() {
          return Math.floor((1 + Math.random()) * 0x10000)
            .toString(16)
            .substring(1);
        }

        return `${s4() + s4()}-${s4()}-${s4()}-${s4()}-${s4() + s4() + s4()}`;
      }
      const ref = fb.storage().ref(`makanan/${guid()}_${filename}`);
      return $firebaseStorage(ref).$put(file);
    };

    this.pushData = function (data) {
      const ref = fb.database().ref('makanan');
      return $firebaseArray(ref).$add(data);
    };

    this.updateData = function (key, data) {
      const ref = fb.database().ref(`makanan/${key}`);
      return ref.update(data);
    };

    this.deleteData = function (key) {
      const ref = [
        fb.database().ref('makanan').child(key).remove(),
        fb.database().ref('rating/makanan').child(key).remove()
      ];
      return Promise.all(ref);
    };
  }]);
