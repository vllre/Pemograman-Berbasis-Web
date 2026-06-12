Vue.component("app-modal", function (resolve, reject) {
  fetch("templates/app-modal.html")
    .then(function (response) {
      return response.text();
    })
    .then(function (html) {
      resolve({
        props: {
          visible: { type: Boolean, default: false },
          title: { type: String, default: "" },
        },
        template: html,
      });
    })
    .catch(reject);
});
