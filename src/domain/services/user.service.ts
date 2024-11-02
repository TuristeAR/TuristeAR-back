import axios from 'axios';

export class UserService {
    
    async getProvinceForCoordinates(latitude: number, longitude: number) {
        try {
            const response = await axios.get(
                `https://apis.datos.gob.ar/georef/api/ubicacion?lat=${latitude}&lon=${longitude}`
            );

            const province = response.data.ubicacion?.provincia?.nombre;

            if (province) {
                return province;
            } else {
                console.warn('Provincia no encontrada en los datos de ubicación');
                return null;
            }
        } catch (error) {
            console.error('Error fetching location data:', error);
            // throw error; // para manejar el error en otro lugar
        }
    }
}
