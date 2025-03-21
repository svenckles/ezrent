import { DateTime } from 'luxon';
import { PropertyStatus, Region } from '../../../enums';
import { Property, Tenant } from '../../../types';
import { getPropertyStatus } from '../getPropertyStatus';

const futureDate = DateTime.now().plus({ years: 1 }).startOf('day').toJSDate();
const pastDate = DateTime.now().minus({ years: 1 }).startOf('day').toJSDate();

const createProperty = (overrides: Partial<Property> = {}): Property => {
    return {
        id: 'default-property-id',
        address: 'Default Address',
        postcode: 'Default Postcode',
        region: Region.England,
        capacity: 2,
        tenancyEndDate: futureDate,
        monthlyRentPence: 100000,
        ...overrides,
    };
};

const createTenant = (overrides: Partial<Tenant> = {}): Tenant => ({
    id: 'default-tenant-id',
    propertyId: 'default-property-id',
    name: 'Default Tenant Name',
    ...overrides,
});


describe('getPropertyStatus', () => {
    it('should return PROPERTY_VACANT when there are no tenants', () => {
        const property = createProperty();
        const tenants: Tenant[] = [];
        const status = getPropertyStatus(property, tenants);
        expect(status).toBe(PropertyStatus.PropertyVacant);
    });

    it('should return PARTIALLY_VACANT when there are some tenants and tenancy is ongoing', () => {
        const property = createProperty({ capacity: 2 });
        const tenants = [createTenant({ propertyId: property.id })];
        const status = getPropertyStatus(property, tenants);
        expect(status).toBe(PropertyStatus.PartiallyVacant);
    });

    it('should return PROPERTY_ACTIVE when property is fully occupied and tenancy is ongoing', () => {
        const property = createProperty({
          capacity: 2,
        });
        const tenants = [
            createTenant({ propertyId: property.id }),
            createTenant({ propertyId: property.id }),
        ];
        const status = getPropertyStatus(property, tenants);
        expect(status).toBe(PropertyStatus.PropertyActive);
    });

      it('should return PROPERTY_ACTIVE when property is fully occupied and capacity is 0 and tenancy is ongoing', () => {
        const property = createProperty({ capacity: 0 });
        const tenants = [
            createTenant({ propertyId: property.id }),
            createTenant({ propertyId: property.id }),
        ];
        const status = getPropertyStatus(property, tenants);
        expect(status).toBe(PropertyStatus.PropertyActive);
    });

    it('should return PROPERTY_OVERDUE when there are tenants and tenancy has ended', () => {
        const property = createProperty({ tenancyEndDate: pastDate });
        const tenants = [createTenant({ propertyId: property.id })];
        const status = getPropertyStatus(property, tenants);
        expect(status).toBe(PropertyStatus.PropertyOverdue);
    });

      it('should return PROPERTY_OVERDUE when there are some tenants and tenancy has ended', () => {
        const property = createProperty({ capacity: 2, tenancyEndDate: pastDate });
        const tenants = [createTenant({ propertyId: property.id })];
        const status = getPropertyStatus(property, tenants);
        expect(status).toBe(PropertyStatus.PropertyOverdue);
    });

    it('should return PROPERTY_OVERDUE when property is fully occupied and tenancy has ended', () => {
        const property = createProperty({ capacity: 2, tenancyEndDate: pastDate });
        const tenants = [
            createTenant({ propertyId: property.id }),
            createTenant({ propertyId: property.id }),
        ];
        const status = getPropertyStatus(property, tenants);
        expect(status).toBe(PropertyStatus.PropertyOverdue);
    });
});
