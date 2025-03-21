import { parseCsv } from './parseCsv';
import { Tenant } from '../../types';

export const parseTenants = async (csvData: string) => {
  const tenants = await parseCsv<Tenant>(csvData, ['id', 'propertyId', 'name']);

  return tenants;
};
