#!/usr/bin/env node
import { program } from 'commander';

import { getPropertyStatus } from './services/property/getPropertyStatus';
import { getAverageRentByRegion } from './services/rent/getAverageRentByRegion';
import { Region } from './enums';
import { getPropertiesWithInvalidPostcodes } from './services/property/getPropertiesWithInvalidPostcodes';
import { parseProperties, parseTenants } from './utils/csv';

program
  .version('1.0.0')
  .description('EzRent CLI for property management');

// Average Rent Command
program
  .command('average-rent')
  .description('Calculate average rent for a region')
  .requiredOption('-p, --properties <propertiesCsv>', 'Path to properties CSV file')
  .argument('<region>', 'Region to calculate average rent for (e.g., ENGLAND, wales)') // Make region a required argument
  .action(async (region, options) => { // region is now the first argument
    try {
      const properties = await parseProperties(options.properties);
      const upperCaseRegion = region.toUpperCase();
      
      const validRegions: string[] = Object.values(Region);
      if (!validRegions.includes(upperCaseRegion)) {
        console.error(`Error: Invalid region "${region}". Valid regions are: ${validRegions.join(', ')}`);
        process.exit(1);
      }

      const averageRentPounds = getAverageRentByRegion(properties, upperCaseRegion);

      console.log(`Average rent in ${upperCaseRegion}: £${averageRentPounds.toFixed(2)}`);
    } catch (error) {
      console.error(`Error: ${(error as Error).message}`); // Cast error to Error
      process.exit(1);
    }
  });

// Postcode Validation Command
program
  .command('validate-postcodes')
  .description('Validate postcodes in the properties CSV')
  .requiredOption('-p, --properties <propertiesCsv>', 'Path to properties CSV file')
  .action(async (options) => {
    try {
      const properties = await parseProperties(options.properties);

      const invalidPostCodeProperties = getPropertiesWithInvalidPostcodes(properties);

      if (invalidPostCodeProperties.length > 0) {
        console.log(`Properties with invalid postcodes and their postcodes: ${invalidPostCodeProperties.map(p => `\n${p.id}: ${p.postcode}`).join('')}`);
      }

      const validCount = properties.length - invalidPostCodeProperties.length;
      const invalidCount = invalidPostCodeProperties.length;

      console.log(`Postcode validation results: ${validCount} valid, ${invalidCount} invalid.`);
    } catch (error) {
      console.error(`Error: ${(error as Error).message}`);
      process.exit(1);
    }
  });

// Property Command Group
const propertyCmd = program
  .command('property')
  .description('Manage property-related information');

// Rent Calculation for Tenants Command
propertyCmd
  .command('rent')
  .description('Calculate rent for each tenant based on property rent')
  .requiredOption('-p, --properties <propertiesCsv>', 'Path to properties CSV file')
  .requiredOption('-t, --tenants <tenantsCsv>', 'Path to tenants CSV file')  // ADDED THIS LINE
  .option('--inPence', 'Display rent in pence')
  .argument('<propertyId>', 'ID of the property')
  .action(async (propertyId, options) => {
    try {
      const tenants = await parseTenants(options.tenants);
      const properties = await parseProperties(options.properties);

      const property = properties.find(p => p.id === propertyId);
      if (!property) {
        console.error(`Error: Property with ID "${propertyId}" not found.`);
        process.exit(1);
      }

      const propertyTenants = tenants.filter(t => t.propertyId === propertyId);
      const tenantCount = propertyTenants.length;

      if (tenantCount === 0) {
        throw new Error(`No tenants found for property ID "${propertyId}".`);
      }

      const monthlyRentPence = Number(property.monthlyRentPence);
      const rentPerTenantPence = Math.floor(monthlyRentPence / tenantCount);
      const remainder = monthlyRentPence - (rentPerTenantPence * tenantCount);

      // Declare unit, prefix and suffix outside the loop
      const unit = options.inPence ? 'p' : '£';
      const prefix = options.inPence ? '' : '£'; // Prefix for pounds, empty for pence
      const suffix = options.inPence ? 'p' : ''; // Suffix for pence, empty for pounds

      propertyTenants.forEach((tenant, index) => {
        let tenantRent = rentPerTenantPence;
        if (index < remainder) {
          tenantRent++;
        }
        const displayRent = options.inPence ? tenantRent : (tenantRent / 100).toFixed(2);


        console.log(`Rent for tenant ${tenant.name} (ID: ${tenant.id}): ${prefix}${displayRent}${suffix}`);
      });
      const averageRent = monthlyRentPence / tenantCount;
      const displayAverage = options.inPence ? averageRent : (averageRent/100).toFixed(2);

      console.log(`Average rent per tenant: ${prefix}${displayAverage}${suffix}`);


    } catch (error) {
      console.error(`Error: ${(error as Error).message}`); // Cast error to Error
      process.exit(1);
    }
  });

// Property Status Command
propertyCmd
  .command('status')
  .description('Get the status of a property')
  .requiredOption('-p, --properties <propertiesCsv>', 'Path to properties CSV file')
  .requiredOption('-t, --tenants <tenantsCsv>', 'Path to tenants CSV file')
  .argument('<propertyId>', 'ID of the property to get the status for')
  .action(async (propertyId, options) => {
    try {
      const tenants = await parseTenants(options.tenants);
      const properties = await parseProperties(options.properties);
      const property = properties.find(p => p.id === propertyId);

      if (!property) {
        console.error(`Error: Property with ID "${propertyId}" not found.`);
        process.exit(1);
      }

      const status = getPropertyStatus(property, tenants);
      console.log(`Status of property ${propertyId}: ${status}`);
    } catch (error) {
      console.error(`Error: ${(error as Error).message}`); // Cast error to Error
      process.exit(1);
    }
  });

// Error handling for missing commands
program.on('command:*', (commandName) => {
  console.error(`Error: Command "${commandName}" not found.  See "ezrent --help" for a list of valid commands.`);
  process.exit(1);
});

// Add a basic help command
program
  .command('help')
  .description('Display help information')
  .action(() => {
    console.log(`
Usage: ezrent <command> [options]

Available Commands:
  average-rent        Calculate average rent for a region
  validate-postcodes    Validate postcodes in the properties CSV
  property            Manage property-related information
  help                Display this help information

  Property Commands:
    property rent       Calculate rent for each tenant
    property status     Get the status of a property

Options:
  -v, --version      Display the version number
  -h, --help         Display this help information

Valid Regions:
  ${Object.values(Region).join(', ')}

Examples:
  ezrent average-rent -p properties.csv ENGLAND
  ezrent validate-postcodes -p properties.csv
  ezrent property rent -p properties.csv  -t tenants.csv propertyId
  ezrent property status -p properties.csv -t tenants.csv propertyId
`);
  });

// Override the default help
program.helpOption('-h, --help', 'Display help information');

program.parse(process.argv);
