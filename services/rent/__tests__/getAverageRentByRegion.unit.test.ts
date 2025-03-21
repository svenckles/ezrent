import { Region } from '../../../enums';
import { Property } from '../../../types';
import { getAverageRentByRegion } from '../getAverageRentByRegion';

describe('calculateAverageRent', () => {
  it('should calculate the average rent for a given region', () => {
    const properties: Property[] = [
      { id: '1', address: '1 Main St', postcode: 'LS1 1AA', region: Region.England, capacity: 2, tenancyEndDate: new Date('2024-12-31'), monthlyRentPence: 120000 },
      { id: '2', address: '2 Oak St', postcode: 'LS2 2BB', region: Region.England, capacity: 3, tenancyEndDate: new Date('2025-01-31'), monthlyRentPence: 150000 },
      { id: '3', address: '1 Main St', postcode: 'CF10 1AA', region: Region.Wales, capacity: 2, tenancyEndDate: new Date('2024-12-31'), monthlyRentPence: 100000 },
    ];
    const expectedAverageRent = (120000 + 150000) / 2 / 100; // Calculate expected value
    const actualAverageRent = getAverageRentByRegion(properties, Region.England);
    expect(actualAverageRent).toBe(expectedAverageRent);
  });

  it('should return 0 if there are no properties in the given region', () => {
    const properties: Property[] = [
      { id: '1', address: '1 Main St', postcode: 'LS1 1AA', region: Region.England, capacity: 2, tenancyEndDate: new Date('2024-12-31'), monthlyRentPence: 120000 },
      { id: '2', address: '2 Oak St', postcode: 'LS2 2BB', region: Region.England, capacity: 3, tenancyEndDate: new Date('2025-01-31'), monthlyRentPence: 150000 },
      { id: '3', address: '1 Main St', postcode: 'CF10 1AA', region: Region.Wales, capacity: 2, tenancyEndDate: new Date('2024-12-31'), monthlyRentPence: 100000 },
    ];
    
    const actualAverageRent = getAverageRentByRegion(properties, Region.Scotland);
    expect(actualAverageRent).toBe(0);
  });
});