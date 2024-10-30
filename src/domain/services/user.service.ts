import axios from 'axios';
import { env } from "process";

export class UserService {
    
    async getProvinceForCoordinates(latitude: number, longitude: number) {
        const apiKey = env.GOOGLE_API_KEY;

        try {
            const response = await axios.get(
                `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${apiKey}`
            );

            const addressComponents = response.data.results[0]?.address_components;

            if (addressComponents) {
                // obtener localidad
                //const locality = addressComponents.find(component => component.types.includes('locality')); 
                //obtener provincia
                const administrativeArea = addressComponents.find((component: any) => component.types.includes('administrative_area_level_1'));
                
                const province = administrativeArea.long_name;
                
                return province;
            }

            throw new Error('No address components found');
        } catch (error) {
            console.error('Error fetching location data:', error);
            // throw error; // para manejar el error en otro lugar
        }
    }
}
