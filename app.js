// Fungsi untuk memeriksa ruang penyimpanan yang tersedia
function checkAvailableStorage(fileSize) {
    if (navigator.storage && navigator.storage.estimate) {
        navigator.storage.estimate().then(({ quota, usage }) => {
            const availableSpace = quota - usage;
            console.log(`Ruang penyimpanan yang tersedia: ${availableSpace} bytes`);

            // Cek apakah ruang penyimpanan cukup untuk file
            if (availableSpace < fileSize) {
                alert("Tidak cukup ruang untuk mengunggah file.");
                return false;
            }
            return true;
        }).catch((error) => {
            console.error("Kesalahan saat memeriksa ruang penyimpanan:", error);
        });
    } else {
        console.log("API StorageManager tidak didukung.");
        return true; // Jika tidak ada API StorageManager, lanjutkan.
    }
}

// Fungsi untuk memeriksa apakah tugas sudah selesai di localStorage
function isTaskCompleted(taskId) {
    return localStorage.getItem(taskId) === 'completed';
}

// Fungsi untuk menandai tugas sebagai selesai di localStorage
function markAsCompleted(taskId) {
    localStorage.setItem(taskId, 'completed');
}

// Fungsi untuk mendapatkan sidik jari perangkat menggunakan FingerprintJS
function getDeviceFingerprint() {
    return FingerprintJS.load().then(fp => {
        const fingerprint = fp.get();
        console.log("Fingerprint perangkat:", fingerprint);
        return fingerprint;
    });
}

// Fungsi untuk mengupload file
function uploadFile(file, taskId) {
    // Cek apakah tugas sudah selesai sebelumnya
    if (isTaskCompleted(taskId)) {
        alert("Tugas ini sudah selesai sebelumnya. Tidak perlu mengulang.");
        return;
    }

    // Periksa ruang penyimpanan sebelum mengupload
    checkAvailableStorage(file.size).then(isSufficient => {
        if (isSufficient) {
            console.log("Mulai mengunggah file...");
            // Simulasi proses upload file
            setTimeout(() => {
                console.log("File berhasil diunggah.");
                markAsCompleted(taskId); // Tandai tugas sebagai selesai
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

        // Upload file setelah memastikan bahwa tugas belum selesai dan ruang cukup
        uploadFile(file, taskId);
    });
}
