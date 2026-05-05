// --- LOGIN FUNCTIONS ---
function doLogin() {
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value;

  if (!email || !password) {
    alert("Harap isi email dan password terlebih dahulu.");
    return;
  }

  const user = dataPengguna.find(
    (u) => u.email === email && u.password === password,
  );

  if (user) {
    sessionStorage.setItem("currentUser", JSON.stringify(user));
    window.location.href = "dashboard.html";
  } else {
    alert("Email/password yang anda masukkan salah");
  }
}

function openModal(id) {
  document.getElementById(id).style.display = "flex";
}

function closeModal(id) {
  document.getElementById(id).style.display = "none";
}

document.addEventListener("keydown", (e) => {
  if (e.key === "Enter") doLogin();
});

// --- DASHBOARD FUNCTIONS ---
function setGreeting() {
  const hour = new Date().getHours();
  const greetElement = document.getElementById("greeting");
  if (!greetElement) return;

  let text = "Selamat Malam";
  if (hour < 11) text = "Selamat Pagi";
  else if (hour < 15) text = "Selamat Siang";
  else if (hour < 19) text = "Selamat Sore";
  greetElement.innerText = text;
}

// --- TRACKING FUNCTIONS ---
function trackOrder() {
  const noDO = document.getElementById("noDO").value.trim();
  const data = dataTracking[noDO];
  const resDiv = document.getElementById("result");

  if (data) {
    resDiv.style.display = "block";
    document.getElementById("trackHeader").innerHTML =
      `<strong>${data.nama}</strong> | DO: ${data.nomorDO}<br>Status: <em>${data.status}</em>`;
    document.getElementById("trackDetails").innerHTML =
      `Ekspedisi: ${data.ekspedisi} | Paket: ${data.paket} | Total: ${data.total}`;

    let list = "";
    data.perjalanan.forEach((p) => {
      list += `<li><small>${p.waktu}</small> — ${p.keterangan}</li>`;
    });
    document.getElementById("trackHistory").innerHTML = list;
  } else {
    alert("Nomor DO tidak ditemukan!");
  }
}

// --- STOK FUNCTIONS ---
function loadStokVisual() {
  const container = document.getElementById("stokContainer");
  if (!container) return;
  container.innerHTML = "";

  dataBahanAjar.forEach((item) => {
    const card = document.createElement("div");
    card.className = "card";
    card.innerHTML = `
            <img src="${item.cover}" class="card-img"
                 alt="${item.namaBarang}"
                 onerror="this.src='https://picsum.photos/seed/picsum/200/150'">
            <h4>${item.namaBarang}</h4>
            <p><strong>Kode:</strong> ${item.kodeBarang}</p>
            <p><strong>Lokasi:</strong> ${item.kodeLokasi}</p>
            <p>Stok: <strong>${item.stok}</strong></p>
        `;
    container.appendChild(card);
  });
}

function addNewCard() {
  const nama = document.getElementById("newNama").value.trim();
  const qty = document.getElementById("newQty").value.trim();
  const kode = document.getElementById("newKode").value.trim();
  const lokasi = document.getElementById("newLokasi").value.trim();

  if (nama && qty && kode && lokasi) {
    const container = document.getElementById("stokContainer");
    const card = document.createElement("div");
    card.className = "card";
    card.innerHTML = `
            <img src="https://picsum.photos/seed/picsum/200/150" class="card-img" alt="${nama}">
            <h4>${nama}</h4>
            <p><strong>Kode:</strong> ${kode}</p>
            <p><strong>Lokasi:</strong> ${lokasi}</p>
            <p>Stok: <strong>${qty}</strong></p>
        `;
    container.appendChild(card);

    document.getElementById("newNama").value = "";
    document.getElementById("newQty").value = "";

    alert("Data berhasil ditambahkan!");
  } else {
    alert("Mohon isi Nama Bahan Ajar dan Jumlah Stok!");
  }
}

// --- DROPDOWN TOGGLE (Laporan) ---
function toggleDropdown() {
  const drop = document.getElementById("dropLaporan");
  if (!drop) return;
  drop.style.display = drop.style.display === "block" ? "none" : "block";
}
