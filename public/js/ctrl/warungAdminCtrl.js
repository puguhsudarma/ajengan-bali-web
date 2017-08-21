app
  .controller('AdminWarung_WarungCtrl', ['$scope', 'WarungService', '$mdDialog', '$mdToast', function ($scope, WarungService, $mdDialog, $mdToast) {
    $scope.state = {
      title: 'Data Warung',
      subtitle: 'Tabel data warung',
      act: 'read',
      data: [],
      selected: {},
      kategori: [],
      loading: true,
    };

    // fetch data
    WarungService
      .getWarungWhereOwner()
      .then(data => {
        $scope.state.data = data;
        $scope.state.loading = false;
      })
      .catch(err => alertWindow(err));

    WarungService
      .getKategori()
      .then(data => {
        $scope.state.kategori = data;
        $scope.state.loading = false;
      })
      .catch(err => alertWindow(err));

    // fungsi action
    $scope.action = {
      add: function () {
        $scope.state.act = 'add';
        $scope.state.subtitle = 'Tambah data warung';
        $scope.formField = {};
      },
      update: function () {
        $scope.state.act = 'update';
        $scope.state.subtitle = 'Update data warung';
      },
      back: function () {
        $scope.state.act = 'read';
        $scope.state.subtitle = 'Tabel data warung';
      },
    };

    $scope.edit = function (data) {
      $scope.state.selected = data;
      $scope.action.update();
      $scope.formField = {
        nama: data.nama,
        daerah: data.daerah,
        kategori: data.kategori,
        latitude: data.lat,
        longitude: data.lng,
        deskripsi: data.deskripsi,
      };
    };

    $scope.delete = function (data, ev) {
      const confirm = $mdDialog.confirm()
        .title('Delete data warung ?')
        .textContent(`Data dengan nama warung : ${data.nama}`)
        .ariaLabel('Delete Confirmation')
        .targetEvent(ev)
        .ok('Ya')
        .cancel('Tidak');

      $mdDialog.show(confirm)
        .then(
        () => WarungService.deleteDataWarung(data.$id)
          .then(() => toast(`Data warung : ${data.nama} berhasil di hapus`))
          .catch(() => toast('Terjadi kesalahan saat hapus data.'))
        )
        .catch(err => { });
    };

    // fungsi submit form
    $scope.onSubmitAdd = function (data) {
      $scope.state.loading = true;
      if (data.image.length === 0) {
        const push = {
          daerah: data.daerah,
          deskripsi: data.deskripsi,
          kategori: data.kategori,
          lat: data.latitude,
          lng: data.longitude,
          nama: data.nama,
          picture: 'https://firebasestorage.googleapis.com/v0/b/ajengan-bali.appspot.com/o/assets%2FNoImage.png?alt=media&token=86dca0ea-2252-4f0a-8ffc-da006ce1752c',
          uid: localStorage.getItem('uid'),
          softDelete: false,
          indexUidSoftDelete: `${false}_${localStorage.getItem('uid')}`,
        };

        WarungService
          .pushDataWarung(push)
          .then(() => {
            toast('Data warung berhasil disimpan.');
            this.action.back();
            $scope.state.loading = false;
          })
          .catch(() => {
            toast('Terjadi kegagalan saat menyimpan data warung.');
            $scope.state.loading = false;
          });
        return;
      }

      const file = data.image[0].lfFile;
      const filename = file.name;
      const uploadTask = WarungService.putImage(file, filename);
      uploadTask.$error(err => {
        toast('Terjadi kegagalan saat upload gambar.');
      });
      uploadTask.$complete(snapshot => {
        const push = {
          daerah: data.daerah,
          deskripsi: data.deskripsi,
          kategori: data.kategori,
          lat: data.latitude,
          lng: data.longitude,
          nama: data.nama,
          picture: snapshot.downloadURL,
          uid: localStorage.getItem('uid'),
          softDelete: false,
          indexUidSoftDelete: `${false}_${localStorage.getItem('uid')}`,
        };
        WarungService
          .pushDataWarung(push)
          .then(() => {
            toast('Data warung berhasil disimpan.');
            this.action.back();
            $scope.state.loading = false;
          })
          .catch(() => {
            toast('Terjadi kegagalan saat menyimpan data warung.');
            $scope.state.loading = false;
          });
      });
      return;
    };

    $scope.onSubmitUpdate = function (data) {
      $scope.state.loading = true;
      if (data.image.length === 0) {
        const push = {
          daerah: data.daerah,
          deskripsi: data.deskripsi,
          kategori: data.kategori,
          lat: data.latitude,
          lng: data.longitude,
          nama: data.nama,
        };

        WarungService
          .updateDataWarung($scope.state.selected.$id, push)
          .then(() => {
            toast('Data warung berhasil di update.');
            this.action.back();
            $scope.state.loading = false;
          })
          .catch(err => {
            toast('Terjadi kegagalan saat update data warung.');

            $scope.state.loading = false;
          });
        return;
      }

      const file = data.image[0].lfFile;
      const filename = file.name;

      const uploadTask = WarungService.putImage(file, filename);
      uploadTask.$error(err => {
        toast('Terjadi kegagalan saat upload gambar.');
        $scope.state.loading = false;
      });
      uploadTask.$complete(snapshot => {
        const push = {
          daerah: data.daerah,
          deskripsi: data.deskripsi,
          kategori: data.kategori,
          lat: data.latitude,
          lng: data.longitude,
          nama: data.nama,
          picture: snapshot.downloadURL,
        };

        WarungService
          .updateDataWarung($scope.state.selected.$id, push)
          .then(() => {
            toast('Data warung berhasil di update.');
            this.action.back();
            $scope.state.loading = false;
          })
          .catch(() => {
            toast('Terjadi kegagalan saat update data warung.');
            $scope.state.loading = false;
          });
      });
      return;
    }

    // fungsi pembantu
    function alertWindow(err) {
      $mdDialog.show(
        $mdDialog.alert({
          title: 'Attention',
          textContent: err,
          ok: 'Close',
        })
      )
    }

    function toast(text) {
      $mdToast.show(
        $mdToast.simple()
          .textContent(text)
          .position('top right')
          .hideDelay(4000)
      );
    }
  }])
  .controller('AdminWarung_MakananCtrl', ['$scope', 'MakananService', '$mdDialog', '$mdToast', function ($scope, MakananService, $mdDialog, $mdToast) {
    $scope.state = {
      title: 'Data Makanan',
      subtitle: 'Tabel data makanan',
      act: 'read',
      data: [],
      selected: {},
      kategori: [],
      warung: [],
      loading: true,
    };

    // fetch data
    MakananService.getMakanan()
      .then(data => {
        console.log(data);
        $scope.state.data = data;
        return MakananService.getKategori();
      })
      .then(data => {
        $scope.state.kategori = data;
        return MakananService.getWarung();
      })
      .then(data => {
        $scope.state.warung = data;
        $scope.state.loading = false;
      })
      .catch(() => toast('Terjadi kesalahan dalam mengambil data.'));

    // fungsi action
    $scope.action = {
      add: function () {
        $scope.state.act = 'add';
        $scope.state.subtitle = 'Tambah data makanan';
        $scope.formField = {};
      },
      update: function () {
        $scope.state.act = 'update';
        $scope.state.subtitle = 'Update data makanan';
      },
      back: function () {
        $scope.state.act = 'read';
        $scope.state.subtitle = 'Tabel data makanan';
      },
    };

    $scope.edit = function (data) {
      $scope.state.selected = data;
      $scope.action.update();
      $scope.formField = {
        nama: data.nama,
        kategori: data.kategori,
        warung: data.warungId,
        harga: data.harga,
        deskripsi: data.deskripsi,
      };
    };

    $scope.delete = function (data, ev) {
      const confirm = $mdDialog.confirm()
        .title('Delete data ?')
        .textContent(`Data dengan nama : ${data.nama}`)
        .ariaLabel('Delete Confirmation')
        .targetEvent(ev)
        .ok('Ya')
        .cancel('Tidak');

      $mdDialog.show(confirm)
        .then(() => {
          MakananService.deleteData(data.$id)
            .then(() => toast(`Data : ${data.nama} berhasil di hapus`))
            .catch(() => toast('Terjadi kesalahan saat hapus data.'))
        })
        .catch(err => { });
    };

    // fungsi submit form
    $scope.onSubmitAdd = function (data) {
      $scope.state.loading = true;
      if (data.image.length === 0) {
        const push = {
          deskripsi: data.deskripsi,
          kategori: data.kategori,
          warungId: data.warung,
          nama: data.nama,
          harga: data.harga,
          picture: 'https://firebasestorage.googleapis.com/v0/b/ajengan-bali.appspot.com/o/assets%2FNoImage.png?alt=media&token=86dca0ea-2252-4f0a-8ffc-da006ce1752c',
          uid: localStorage.getItem('uid'),
          softDelete: false,
          indexUidSoftDelete: `${false}_${localStorage.getItem('uid')}`,
          indexWarungSoftDelete: `${false}_${data.warung}`,
        };

        MakananService
          .pushData(push)
          .then(() => {
            toast('Data berhasil disimpan.');
            $scope.action.back();
            $scope.state.loading = false;
          })
          .catch(() => {
            toast('Terjadi kegagalan saat menyimpan data.');
            $scope.state.loading = false;
          });
        return;
      }

      const file = data.image[0].lfFile;
      const filename = file.name;
      const uploadTask = MakananService.putImage(file, filename);
      uploadTask.$error(err => {
        toast('Terjadi kegagalan saat upload gambar.');
      });
      uploadTask.$complete(snapshot => {
        const push = {
          deskripsi: data.deskripsi,
          kategori: data.kategori,
          warungId: data.warung,
          nama: data.nama,
          harga: data.harga,
          picture: snapshot.downloadURL,
          uid: localStorage.getItem('uid'),
          softDelete: false,
          indexUidSoftDelete: `${false}_${localStorage.getItem('uid')}`,
          indexWarungSoftDelete: `${false}_${data.warung}`,
        };
        MakananService
          .pushData(push)
          .then(() => {
            toast('Data berhasil disimpan.');
            $scope.action.back();
            $scope.state.loading = false;
          })
          .catch(() => {
            toast('Terjadi kegagalan saat menyimpan data.');
            $scope.state.loading = false;
          });
      });
      return;
    };

    $scope.onSubmitUpdate = function (data) {
      $scope.state.loading = true;
      if (data.image.length === 0) {
        console.log(data);
        const push = {
          nama: data.nama,
          kategori: data.kategori,
          warung: data.warung,
          harga: data.harga,
          deskripsi: data.deskripsi,
        };

        MakananService
          .updateData($scope.state.selected.$id, push)
          .then(() => {
            toast('Data berhasil di update.');
            $scope.action.back();
            $scope.state.loading = false;
          })
          .catch(() => {
            toast('Terjadi kegagalan saat update data.');
            $scope.state.loading = false;
          });
        return;
      }

      const file = data.image[0].lfFile;
      const filename = file.name;

      const uploadTask = MakananService.putImage(file, filename);
      uploadTask.$error(err => {
        toast('Terjadi kegagalan saat upload gambar.');
        $scope.state.loading = false;
      });
      uploadTask.$complete(snapshot => {
        const push = {
          nama: data.nama,
          kategori: data.kategori,
          warung: data.warung,
          harga: data.harga,
          deskripsi: data.deskripsi,
          picture: snapshot.downloadURL,
        };

        MakananService
          .updateData($scope.state.selected.$id, push)
          .then(() => {
            toast('Data berhasil di update.');
            $scope.action.back();
            $scope.state.loading = false;
          })
          .catch(() => {
            toast('Terjadi kegagalan saat update data.');
            $scope.state.loading = false;
          });
      });
      return;
    }

    // fungsi pembantu
    function toast(text) {
      $mdToast.show(
        $mdToast.simple()
          .textContent(text)
          .position('top right')
          .hideDelay(4000)
      );
    }
  }]);