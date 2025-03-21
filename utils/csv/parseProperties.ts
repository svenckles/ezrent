import { parseCsv } from './parseCsv';
import { Property } from '../../types';

export const parseProperties = async (csvData: string) => {
  const properties = await parseCsv<Property>(
    csvData,
    ['id', 'address', 'postcode', 'region', 'capacity', 'tenancyEndDate', 'monthlyRentPence'],
    {
      capacity: (value: string) => Number(value),
      tenancyEndDate: (value: string) => new Date(value),
      monthlyRentPence: (value: string) => Number(value),
    }
  );

  return properties;
};
