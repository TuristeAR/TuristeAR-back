import { Request, Response, NextFunction } from 'express';
import status from 'http-status';
import { UserService } from '../../domain/services/user.service';


const userService = new UserService();

export const ubicationMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  const { latitude, longitude } = req.body;
  
  // Obtiene la provincia según las coordenadas
  const province = await userService.getProvinceForCoordinates(latitude, longitude);

  if (province) {
    // Almacena temporalmente la provincia en el objeto req
    req.body.province = province; // Guarda la provincia en el body

    return next(); // Continúa al siguiente middleware o ruta
  }

  // Si no se proporciona provincia, puedes manejarlo como desees
  return res.status(status.BAD_REQUEST).json({
    statusCode: status.BAD_REQUEST,
    message: 'Province could not be obtained',
  });
};