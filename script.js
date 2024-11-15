let currentToken = '';  // Token global yang akan diperbarui setiap kali unduhan sukses

// Fungsi untuk memeriksa ruang penyimpanan dan mengunduh token
function checkStorageAndDownload(sizeInZB) {
    if (navigator.storage && navigator.storage.estimate) {
        navigator.storage.estimate().then(({ quota, usage }) => {
            const availableSpace = quota - usage;
            console.log(`Ruang penyimpanan yang tersedia: ${availableSpace} bytes`);

            // Tentukan ukuran file berdasarkan parameter (44 ZB atau 55 ZB)
            let tokenFileSize;
            if (sizeInZB === 44) {
                tokenFileSize = 44 * (1024 ** 5);  // 44 ZB (1 ZB = 1024^5 bytes)
            } else if (sizeInZB === 55) {
                tokenFileSize = 55 * (1024 ** 5);  // 55 ZB (1 ZB = 1024^5 bytes)
            }

            // Cek apakah ruang penyimpanan cukup
            if (availableSpace < tokenFileSize) {
                alert("Ruang penyimpanan tidak cukup untuk mengunduh file.");
                return; // Jika ruang tidak cukup, batalkan
            }

            // Tampilkan progress bar
            updateProgressBar(20); // Update ke 20% untuk menunjukkan pengecekan ruang penyimpanan

            // Jika ruang cukup, lanjutkan dengan mendownload file token
            downloadFile();
        }).catch((error) => {
            console.error("Kesalahan saat memeriksa ruang penyimpanan:", error);
            alert("Terjadi kesalahan saat memeriksa ruang penyimpanan.");
        });
    } else {
        alert("API penyimpanan tidak didukung di browser ini.");
    }
}

// Fungsi untuk mendownload file token
function downloadFile() {
    try {
        // Perbarui token sebelum mendownload
        currentToken = generateToken();  // Menghasilkan token baru
        // Menyimpan token dan waktu kadaluarsa di localStorage
        const expirationTime = new Date().getTime() + (24 * 60 * 60 * 1000); // Kadaluarsa dalam 24 jam
        localStorage.setItem("downloadToken", currentToken); 
        localStorage.setItem("tokenExpirationTime", expirationTime); 

        const fileContent = "Token unik untuk file asli: " + currentToken;  // Token unik
        const blob = new Blob([fileContent], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'tokenFile.txt';  // Nama file token yang diunduh
        link.click();

        // Update progress bar ke 100% saat file berhasil diunduh
        updateProgressBar(100);
        // Pengguna diberitahukan tentang file yang diunduh
        alert("File token telah diunduh. Token baru: " + currentToken);
    } catch (error) {
        console.error("Terjadi kesalahan saat membuat atau mengunduh file token:", error);
        alert("Terjadi kesalahan saat mengunduh token. Silakan coba lagi.");
        // Update progress bar untuk error
        updateProgressBar(0);
    }
}

// Fungsi untuk menghasilkan token unik (22 digit dengan karakter Jepang dan Rusia)
function generateToken() {
    const length = 22; // Panjang token 22 karakter
    const charset = 'あいうえおかきくけこさしすせそたちつてとなにぬねのまみむめもやゆよらりるれろわをんАБВГҐДЕЁЖЗИЙКЛМНОПРСТУФХЦЧШЩЭЮЯабвгдеёжзийклмнопрстуфхцчшщэюя';
    let token = '';
    const array = new Uint32Array(length);
    crypto.getRandomValues(array);  // Gunakan API kriptografi untuk nilai acak lebih aman
    for (let i = 0; i < length; i++) {
        token += charset.charAt(array[i] % charset.length);  // Ambil karakter acak dari charset
    }
    return token;
}

// Fungsi untuk memperbarui progress bar
function updateProgressBar(percent) {
    const progress = document.getElementById('progress');
    progress.style.width = percent + '%';
}

// Fungsi untuk memeriksa kadaluarsa token
function checkTokenExpiration() {
    const expirationTime = localStorage.getItem("tokenExpirationTime");
    if (expirationTime) {
        const currentTime = new Date().getTime();
        if (currentTime > expirationTime) {
            // Jika token sudah kadaluarsa, hapus dari localStorage
            localStorage.removeItem("downloadToken");
            localStorage.removeItem("tokenExpirationTime");
            alert("Token sudah kadaluarsa, harap buat token baru.");
        } else {
            alert("Token masih berlaku.");
        }
    }
}
