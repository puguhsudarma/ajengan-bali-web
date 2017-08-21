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

  .service('WarungService', ['$firebaseArray', '$firebaseAuth', '$firebaseStorage', function ($firebaseArray, $firebaseAuth, $firebaseStorage) {
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
  }]);
