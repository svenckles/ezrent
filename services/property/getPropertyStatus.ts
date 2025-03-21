import { PropertyStatus } from '../../enums';
import { Property, Tenant } from '../../types';

export const getPropertyStatus = (
  property: Property,
  tenants: Tenant[],
): PropertyStatus => {
  const currentDate = new Date();
  const propertyTenants = tenants.filter(tenant => tenant.propertyId === property.id);
  const tenantCount = propertyTenants.length;
  const tenancyEnd = new Date(property.tenancyEndDate);

  if (tenantCount === 0) {
    // No tenants
    return PropertyStatus.PropertyVacant;
  } else if (tenantCount < property.capacity) {
    if (currentDate <= tenancyEnd) {
      // Some tenants and tenancy is ongoing
      return PropertyStatus.PartiallyVacant;
    } else {
      // Some tenants and tenancy has ended
      return PropertyStatus.PropertyOverdue;
    }
  } else if (tenantCount >= property.capacity) {
    if (currentDate <= tenancyEnd) {
      // Property is fully occupied and tenancy is ongoing
      return PropertyStatus.PropertyActive;
    } else {
      // Property is fully occupied and tenancy has ended
      return PropertyStatus.PropertyOverdue;
    }
  }
  else {
    return PropertyStatus.PropertyOverdue
  }
};
