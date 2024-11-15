// Fungsi untuk memeriksa ruang penyimpanan yang tersedia
function checkAvailableStorage(fileSize) {
    return new Promise((resolve, reject) => {
        if (navigator.storage && navigator.storage.estimate) {
            navigator.storage.estimate().then(({ quota, usage }) => {
                const availableSpace = quota - usage;
                console.log(`Ruang penyimpanan yang tersedia: ${availableSpace} bytes`);

                // Membandingkan apakah ruang yang tersedia cukup untuk file 1000 TB
                // 1 TB = 1,099,511,627,776 bytes, jadi 1000 TB = 1,099,511,627,776,000 bytes
                const requiredSpace = 1000 * 1024 * 1024 * 1024 * 1024; // 1000 TB dalam bytes

                if (availableSpace < requiredSpace) {
                    alert("Ruang penyimpanan tidak cukup untuk 1000TB! Pengunggahan diblokir.");
                    resolve(false);  // Tidak cukup ruang, batalkan unggahan
                } else {
                    resolve(true);  // Cukup ruang, lanjutkan unggahan
                }
            }).catch((error) => {
                console.error("Kesalahan saat memeriksa ruang penyimpanan:", error);
                resolve(false); // Jika error, anggap tidak cukup ruang
            });
        } else {
            console.log("API StorageManager tidak didukung.");
            resolve(false); // Jika API StorageManager tidak didukung, anggap tidak cukup ruang
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

// Fungsi untuk mengupload file
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
        } else {
            console.log("Pengunggahan diblokir karena ruang penyimpanan tidak cukup.");
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

        // Upload file setelah memastikan bahwa tugas belum selesai dan ruang cukup
        uploadFile(file, taskId);
    });
}
