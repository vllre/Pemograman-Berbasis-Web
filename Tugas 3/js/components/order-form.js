Vue.component("order-form", function (resolve, reject) {
  fetch("templates/order-form.html")
    .then(function (response) {
      return response.text();
    })
    .then(function (html) {
      resolve({
        data: function () {
          return {
            pengirimanList: [],
            paket: [],
            form: {
              nim: "",
              nama: "",
              ekspedisi: "",
              paketCode: "",
              tanggalKirim: "",
              total: 0,
            },
            nextDoNumber: "",
            submitted: false,
          };
        },

        watch: {
          "form.paketCode": function (val) {
            var pkg = this.paket.find(function (p) {
              return p.kode === val;
            });
            this.form.total = pkg ? pkg.harga : 0;
          },
        },

        computed: {
          selectedPaket: function () {
            return (
              this.paket.find(function (p) {
                return p.kode === this.form.paketCode;
              }, this) || null
            );
          },
          tanggalFormatted: function () {
            return this.$options.filters.tglIndonesia(this.form.tanggalKirim);
          },
        },

        created: function () {
          var self = this;
          this.form.tanggalKirim = this.getTodayString();
          ApiService.getData().then(function (json) {
            self.pengirimanList = json.pengirimanList || [];
            self.paket = json.paket || [];
          });
          this.generateNextDo();
        },

        methods: {
          getTodayString: function () {
            var d = new Date();
            return (
              d.getFullYear() +
              "-" +
              String(d.getMonth() + 1).padStart(2, "0") +
              "-" +
              String(d.getDate()).padStart(2, "0")
            );
          },
          generateNextDo: function () {
            var year = new Date().getFullYear();
            var prefix = "DO" + year + "-";
            var data = {};
            try {
              data = JSON.parse(localStorage.getItem("ut_tracking") || "{}");
            } catch (e) {}
            var max = 0;
            for (var key in data) {
              if (key.indexOf(prefix) === 0) {
                var n = parseInt(key.replace(prefix, ""), 10);
                if (!isNaN(n) && n > max) max = n;
              }
            }
            this.nextDoNumber = prefix + String(max + 1).padStart(3, "0");
          },
          getTimestamp: function () {
            var n = new Date();
            return (
              n.getFullYear() +
              "-" +
              String(n.getMonth() + 1).padStart(2, "0") +
              "-" +
              String(n.getDate()).padStart(2, "0") +
              " " +
              String(n.getHours()).padStart(2, "0") +
              ":" +
              String(n.getMinutes()).padStart(2, "0") +
              ":" +
              String(n.getSeconds()).padStart(2, "0")
            );
          },
          submitOrder: function () {
            var doNum = this.nextDoNumber;
            var data = {};
            try {
              data = JSON.parse(localStorage.getItem("ut_tracking") || "{}");
            } catch (e) {}
            data[doNum] = {
              nim: this.form.nim,
              nama: this.form.nama,
              status: "Diproses",
              ekspedisi: this.form.ekspedisi,
              tanggalKirim: this.form.tanggalKirim,
              paket: this.form.paketCode,
              total: this.form.total,
              perjalanan: [
                {
                  waktu: this.getTimestamp(),
                  keterangan:
                    "Penerimaan di Loket: UT PUSAT. Pengirim: Universitas Terbuka",
                },
              ],
            };
            localStorage.setItem("ut_tracking", JSON.stringify(data));
            alert("DO " + doNum + " berhasil dibuat!");
            this.submitted = true;
            this.resetForm();
            this.generateNextDo();
          },
          resetForm: function () {
            this.form = {
              nim: "",
              nama: "",
              ekspedisi: "",
              paketCode: "",
              tanggalKirim: this.getTodayString(),
              total: 0,
            };
            this.submitted = false;
          },
          onEnter: function () {
            this.submitOrder();
          },
        },

        template: html,
      });
    })
    .catch(reject);
});
