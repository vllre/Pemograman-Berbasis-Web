var ApiService = (function () {
  var _cache = null;

  return {
    getData: function () {
      if (_cache) {
        return Promise.resolve(_cache);
      }
      return fetch("data/dataBahanAjar.json")
        .then(function (response) {
          if (!response.ok) {
            throw new Error("HTTP " + response.status + ": Gagal memuat data");
          }
          return response.json();
        })
        .then(function (json) {
          _cache = json;
          return json;
        });
    },

    clearCache: function () {
      _cache = null;
    },
  };
})();
