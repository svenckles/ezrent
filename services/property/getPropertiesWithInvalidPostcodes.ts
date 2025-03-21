import { isValid } from 'postcode';

import { Property } from '../../types';

export const getPropertiesWithInvalidPostcodes = (properties: Property[]) => {
  const invalidProperties = properties.filter(property => !isValid(property.postcode));

  return invalidProperties;
};
