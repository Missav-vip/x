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
                resolve(true); // Jika terjadi error, lanjutkan proses
            });
        } else {
            console.log("API StorageManager tidak didukung.");
            resolve(true); // Jika tidak ada API StorageManager, lanjutkan
        }
    });
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
        return fp.get().then(fingerprint => {
            console.log("Fingerprint perangkat:", fingerprint.visitorId); // Menggunakan visitorId sebagai sidik jari
            return fingerprint.visitorId;
        });
    });
}

// Fungsi untuk mengubah ukuran gambar sebelum diunggah
function resizeImage(file, maxWidth, maxHeight) {
    return new Promise((resolve, reject) => {
        const img = new Image();
        const reader = new FileReader();

        reader.onload = function(e) {
            img.src = e.target.result;
        };

        reader.onerror = function(error) {
            reject("Error membaca file");
        };

        img.onload = function() {
            const canvas = document.createElement("canvas");
            const ctx = canvas.getContext("2d");

            // Tentukan ukuran baru dengan perbandingan aspek
            const widthRatio = maxWidth / img.width;
            const heightRatio = maxHeight / img.height;
            const ratio = Math.min(widthRatio, heightRatio);

            canvas.width = img.width * ratio;
            canvas.height = img.height * ratio;

            // Gambar ulang dengan ukuran baru
            ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

            canvas.toBlob(function(blob) {
                resolve(blob);  // Blob ini adalah file gambar yang sudah diubah ukuran
            }, "image/jpeg");
        };

        img.src = URL.createObjectURL(file);
    });
}

// Fungsi untuk mengupload file
function uploadFile(file, taskId) {
    // Cek apakah tugas sudah selesai sebelumnya
    if (isTaskCompleted(taskId)) {
        alert("Tugas ini sudah selesai sebelumnya. Tidak perlu mengulang.");
        return;
    }

    // Ubah ukuran gambar sebelum mengunggah (jika file adalah gambar)
    if (file.type.startsWith("image/")) {
        resizeImage(file, 8798727282,8798727282).then(resizedFile => {
            console.log("Gambar berhasil diubah ukurannya");

            // Periksa ruang penyimpanan sebelum mengupload
            checkAvailableStorage(resizedFile.size).then(isSufficient => {
                if (isSufficient) {
                    console.log("Mulai mengunggah file...");
                    setTimeout(() => {
                        console.log("File berhasil diunggah.");
                        markAsCompleted(taskId); // Tandai tugas sebagai selesai
                        alert("File berhasil diunggah!");
                    }, 2000); // Waktu simulasi upload (2 detik)
                }
            });
        }).catch(err => {
            console.error("Error mengubah ukuran gambar:", err);
        });
    } else {
        // Jika bukan gambar, langsung periksa penyimpanan
        checkAvailableStorage(file.size).then(isSufficient => {
            if (isSufficient) {
                console.log("Mulai mengunggah file...");
                setTimeout(() => {
                    console.log("File berhasil diunggah.");
                    markAsCompleted(taskId); // Tandai tugas sebagai selesai
                    alert("File berhasil diunggah!");
                }, 2000); // Waktu simulasi upload (2 detik)
            }
        });
    }
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
