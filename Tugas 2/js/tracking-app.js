var app = new Vue({
    el: '#app',
    data: {
        upbjjList: ["Jakarta", "Surabaya", "Makassar", "Padang", "Denpasar"],
        pengirimanList: [
            { kode: "REG", nama: "JNE Regular (3-5 hari)" },
            { kode: "EXP", nama: "JNE Express (1-2 hari)" }
        ],
        paket: [
            { kode: "PAKET-UT-001", nama: "PAKET IPS Dasar", isi: ["EKMA4116","EKMA4115"], harga: 120000 },
            { kode: "PAKET-UT-002", nama: "PAKET IPA Dasar", isi: ["BIOL4201","FISIP4001"], harga: 140000 }
        ],
        
        // Main Tracking Dictionary
        trackingData: {},
        
        // Search & Active Display State
        searchDoNum: "",
        activeTracking: null,
        
        // Form & UI States
        showAddDoForm: false,
        newDoForm: {
            nim: "",
            nama: "",
            ekspedisi: "",
            paketCode: "",
            tanggalKirim: "",
            total: 0
        },
        
        // Timeline Form States
        newTimelineDesc: "",
        newTimelineStatus: "Dalam Perjalanan"
    },
    
    // Watchers
    watch: {
       "newDoForm.paketCode": function(newVal) {
            var selectedPkg = this.paket.find(function(p) {
                return p.kode === newVal;
            });
            if (selectedPkg) {
                this.newDoForm.total = selectedPkg.harga;
            } else {
                this.newDoForm.total = 0;
            }
        },
        
       searchDoNum: function(newVal) {
            if (!newVal) {
                this.activeTracking = null;
            }
        }
    },
    
    // Computed Properties
    computed: {
        nextDoNumber: function() {
            var currentYear = new Date().getFullYear();
            var prefix = "DO" + currentYear + "-";
            var maxSequence = 0;
            
            for (var key in this.trackingData) {
                if (key.indexOf(prefix) === 0) {
                    var parts = key.split("-");
                    if (parts.length === 2) {
                        var seqNum = parseInt(parts[1], 10);
                        if (!isNaN(seqNum) && seqNum > maxSequence) {
                            maxSequence = seqNum;
                        }
                    }
                }
            }
            
            // Increment
            var nextSeq = maxSequence + 1;
            var paddedSeq = String(nextSeq).padStart(3, '0');
            return prefix + paddedSeq;
        },
        
        selectedPaketDetails: function() {
            if (!this.newDoForm.paketCode) return null;
            return this.paket.find(function(p) {
                return p.kode === this.newDoForm.paketCode;
            }, this);
        }
    },
    
    // load data
    created: function() {
        this.loadInitialTracking();
        this.newDoForm.tanggalKirim = this.getLocalDateString();
    },
    
    methods: {
        loadInitialTracking: function() {
            var localData = localStorage.getItem('ut_tracking');
            if (localData) {
                try {
                    this.trackingData = JSON.parse(localData);
                } catch(e) {
                    this.trackingData = this.getDefaultTracking();
                }
            } else {
                this.trackingData = this.getDefaultTracking();
                this.saveToLocal();
            }
        },
        
        // Template
        getDefaultTracking: function() {
            return {
                "DO2025-001": {
                    nim: "123456789",
                    nama: "Rina Wulandari",
                    status: "Dalam Perjalanan",
                    ekspedisi: "JNE Regular (3-5 hari)",
                    tanggalKirim: "2025-08-25",
                    paket: "PAKET-UT-001",
                    total: 120000,
                    perjalanan: [
                        { waktu: "2025-08-26 08:44:01", keterangan: "Diteruskan ke Kantor Tujuan" },
                        { waktu: "2025-08-25 14:07:56", keterangan: "Tiba di Hub: JAKSEL" },
                        { waktu: "2025-08-25 10:12:20", keterangan: "Penerimaan di Loket: TANGSEL" }
                    ]
                }
            };
        },
        
        // Save to local storage
        saveToLocal: function() {
            localStorage.setItem('ut_tracking', JSON.stringify(this.trackingData));
        },
        
        // Local Date helper
        getLocalDateString: function() {
            var today = new Date();
            var dy = String(today.getDate()).padStart(2, '0');
            var mn = String(today.getMonth() + 1).padStart(2, '0');
            var yr = today.getFullYear();
            return yr + "-" + mn + "-" + dy;
        },
        
        // Timestamp helper
        getFormattedTimestamp: function() {
            var now = new Date();
            var dy = String(now.getDate()).padStart(2, '0');
            var mn = String(now.getMonth() + 1).padStart(2, '0');
            var yr = now.getFullYear();
            var hr = String(now.getHours()).padStart(2, '0');
            var min = String(now.getMinutes()).padStart(2, '0');
            var sec = String(now.getSeconds()).padStart(2, '0');
            return yr + "-" + mn + "-" + dy + " " + hr + ":" + min + ":" + sec;
        },
        
        // Search DO
        performSearch: function() {
            var query = this.searchDoNum.trim();
            if (!query) {
                alert("Masukkan Nomor DO terlebih dahulu!");
                return;
            }
            
            var found = this.trackingData[query];
            if (found) {
                this.activeTracking = Object.assign({ doKey: query }, found);
            } else {
                alert("Nomor DO '" + query + "' tidak ditemukan!");
            }
        },
        
        // Create new DO
        createNewDo: function() {
            var nextDo = this.nextDoNumber;
            
            Vue.set(this.trackingData, nextDo, {
                nim: this.newDoForm.nim,
                nama: this.newDoForm.nama,
                status: "Diproses",
                ekspedisi: this.newDoForm.ekspedisi,
                tanggalKirim: this.newDoForm.tanggalKirim,
                paket: this.newDoForm.paketCode,
                total: this.newDoForm.total,
                perjalanan: [
                    {
                        waktu: this.getFormattedTimestamp(),
                        keterangan: "Penerimaan di Loket: UT PUSAT. Pengirim: Universitas Terbuka"
                    }
                ]
            });
            
            // Save state
            this.saveToLocal();
            
            this.searchDoNum = nextDo;
            this.performSearch();
            
            this.resetDoForm();
            this.showAddDoForm = false;
            
            alert("Berhasil: Delivery Order baru berhasil dibuat dengan nomor: " + nextDo);
        },
        
        // Reset Do inputs
        resetDoForm: function() {
            this.newDoForm = {
                nim: "",
                nama: "",
                ekspedisi: "",
                paketCode: "",
                tanggalKirim: this.getLocalDateString(),
                total: 0
            };
        },
        
        addTimelineStep: function() {
            if (!this.newTimelineDesc.trim()) {
                alert("Silakan isi keterangan perjalanan terlebih dahulu!");
                return;
            }
            
            var doKey = this.activeTracking.doKey;
            var record = this.trackingData[doKey];
            
            if (record) {
                record.perjalanan.unshift({
                    waktu: this.getFormattedTimestamp(),
                    keterangan: this.newTimelineDesc.trim()
                });
                
                record.status = this.newTimelineStatus;
                
                this.saveToLocal();
                
                this.performSearch();
                
                this.newTimelineDesc = "";
                alert("Berhasil: Laporan status perjalanan berhasil ditambahkan.");
            }
        }
    }
});
