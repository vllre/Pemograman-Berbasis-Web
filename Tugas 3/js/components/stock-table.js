Vue.component("ba-stock-table", function (resolve, reject) {
  fetch("templates/stock-table.html")
    .then(function (res) {
      return res.text();
    })
    .then(function (html) {
      resolve({
        data: function () {
          return {
            upbjjList: [],
            kategoriList: [],

            stok: [],

            filterUpbjj: "",
            filterKategori: "",
            filterReorderOnly: false,
            sortBy: "judul",

            showAddForm: false,
            showEditModal: false,

            newForm: {
              kode: "",
              judul: "",
              kategori: "",
              upbjj: "",
              lokasiRak: "",
              harga: null,
              qty: null,
              safety: null,
              catatanHTML: "",
            },

            editForm: {
              kode: "",
              judul: "",
              qty: 0,
              safety: 0,
              catatanHTML: "",
            },
          };
        },
        watch: {
          filterUpbjj: function (val) {
            if (!val) this.filterKategori = "";
          },
          "newForm.kode": function (val) {
            if (val) this.newForm.kode = val.toUpperCase();
          },
        },

        computed: {
          filteredAndSortedStok: function () {
            var result = this.stok;
            if (this.filterUpbjj) {
              result = result.filter(function (item) {
                return item.upbjj === this.filterUpbjj;
              }, this);
              if (this.filterKategori) {
                result = result.filter(function (item) {
                  return item.kategori === this.filterKategori;
                }, this);
              }
            }
            if (this.filterReorderOnly) {
              result = result.filter(function (item) {
                return item.qty < item.safety || item.qty === 0;
              });
            }
            var sf = this.sortBy;
            return result.slice().sort(function (a, b) {
              if (sf === "judul") return a.judul.localeCompare(b.judul);
              if (sf === "qty") return a.qty - b.qty;
              if (sf === "harga") return a.harga - b.harga;
              return 0;
            });
          },
        },

        created: function () {
          var self = this;
          ApiService.getData()
            .then(function (json) {
              self.upbjjList = json.upbjjList || [];
              self.kategoriList = json.kategoriList || [];
              var local = localStorage.getItem("ut_stok");
              if (local) {
                try {
                  self.stok = JSON.parse(local);
                } catch (e) {
                  self.stok = json.stok || [];
                  self.saveToLocal();
                }
              } else {
                self.stok = json.stok || [];
                self.saveToLocal();
              }
            })
            .catch(function (err) {
              console.error(err);
              alert("Gagal memuat data. Pastikan server HTTP aktif.");
            });
        },

        methods: {
          saveToLocal: function () {
            localStorage.setItem("ut_stok", JSON.stringify(this.stok));
          },
          addNewStok: function () {
            var exists = this.stok.some(function (item) {
              return item.kode === this.newForm.kode;
            }, this);
            if (exists) {
              alert("Kode '" + this.newForm.kode + "' sudah ada!");
              return;
            }
            this.stok.push({
              kode: this.newForm.kode,
              judul: this.newForm.judul,
              kategori: this.newForm.kategori,
              upbjj: this.newForm.upbjj,
              lokasiRak: this.newForm.lokasiRak,
              harga: Number(this.newForm.harga),
              qty: Number(this.newForm.qty),
              safety: Number(this.newForm.safety),
              catatanHTML: this.newForm.catatanHTML || "-",
            });
            this.saveToLocal();
            this.resetForm();
            this.showAddForm = false;
            alert("Bahan ajar baru berhasil ditambahkan!");
          },
          resetForm: function () {
            this.newForm = {
              kode: "",
              judul: "",
              kategori: "",
              upbjj: "",
              lokasiRak: "",
              harga: null,
              qty: null,
              safety: null,
              catatanHTML: "",
            };
          },
          deleteStok: function (kode) {
            if (confirm("Hapus data dengan kode: " + kode + "?")) {
              this.stok = this.stok.filter(function (item) {
                return item.kode !== kode;
              });
              this.saveToLocal();
            }
          },
          resetFilters: function () {
            this.filterUpbjj = "";
            this.filterKategori = "";
            this.filterReorderOnly = false;
            this.sortBy = "judul";
          },
          openEditModal: function (item) {
            this.editForm = {
              kode: item.kode,
              judul: item.judul,
              qty: item.qty,
              safety: item.safety,
              catatanHTML: item.catatanHTML,
            };
            this.showEditModal = true;
          },
          closeEditModal: function () {
            this.showEditModal = false;
          },
          saveEdit: function () {
            var idx = this.stok.findIndex(function (item) {
              return item.kode === this.editForm.kode;
            }, this);
            if (idx !== -1) {
              this.stok[idx].qty = Number(this.editForm.qty);
              this.stok[idx].safety = Number(this.editForm.safety);
              this.stok[idx].catatanHTML = this.editForm.catatanHTML || "-";
              this.saveToLocal();
              this.closeEditModal();
              alert("Data berhasil diperbarui.");
            }
          },
        },

        template: html,
      });
    })
    .catch(reject);
});
