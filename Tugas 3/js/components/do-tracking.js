Vue.component("do-tracking", function (resolve, reject) {
  fetch("templates/do-tracking.html")
    .then(function (response) {
      return response.text();
    })
    .then(function (html) {
      resolve({
        data: function () {
          return {
            trackingData: {},
            searchQuery: "",
            activeTracking: null,
            newTimelineDesc: "",
            newTimelineStatus: "Dalam Perjalanan",
          };
        },

        watch: {
          searchQuery: function (val) {
            if (!val) this.activeTracking = null;
          },
        },

        created: function () {
          this.loadTrackingData();
        },

        methods: {
          loadTrackingData: function () {
            var self = this;
            var local = localStorage.getItem("ut_tracking");
            if (local) {
              try {
                self.trackingData = JSON.parse(local);
                return;
              } catch (e) {}
            }
            ApiService.getData().then(function (json) {
              var result = {};
              if (Array.isArray(json.tracking)) {
                json.tracking.forEach(function (item) {
                  var key = Object.keys(item)[0];
                  if (key) result[key] = item[key];
                });
              } else if (json.tracking && typeof json.tracking === "object") {
                result = json.tracking;
              }
              self.trackingData = result;
              self.saveToLocal();
            });
          },
          saveToLocal: function () {
            localStorage.setItem(
              "ut_tracking",
              JSON.stringify(this.trackingData),
            );
          },
          performSearch: function () {
            var q = this.searchQuery.trim();
            if (!q) {
              alert("Masukkan Nomor DO atau NIM!");
              return;
            }
            if (this.trackingData[q]) {
              this.activeTracking = Object.assign(
                { doKey: q },
                this.trackingData[q],
              );
              return;
            }
            for (var key in this.trackingData) {
              if (this.trackingData[key].nim === q) {
                this.activeTracking = Object.assign(
                  { doKey: key },
                  this.trackingData[key],
                );
                return;
              }
            }
            alert("Data dengan Nomor DO atau NIM '" + q + "' tidak ditemukan!");
          },
          onSearchKeyup: function (e) {
            if (e.key === "Escape") {
              this.searchQuery = "";
              this.activeTracking = null;
            }
            if (e.key === "Enter") {
              this.performSearch();
            }
          },
          getFormattedTimestamp: function () {
            var now = new Date();
            return (
              now.getFullYear() +
              "-" +
              String(now.getMonth() + 1).padStart(2, "0") +
              "-" +
              String(now.getDate()).padStart(2, "0") +
              " " +
              String(now.getHours()).padStart(2, "0") +
              ":" +
              String(now.getMinutes()).padStart(2, "0") +
              ":" +
              String(now.getSeconds()).padStart(2, "0")
            );
          },
          addTimelineStep: function () {
            if (!this.newTimelineDesc.trim()) {
              alert("Isi keterangan perjalanan!");
              return;
            }
            var key = this.activeTracking.doKey;
            var record = this.trackingData[key];
            if (record) {
              record.perjalanan.unshift({
                waktu: this.getFormattedTimestamp(),
                keterangan: this.newTimelineDesc.trim(),
              });
              record.status = this.newTimelineStatus;
              this.saveToLocal();
              this.activeTracking = Object.assign({ doKey: key }, record);
              this.newTimelineDesc = "";
              alert("Status perjalanan berhasil ditambahkan.");
            }
          },
        },

        template: html,
      });
    })
    .catch(reject);
});
