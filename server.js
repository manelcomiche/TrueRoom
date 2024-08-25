require('dotenv').config();
const express = require('express');
const axios = require('axios');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/index.html'));
});

app.get('/hotels', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/hotels.html'));
});

app.get('/hotels/:hotelId', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/hotelDetails.html'));
});

app.get('/getDestinationId', async (req, res) => {
    const { city } = req.query;
    try {
        const response = await axios.get('https://booking-com.p.rapidapi.com/v1/hotels/locations', {
            params: { locale: 'es', name: city },
            headers: {
                'x-rapidapi-host': 'booking-com.p.rapidapi.com',
                'x-rapidapi-key': process.env.RAPIDAPI_KEY,
            },
        });
        res.json(response.data);
    } catch (error) {
        res.status(500).send('Error fetching destination ID');
    }
});

app.get('/searchHotels', async (req, res) => {
    const { checkin_date, checkout_date, dest_id, adults_number, children_number, children_ages, room_number } = req.query;
    try {
        const response = await axios.get('https://booking-com.p.rapidapi.com/v1/hotels/search', {
            params: {
                checkin_date, checkout_date, dest_id, dest_type: 'city', locale: 'es',
                adults_number, children_number, children_ages, room_number,
                units: 'metric', order_by: 'popularity', filter_by_currency: 'AED',
                page_number: 0, include_adjacency: true, categories_filter_ids: 'class::2,class::4,free_cancellation::1',
            },
            headers: {
                'x-rapidapi-host': 'booking-com.p.rapidapi.com',
                'x-rapidapi-key': process.env.RAPIDAPI_KEY,
            },
        });
        res.json(response.data);
    } catch (error) {
        res.status(500).send('Error fetching hotels');
    }
});

app.get('/hotelDetails', async (req, res) => {
    const { hotel_id } = req.query;
    try {
        const response = await axios.get('https://booking-com.p.rapidapi.com/v1/hotels/data', {
            params: { hotel_id, locale: 'es' },
            headers: {
                'x-rapidapi-host': 'booking-com.p.rapidapi.com',
                'x-rapidapi-key': process.env.RAPIDAPI_KEY,
            },
        });
        res.json(response.data);
    } catch (error) {
        res.status(500).send('Error fetching hotel details');
    }
});

// Nueva ruta para obtener las fotos del hotel
app.get('/hotelPhotos', async (req, res) => {
    const { hotel_id } = req.query;
    try {
        const response = await axios.get('https://booking-com.p.rapidapi.com/v1/hotels/photos', {
            params: { hotel_id, locale: 'es' },
            headers: {
                'x-rapidapi-host': 'booking-com.p.rapidapi.com',
                'x-rapidapi-key': process.env.RAPIDAPI_KEY,
            },
        });
        res.json(response.data);
    } catch (error) {
        res.status(500).send('Error fetching hotel photos');
    }
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});