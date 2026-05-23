var app = new Vue({
    el: '#app',
    data: {
        // Master Lists
        upbjjList: ["Jakarta", "Surabaya", "Makassar", "Padang", "Denpasar"],
        kategoriList: ["MK Wajib", "MK Pilihan", "Praktikum", "Problem-Based"],
        
        // Main State
        stok: [],
        
        // Filters State
        filterUpbjj: "",
        filterKategori: "",
        filterReorderOnly: false,
        sortBy: "judul",
        
        // UI Control States
        showAddForm: false,
        showEditModal: false,
        
        // Forms State
        newForm: {
            kode: "",
            judul: "",
            kategori: "",
            upbjj: "",
            lokasiRak: "",
            harga: null,
            qty: null,
            safety: null,
            catatanHTML: ""
        },
        editForm: {
            kode: "",
            judul: "",
            qty: 0,
            safety: 0,
            catatanHTML: ""
        }
    },
    
    // Watchers
    watch: {
        filterUpbjj: function(newVal, oldVal) {
            if (!newVal) {
                this.filterKategori = "";
            }
        },
        "newForm.kode": function(newVal) {
            if (newVal) {
                this.newForm.kode = newVal.toUpperCase();
            }
        }
    },
    
    // Computed Properties
    computed: {
        filteredAndSortedStok: function() {
            var result = this.stok;
            
            // 1. Filter by UPBJJ
            if (this.filterUpbjj) {
                result = result.filter(function(item) {
                    return item.upbjj === this.filterUpbjj;
                }, this);
                
                // 2. Filter by Kategori 
                if (this.filterKategori) {
                    result = result.filter(function(item) {
                        return item.kategori === this.filterKategori;
                    }, this);
                }
            }
            
            // 3. Filter by Reorder Alert
            if (this.filterReorderOnly) {
                result = result.filter(function(item) {
                    return item.qty < item.safety || item.qty === 0;
                });
            }
            
            // 4. Sorting logic
            var sortField = this.sortBy;
            return result.slice().sort(function(a, b) {
                if (sortField === 'judul') {
                    return a.judul.localeCompare(b.judul);
                } else if (sortField === 'qty') {
                    return a.qty - b.qty; 
                } else if (sortField === 'harga') {
                    return a.harga - b.harga; 
                }
                return 0;
            });
        }
    },
    
    // Lifecycle Hook
    created: function() {
        this.loadInitialData();
    },
    
    methods: {
        loadInitialData: function() {
            var localData = localStorage.getItem('ut_stok');
            if (localData) {
                try {
                    this.stok = JSON.parse(localData);
                } catch(e) {
                    this.stok = this.getDefaultStok();
                }
            } else {
                this.stok = this.getDefaultStok();
                this.saveToLocal();
            }
        },

        //Template
        getDefaultStok: function() {
            return [
                {
                    kode: "EKMA4116",
                    judul: "Pengantar Manajemen",
                    kategori: "MK Wajib",
                    upbjj: "Jakarta",
                    lokasiRak: "R1-A3",
                    harga: 65000,
                    qty: 28,
                    safety: 20,
                    catatanHTML: "<em>Edisi 2024, cetak ulang</em>"
                },
                {
                    kode: "EKMA4115",
                    judul: "Pengantar Akuntansi",
                    kategori: "MK Wajib",
                    upbjj: "Jakarta",
                    lokasiRak: "R1-A4",
                    harga: 60000,
                    qty: 7,
                    safety: 15,
                    catatanHTML: "<strong>Cover baru</strong>"
                },
                {
                    kode: "BIOL4201",
                    judul: "Biologi Umum (Praktikum)",
                    kategori: "Praktikum",
                    upbjj: "Surabaya",
                    lokasiRak: "R3-B2",
                    harga: 80000,
                    qty: 12,
                    safety: 10,
                    catatanHTML: "Butuh <u>pendingin</u> untuk kit basah"
                },
                {
                    kode: "FISIP4001",
                    judul: "Dasar-Dasar Sosiologi",
                    kategori: "MK Pilihan",
                    upbjj: "Makassar",
                    lokasiRak: "R2-C1",
                    harga: 55000,
                    qty: 2,
                    safety: 8,
                    catatanHTML: "Stok <i>menipis</i>, prioritaskan reorder"
                }
            ];
        },
        
        // Save state to localStorage
        saveToLocal: function() {
            localStorage.setItem('ut_stok', JSON.stringify(this.stok));
        },
        
        // Add New Book Method
        addNewStok: function() {
            var exists = this.stok.some(function(item) {
                return item.kode === this.newForm.kode;
            }, this);
            
            if (exists) {
                alert("Gagal: Bahan ajar dengan kode '" + this.newForm.kode + "' sudah ada di sistem!");
                return;
            }
            
            // Push to local stok list
            this.stok.push({
                kode: this.newForm.kode,
                judul: this.newForm.judul,
                kategori: this.newForm.kategori,
                upbjj: this.newForm.upbjj,
                lokasiRak: this.newForm.lokasiRak,
                harga: Number(this.newForm.harga),
                qty: Number(this.newForm.qty),
                safety: Number(this.newForm.safety),
                catatanHTML: this.newForm.catatanHTML || "-"
            });
            
            // Save state & Reset form
            this.saveToLocal();
            this.resetForm();
            this.showAddForm = false;
            alert("Berhasil: Bahan ajar baru berhasil ditambahkan!");
        },
        
        // Reset Form inputs
        resetForm: function() {
            this.newForm = {
                kode: "",
                judul: "",
                kategori: "",
                upbjj: "",
                lokasiRak: "",
                harga: null,
                qty: null,
                safety: null,
                catatanHTML: ""
            };
        },
        
        // Delete Stok Entry
        deleteStok: function(kode) {
            if (confirm("Apakah Anda yakin ingin menghapus data dengan kode: " + kode + "?")) {
                this.stok = this.stok.filter(function(item) {
                    return item.kode !== kode;
                });
                this.saveToLocal();
            }
        },
        
        // Reset all filter options
        resetFilters: function() {
            this.filterUpbjj = "";
            this.filterKategori = "";
            this.filterReorderOnly = false;
            this.sortBy = "judul";
        },
        
        // Edit Modal Actions
        openEditModal: function(item) {
            this.editForm = {
                kode: item.kode,
                judul: item.judul,
                qty: item.qty,
                safety: item.safety,
                catatanHTML: item.catatanHTML
            };
            this.showEditModal = true;
        },
        
        closeEditModal: function() {
            this.showEditModal = false;
        },
        
        saveEdit: function() {
            var targetIndex = this.stok.findIndex(function(item) {
                return item.kode === this.editForm.kode;
            }, this);
            
            if (targetIndex !== -1) {
                this.stok[targetIndex].qty = Number(this.editForm.qty);
                this.stok[targetIndex].safety = Number(this.editForm.safety);
                this.stok[targetIndex].catatanHTML = this.editForm.catatanHTML || "-";
                
                // Save state
                this.saveToLocal();
                this.closeEditModal();
                alert("Berhasil: Detail data ketersediaan berhasil diperbarui.");
            }
        }
    }
});
