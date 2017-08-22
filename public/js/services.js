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

    this.signUp = function (email, password, data) {
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

    this.updateAkun = function(data){
      const auth = $firebaseAuth().$getAuth();
      return fb.database().ref(`users/${auth.uid}`).update(data);
    };
  }])

  .service('WarungService', ['$firebaseArray', '$firebaseStorage', function ($firebaseArray, $firebaseStorage) {
    this.getWarungWhereOwner = function () {
      const uid = localStorage.getItem('uid');
      const ref = fb
        .database()
        .ref(`warung`)
        .orderByChild('indexUidSoftDelete')
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
      const ref = fb.database().ref('warung');
      return ref.child(key).update({
        softDelete: true,
        indexUidSoftDelete: `${true}_${localStorage.getItem('uid')}`,
      });
    };
  }])

  .service('MakananService', ['$firebaseArray', '$firebaseStorage', function ($firebaseArray, $firebaseStorage) {
    this.getKategori = function () {
      const ref = fb.database().ref('masterData/jenisMakanan');
      return $firebaseArray(ref).$loaded();
    };

    this.getWarung = function () {
      const uid = localStorage.getItem('uid');
      const ref = fb.database()
        .ref(`warung`)
        .orderByChild('indexUidSoftDelete')
        .equalTo(`${false}_${uid}`);
      return $firebaseArray(ref).$loaded();
    }

    this.getMakanan = function () {
      const uid = localStorage.getItem('uid');
      const ref = fb.database()
        .ref(`makanan`)
        .orderByChild('indexUidSoftDelete')
        .equalTo(`${false}_${uid}`);
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
      const ref = fb.database().ref('makanan');
      return ref.child(key).update({
        softDelete: true,
        indexUidSoftDelete: `${true}_${localStorage.getItem('uid')}`,
      });
    };
  }]);
