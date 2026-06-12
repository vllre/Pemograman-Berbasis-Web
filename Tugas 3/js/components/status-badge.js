Vue.component("status-badge", function (resolve, reject) {
  fetch("templates/status-badge.html")
    .then(function (response) {
      return response.text();
    })
    .then(function (html) {
      resolve({
        props: {
          qty: { type: Number, required: true },
          safety: { type: Number, required: true },
          catatan: { type: String, default: "-" },
        },
        data: function () {
          return { hover: false };
        },
        computed: {
          label: function () {
            if (this.qty === 0) return "KOSONG";
            if (this.qty < this.safety) return "MENIPIS";
            return "AMAN";
          },
          icon: function () {
            if (this.qty === 0) return "🔴";
            if (this.qty < this.safety) return "🟡";
            return "🟢";
          },
          badgeClass: function () {
            if (this.qty === 0) return "badge badge-danger";
            if (this.qty < this.safety) return "badge badge-warning";
            return "badge badge-success";
          },
          hasCatatan: function () {
            return (
              this.catatan && this.catatan !== "-" && this.catatan.trim() !== ""
            );
          },
        },
        template: html,
      });
    })
    .catch(reject);
});
