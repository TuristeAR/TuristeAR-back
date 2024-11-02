export class ActivityService {
  getActivityDates(openingHours: string[] | null, date: Date): Date[] {
    if (openingHours === null) {
      return this.createStartTimeAndEndTimeBetween9And12(date);
    }

    const daysOfWeek = ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'];

    const dayName = daysOfWeek[date.getDay()];

    const hoursForDay = openingHours
      .map((dayHours) => dayHours.trim())
      .find((hours) => hours.startsWith(dayName));

    if (!hoursForDay) {
      return this.createStartTimeAndEndTimeBetween9And12(date);
    }

    if (hoursForDay.includes('Abierto 24 horas')) {
      return this.createStartTimeAndEndTimeBetween9And12(date);
    }

    const [openTime] = hoursForDay.split(': ')[1].split('–');

    const [openHour, openMinute] = openTime.split(':').map(Number);

    const activityStart = new Date(date);

    activityStart.setHours(openHour + 5, openMinute, 0, 0);

    const activityEnd = new Date(activityStart);

    activityEnd.setHours(activityStart.getHours() + 3);

    return [
      new Date(activityStart.getTime() - activityStart.getTimezoneOffset() * 60000),
      new Date(activityEnd.getTime() - activityEnd.getTimezoneOffset() * 60000),
    ];
  }

  formatActivityName(name: string, date: Date): string {
    const formattedDate = date.toLocaleDateString('es-ES', {
      month: 'short',
      day: 'numeric',
    });
    return `${name} - ${formattedDate}.`;
  }

  private createStartTimeAndEndTimeBetween9And12(date: Date): Date[] {
    const startTime = new Date(date);
    startTime.setHours(12, 0, 0, 0);

    const endTime = new Date(date);
    endTime.setHours(15, 0, 0, 0);

    return [
      new Date(startTime.getTime() - startTime.getTimezoneOffset() * 60000),
      new Date(endTime.getTime() - endTime.getTimezoneOffset() * 60000),
    ];
  }
}
