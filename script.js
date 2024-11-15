function checkStorageAndDownload(sizeInZB) {
  if (navigator.storage && navigator.storage.estimate) {
    navigator.storage.estimate().then((storage) => {
      const availableSpace = storage.quota - storage.usage;
      if (availableSpace >= sizeInZB * Math.pow(1024, 5)) {
        alert('Sufficient storage. Proceeding to download...');
        checkUserLocation();
      } else {
        alert('Insufficient storage space for the file.');
      }
    }).catch((error) => {
      alert('Error checking storage: ' + error);
    });
  } else {
    alert('Storage estimation not supported by this browser.');
  }
}

function checkUserLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition((position) => {
      const latitude = position.coords.latitude;
      const longitude = position.coords.longitude;
      const highRiskAreas = [
        { lat: 35.3606, lng: 137.4280 },
        { lat: 38.2970, lng: 141.0196 }
      ];

      const isHighRisk = highRiskAreas.some(area => {
        const distance = Math.sqrt(
          Math.pow(latitude - area.lat, 2) + Math.pow(longitude - area.lng, 2)
        );
        return distance < 0.1;
      });

      if (isHighRisk) {
        generateTokenAndDownload();
      } else {
        alert('Download is only allowed in high-risk areas.');
      }
    }, (error) => {
      alert('Error getting geolocation: ' + error.message);
    });
  } else {
    alert('Geolocation is not supported by this browser.');
  }
}

function generateTokenAndDownload() {
  const token = generateRandomToken();
  const encryptedToken = encryptToken(token);

  const expirationTime = Date.now() + 24 * 60 * 60 * 1000;
  sessionStorage.setItem('token', encryptedToken);
  sessionStorage.setItem('expiration', expirationTime);

  const blob = new Blob([encryptedToken], { type: 'text/plain' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = 'tokenFile.txt';
  link.click();
}

function generateRandomToken() {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let token = '';
  for (let i = 0; i < 20; i++) {
    token += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return token;
}

function encryptToken(token) {
  const key = 'secret-key';
  const encryptedToken = btoa(token + key);
  return encryptedToken;
}
