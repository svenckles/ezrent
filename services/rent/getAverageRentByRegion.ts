import { Region } from '../../enums';
import { Property } from '../../types';

export const getAverageRentByRegion = (allProperties: Property[], region: Region) => {
  const { totalRentPence, propertyCount } = allProperties.reduce((acc, prop) => {
    if (prop.region === region) {
      return {
        totalRentPence: acc.totalRentPence + Number(prop.monthlyRentPence),
        propertyCount: acc.propertyCount + 1,
      };
    }
    return acc;
  }, { totalRentPence: 0, propertyCount: 0 });

  const averageRentPounds = propertyCount > 0 ? totalRentPence / propertyCount / 100 : 0; 

  return averageRentPounds;
};