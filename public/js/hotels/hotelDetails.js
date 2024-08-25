document.addEventListener('DOMContentLoaded', async () => {
    const hotelId = window.location.pathname.split('/').pop(); // Obtener el ID del hotel desde la URL

    try {
        const response = await fetch(`/hotelDetails?hotel_id=${hotelId}`);
        if (!response.ok) throw new Error(`Error fetching hotel details. Status: ${response.status}`);
        const hotelData = await response.json();

        displayHotelDetails(hotelData);
        await loadHotelPhotos(hotelId);  // Nueva función para cargar fotos
        await loadTikTokVideos(hotelData.name); // Nueva función para cargar videos de TikTok
    } catch (error) {
        console.error('Error fetching hotel details:', error);
        alert('Error al cargar los detalles del hotel.');
    }
});

const loadHotelPhotos = async (hotelId) => {
    try {
        const response = await fetch(`/hotelPhotos?hotel_id=${hotelId}`);
        if (!response.ok) throw new Error(`Error fetching hotel photos. Status: ${response.status}`);
        const photos = await response.json();

        displayHotelPhotos(photos);
    } catch (error) {
        console.error('Error fetching hotel photos:', error);
    }
};

const loadTikTokVideos = async (hotelName) => {
    try {
        const response = await fetch(`https://tiktok-scraper7.p.rapidapi.com/feed/search?keywords=${encodeURIComponent(hotelName)}&region=es&count=5&cursor=0&publish_time=0&sort_type=0`, {
            headers: {
                'x-rapidapi-host': 'tiktok-scraper7.p.rapidapi.com',
                'x-rapidapi-key': '53f87ff1a8msh198565a5f72261fp1bd0dejsn1f74ecad458f'
            }
        });
        if (!response.ok) throw new Error(`Error fetching TikTok videos. Status: ${response.status}`);
        const { data } = await response.json();
        displayTikTokVideos(data.videos);
    } catch (error) {
        console.error('Error fetching TikTok videos:', error);
    }
};

const displayTikTokVideos = (videos) => {
    const videoContainer = document.getElementById('video-container');
    videos.forEach(video => {
        const videoPlaceholder = document.createElement('div');
        videoPlaceholder.className = 'video-placeholder';
        videoPlaceholder.style.backgroundImage = `url(${video.cover})`;
        videoPlaceholder.onclick = () => openVideoModal(video.play);

        videoContainer.appendChild(videoPlaceholder);
    });
};

const openVideoModal = (videoUrl) => {
    const modal = document.getElementById("videoModal");
    const videoElement = document.getElementById("modalVideo");
    const videoSource = document.getElementById("videoSource");

    videoSource.src = videoUrl; // Configura la fuente del video
    videoElement.load(); // Cargar el video solo cuando se abre el modal
    modal.style.display = "flex"; // Mostrar el modal solo al hacer clic en un video
};

window.onclick = function (event) {
    const modal = document.getElementById("videoModal");
    const videoElement = document.getElementById("modalVideo");
    if (event.target == modal) {
        modal.style.display = "none";
        videoElement.pause(); // Pausar el video cuando se cierra el modal
        videoElement.currentTime = 0; // Reiniciar el video al cerrar
    }
};

document.querySelector(".close").onclick = function () {
    const modal = document.getElementById("videoModal");
    const videoElement = document.getElementById("modalVideo");
    modal.style.display = "none";
    videoElement.pause(); // Pausar el video cuando se cierra el modal
    videoElement.currentTime = 0; // Reiniciar el video al cerrar
};

const displayHotelDetails = (hotel) => {
    // Nombre del hotel y estrellas
    document.getElementById('hotel-name').textContent = hotel.name;
    document.getElementById('hotel-stars').innerHTML = getStarRating(hotel.class);

    // Dirección y ciudad
    document.getElementById('hotel-address').textContent = hotel.address;
    document.getElementById('hotel-zip-city').textContent = `${hotel.zip}, ${hotel.city}`;

    // Reseña y puntuación
    document.getElementById('hotel-review').textContent = hotel.review_score_word;
    document.getElementById('hotel-review-score').textContent = `${hotel.review_score} / 10 (${hotel.review_nr} comentarios)`;

    // Descripción del hotel
    const description = hotel.description_translations.find(desc => desc.languagecode === 'es')?.description || '';
    document.getElementById('hotel-description').textContent = description;

    // Instalaciones del hotel
    document.getElementById('hotel-facilities').innerHTML = getHotelFacilities(hotel.hotel_facilities);

    // Idiomas hablados con emojis
    document.getElementById('hotel-languages').innerHTML = getLanguageEmojis(hotel.languages_spoken.languagecode);

    // Check-in y Check-out
    document.getElementById('hotel-checkin').textContent = `Check-in: Desde las ${hotel.checkin.from}`;
    document.getElementById('hotel-checkout').textContent = `Check-out: Hasta las ${hotel.checkout.to}`;

    // URL del hotel en Booking.com
    document.getElementById('hotel-url').href = hotel.url;

    // Mostrar mapa
    initMap(hotel.location.latitude, hotel.location.longitude);
};

const getLanguageEmojis = (languages) => {
    const languageEmojiMap = {
        'en': '🇬🇧',  // Bandera del Reino Unido para el inglés
        'es': '🇪🇸',  // Bandera de España para el español
        'fr': '🇫🇷',  // Bandera de Francia para el francés
        'de': '🇩🇪',  // Bandera de Alemania para el alemán
        'it': '🇮🇹',  // Bandera de Italia para el italiano
        // Agrega más idiomas y sus banderas según sea necesario
    };

    return languages.map(lang => {
        const languageCode = lang.slice(0, 2); // Extraer solo los primeros dos caracteres del código del idioma
        return languageEmojiMap[languageCode] || languageCode.toUpperCase();
    }).join(' ');
};

const getStarRating = (rating) => {
    let stars = '';
    for (let i = 0; i < Math.floor(rating); i++) {
        stars += '<i class="fas fa-star text-yellow-500"></i>';
    }
    return stars;
};

const getHotelFacilities = (facilities) => {
    const facilityIcons = {
        '2': 'fa-wifi', '3': 'fa-parking', '6': 'fa-utensils', '7': 'fa-coffee',
        '11': 'fa-paw', '15': 'fa-tv', '16': 'fa-swimming-pool', '20': 'fa-dumbbell',
        '22': 'fa-spa', '23': 'fa-wheelchair', '25': 'fa-wine-glass-alt'
    };
    return facilities.split(',').map(facility => {
        const icon = facilityIcons[facility.trim()];
        return icon ? `<i class="fas ${icon} text-lg text-blue-500 mr-2"></i>` : '';
    }).join('');
};

const displayHotelPhotos = (photos) => {
    const swiperWrapper = document.querySelector('.swiper-wrapper');
    photos.forEach(photo => {
        const slide = document.createElement('div');
        slide.className = 'swiper-slide';
        slide.innerHTML = `<img src="${photo.url_max}" alt="Hotel Photo" class="w-full h-64 object-cover rounded-md">`;
        swiperWrapper.appendChild(slide);
    });

    // Inicializar Swiper
    new Swiper('.swiper', {
        loop: true,
        pagination: {
            el: '.swiper-pagination',
            clickable: true,
        },
        navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev',
        },
    });
};

const initMap = (lat, lng) => {
    const map = L.map('map').setView([lat, lng], 14);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19
    }).addTo(map);
    L.marker([lat, lng]).addTo(map).bindPopup('Ubicación del hotel').openPopup();
};