document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('search-form');
    form.addEventListener('submit', async (event) => {
        event.preventDefault();
        const city = document.getElementById('city').value.trim();
        const checkin_date = document.getElementById('checkin_date').value;
        const checkout_date = document.getElementById('checkout_date').value;
        const adults_number = document.getElementById('adults_number').value || 2;
        const children_number = document.getElementById('children_number').value || 0;
        const children_ages = document.getElementById('children_ages').value.split(',').map(age => age.trim()).join(',') || '';
        const room_number = document.getElementById('room_number').value || 1;

        if (!city) {
            alert('Por favor, ingrese una ciudad.');
            return;
        }

        try {
            const dest_id = await fetchDestinationId(city);
            if (!dest_id) {
                alert('No se encontró el destino especificado.');
                return;
            }

            const queryParams = new URLSearchParams({ dest_id, checkin_date, checkout_date, adults_number, children_number, children_ages, room_number });
            window.location.href = `/hotels?${queryParams.toString()}`;
        } catch (error) {
            console.error('Error:', error);
            alert('Hubo un error al buscar hoteles. Por favor, intenta de nuevo.');
        }
    });

    const fetchDestinationId = async (city) => {
        try {
            const response = await fetch(`/getDestinationId?city=${encodeURIComponent(city)}`);
            if (!response.ok) throw new Error(`Error fetching destination ID. Status: ${response.status}`);
            const data = await response.json();
            return data.length > 0 ? data[0].dest_id : null;
        } catch (error) {
            console.error('Error fetching destination ID:', error);
            alert('Error al obtener el ID del destino.');
            return null;
        }
    };
});