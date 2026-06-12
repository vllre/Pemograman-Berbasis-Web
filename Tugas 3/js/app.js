// ===================== GLOBAL VUE FILTERS =====================

/** Filter: format angka menjadi "Rp 65.000" */
Vue.filter("rupiah", function (value) {
  if (value === null || value === undefined) return "Rp 0";
  return "Rp " + Number(value).toLocaleString("id-ID");
});

/** Filter: tambah satuan " buah" */
Vue.filter("buah", function (value) {
  return value + " buah";
});

/** Filter: format tanggal */
Vue.filter("tglIndonesia", function (dateStr) {
  if (!dateStr) return "-";
  var namaBulan = [
    "Januari",
    "Februari",
    "Maret",
    "April",
    "Mei",
    "Juni",
    "Juli",
    "Agustus",
    "September",
    "Oktober",
    "November",
    "Desember",
  ];
  var parts = String(dateStr).split("-");
  if (parts.length !== 3) return dateStr;
  var tgl = parseInt(parts[2], 10);
  var bln = namaBulan[parseInt(parts[1], 10) - 1] || "";
  var thn = parts[0];
  return tgl + " " + bln + " " + thn;
});

// ===================== ROOT VUE INSTANCE =====================

var app = new Vue({
  el: "#app",
  data: {
    tab: "dashboard",
  },
});

// Greeting dinamis
(function () {
  var hour = new Date().getHours();
  var el = document.getElementById("greeting");
  if (!el) return;
  var text = "Selamat Malam, Operator SITTA";
  if (hour < 11) text = "Selamat Pagi, Operator SITTA";
  else if (hour < 15) text = "Selamat Siang, Operator SITTA";
  else if (hour < 19) text = "Selamat Sore, Operator SITTA";
  el.innerText = text;
})();
