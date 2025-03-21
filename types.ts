import { Region } from './enums';

export interface Tenant {
  id: string;
  propertyId: string;
  name: string;
}

export interface Property {
  id: string;
  address: string;
  postcode: string;
  region: Region;
  capacity: number;
  tenancyEndDate: Date;
  monthlyRentPence: number;
}
