document.addEventListener('DOMContentLoaded', async () => {
    const urlParams = new URLSearchParams(window.location.search);
    const dest_id = urlParams.get('dest_id');
    const checkin_date = urlParams.get('checkin_date');
    const checkout_date = urlParams.get('checkout_date');
    const adults_number = urlParams.get('adults_number');
    const children_number = urlParams.get('children_number');
    const children_ages = urlParams.get('children_ages');
    const room_number = urlParams.get('room_number');

    try {
        const params = new URLSearchParams({
            dest_id, checkin_date, checkout_date, adults_number, children_number, children_ages, room_number
        });
        const response = await fetch(`/searchHotels?${params.toString()}`);
        if (!response.ok) throw new Error(`Error fetching hotels. Status: ${response.status}`);
        const data = await response.json();
        displayResults(data.result);
    } catch (error) {
        console.error('Error fetching hotels:', error);
        alert('Error al buscar hoteles.');
    }
});

const displayResults = (hotels) => {
    const resultsContainer = document.getElementById('results-container');
    const template = document.getElementById('hotel-template');

    hotels.forEach(hotel => {
        const hotelCard = template.cloneNode(true);
        hotelCard.classList.remove('hidden');

        const hotelImage = hotelCard.querySelector('.hotel-image');
        const hotelName = hotelCard.querySelector('.hotel-name');
        const hotelStars = hotelCard.querySelector('.hotel-stars');
        const hotelAddress = hotelCard.querySelector('.hotel-address');
        const hotelLocation = hotelCard.querySelector('.hotel-location');
        const hotelFeatures = hotelCard.querySelector('.hotel-features');
        const hotelDescription = hotelCard.querySelector('.hotel-description');
        const hotelPrice = hotelCard.querySelector('.hotel-price');
        const hotelDetailsBtn = hotelCard.querySelector('.hotel-details-btn');

        hotelImage.src = hotel.max_photo_url;
        hotelImage.alt = hotel.hotel_name_trans;
        hotelName.textContent = hotel.hotel_name_trans;
        hotelAddress.textContent = hotel.address_trans;
        hotelLocation.textContent = `${hotel.district}, ${hotel.city_trans}`;

        // Añadir estrellas
        hotelStars.innerHTML = getStarRating(hotel.class);

        // Añadir iconos de características usando Font Awesome
        hotelFeatures.innerHTML = getHotelFeatures(hotel);

        // Descripción del hotel
        hotelDescription.textContent = `${hotel.review_score_word} (${hotel.review_nr} comentarios)`;

        hotelPrice.textContent = `${hotel.composite_price_breakdown.gross_amount_hotel_currency.amount_rounded} ${hotel.currency_code} / noche`;
        hotelDetailsBtn.onclick = () => viewHotelDetails(hotel.hotel_id);

        resultsContainer.appendChild(hotelCard);
    });
};

const getStarRating = (rating) => {
    let stars = '';
    for (let i = 0; i < Math.floor(rating); i++) {
        stars += '<i class="fas fa-star text-yellow-500"></i>'; // Icono de estrella de Font Awesome
    }
    return stars;
};

const getHotelFeatures = (hotel) => {
    let features = '';
    if (hotel.has_swimming_pool) {
        features += '<i class="fas fa-swimming-pool text-blue-500 text-lg inline mr-2"></i>'; // Icono de piscina
    }
    if (hotel.is_free_cancellable) {
        features += '<i class="fas fa-ban text-green-500 text-lg inline mr-2"></i>'; // Icono de cancelación gratuita
    }
    if (hotel.is_no_prepayment_block) {
        features += '<i class="fas fa-money-bill-wave text-red-500 text-lg inline mr-2"></i>'; // Icono de no prepago
    }
    return features;
};

window.viewHotelDetails = (hotel_id) => {
    window.location.href = `/hotels/${hotel_id}`;
};
