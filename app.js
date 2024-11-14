// Fungsi untuk memeriksa ruang penyimpanan yang tersedia
function checkAvailableStorage(fileSize) {
    return new Promise((resolve, reject) => {
        if (navigator.storage && navigator.storage.estimate) {
            navigator.storage.estimate().then(({ quota, usage }) => {
                const availableSpace = quota - usage;
                console.log(`Ruang penyimpanan yang tersedia: ${availableSpace} bytes`);

                // Cek apakah ruang penyimpanan cukup untuk file
                if (availableSpace < fileSize) {
                    alert("Tidak cukup ruang untuk mengunggah file.");
                    resolve(false);
                } else {
                    resolve(true);
                }
            }).catch((error) => {
                console.error("Kesalahan saat memeriksa ruang penyimpanan:", error);
                resolve(true); // Jika ada kesalahan, lanjutkan proses
            });
        } else {
            console.log("API StorageManager tidak didukung.");
            resolve(true); // Jika API StorageManager tidak didukung, lanjutkan
        }
    });
}

// Fungsi untuk mendapatkan sidik jari perangkat menggunakan FingerprintJS
function getDeviceFingerprint() {
    return FingerprintJS.load().then(fp => {
        return fp.get().then(fingerprint => {
            console.log("Fingerprint perangkat:", fingerprint.visitorId); // Menggunakan visitorId sebagai sidik jari
            return fingerprint.visitorId;
        });
    });
}

// Fungsi untuk mendapatkan deteksi perangkat (user-agent)
function getDeviceDetails() {
    const userAgent = navigator.userAgent;
    console.log(`User-Agent: ${userAgent}`);
    return userAgent;
}

// Fungsi untuk mendeteksi jenis browser
function getBrowserInfo() {
    const browser = navigator.userAgent.toLowerCase();
    if (browser.includes("chrome")) {
        console.log("Browser: Chrome");
        return "Chrome";
    } else if (browser.includes("firefox")) {
        console.log("Browser: Firefox");
        return "Firefox";
    } else if (browser.includes("safari")) {
        console.log("Browser: Safari");
        return "Safari";
    } else {
        console.log("Browser tidak terdeteksi.");
        return "Unknown";
    }
}

// Fungsi untuk memeriksa apakah perangkat mendukung WebGL
function checkWebGLSupport() {
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    const isSupported = !!gl;
    console.log(`WebGL supported: ${isSupported}`);
    return isSupported;
}

// Fungsi untuk memeriksa apakah perangkat mendukung service workers
function checkServiceWorkerSupport() {
    const isSupported = 'serviceWorker' in navigator;
    console.log(`Service Worker supported: ${isSupported}`);
    return isSupported;
}

// Fungsi untuk memeriksa jenis input perangkat (Touch/Mouse)
function checkInputType() {
    const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    console.log(`Perangkat Touch: ${isTouchDevice}`);
    return isTouchDevice ? 'Touch' : 'Mouse';
}

// Fungsi untuk memeriksa kapasitas memori perangkat
function checkDeviceMemory() {
    if (navigator.deviceMemory) {
        console.log(`Kapasitas memori perangkat: ${navigator.deviceMemory} GB`);
        return navigator.deviceMemory;
    } else {
        console.log("Fitur kapasitas memori tidak didukung.");
        return null;
    }
}

// Fungsi untuk mendapatkan informasi lokasi perangkat
function getDeviceLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(position => {
            console.log(`Lokasi perangkat: Latitude ${position.coords.latitude}, Longitude ${position.coords.longitude}`);
        }, error => {
            console.error("Gagal mendapatkan lokasi perangkat:", error);
        });
    } else {
        console.log("Lokasi perangkat tidak didukung.");
    }
}

// Fungsi untuk memeriksa jaringan perangkat
function checkNetworkConnection() {
    const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
    if (connection) {
        console.log(`Kecepatan jaringan: ${connection.downlink} Mbps`);
    } else {
        console.log("Informasi koneksi jaringan tidak tersedia.");
    }
}

// Fungsi untuk memeriksa apakah perangkat mendukung IndexedDB
function checkIndexedDBSupport() {
    const isSupported = 'indexedDB' in window;
    console.log(`IndexedDB supported: ${isSupported}`);
    return isSupported;
}

// Fungsi utama untuk mengunggah file
function uploadFile(file, taskId) {
    // Cek apakah tugas sudah selesai sebelumnya
    if (localStorage.getItem(taskId) === 'completed') {
        alert("Tugas ini sudah selesai sebelumnya. Tidak perlu mengulang.");
        return;
    }

    // Periksa ruang penyimpanan sebelum mengupload
    checkAvailableStorage(file.size).then(isSufficient => {
        if (isSufficient) {
            console.log("Mulai mengunggah file...");
            setTimeout(() => {
                console.log("File berhasil diunggah.");
                localStorage.setItem(taskId, 'completed'); // Tandai tugas sebagai selesai
                alert("File berhasil diunggah!");
            }, 2000); // Waktu simulasi upload (2 detik)
        }
    });
}

// Fungsi utama untuk menangani file upload
function handleFileUpload() {
    const fileInput = document.getElementById('fileInput');
    const file = fileInput.files[0];

    if (!file) {
        alert("Harap pilih file terlebih dahulu.");
        return;
    }

    // Dapatkan taskId yang unik untuk tugas ini (misalnya, ID file)
    const taskId = file.name;

    // Mendapatkan fingerprint perangkat
    getDeviceFingerprint().then(fingerprint => {
        console.log("Fingerprint perangkat:", fingerprint);

        // Mendapatkan informasi perangkat
        getDeviceDetails();

        // Mendapatkan informasi browser
        getBrowserInfo();

        // Memeriksa WebGL
        checkWebGLSupport();

        // Memeriksa Service Worker
        checkServiceWorkerSupport();

        // Memeriksa jenis input perangkat
        checkInputType();

        // Memeriksa kapasitas memori perangkat
        checkDeviceMemory();

        // Mendapatkan lokasi perangkat
        getDeviceLocation();

        // Memeriksa koneksi jaringan
        checkNetworkConnection();

        // Memeriksa IndexedDB
        checkIndexedDBSupport();

        // Upload file setelah memastikan bahwa tugas belum selesai dan ruang cukup
        uploadFile(file, taskId);
    });
}
