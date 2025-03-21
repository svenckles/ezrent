
import fs from 'fs';
import path from 'path';
import csv from 'csv-parser';

// Helper function to parse CSV and handle errors
export const parseCsv = <T>(
  filePath: string,
  requiredColumns: string[] = [],
  typeMappings: { [key: string]: (value: string) => any } = {},
): Promise<T[]> => {
  return new Promise((resolve, reject) => {
    const results: T[] = [];
    let headersFound = false;
    const stream = fs.createReadStream(path.resolve(filePath)).pipe(csv());
    stream.on('headers', (headers: string[]) => {
      if (requiredColumns.length > 0) {
        const missingColumns = requiredColumns.filter(col => !headers.includes(col));
        if (missingColumns.length > 0) {
          reject(new Error(`Missing required columns: ${missingColumns.join(', ')}`));
          // Important: Unpipe the stream to prevent further processing
          stream.unpipe();
        }
      }
      headersFound = true;
    })
      .on('data', (data) => {
        if (headersFound) {
          // Apply type mappings
          const typedData: any = {};
          for (const key in data) {
            typedData[key] = typeMappings[key] ? typeMappings[key](data[key]) : data[key];
          }
          results.push(typedData as T);
        }
      })
      .on('end', () => {
        if (!headersFound && requiredColumns.length > 0) {
          // Handle the case where the file is empty or has no headers
          reject(new Error(`CSV file is empty or missing headers: ${filePath}`));
        } else {
          resolve(results);
        }
      })
      .on('error', (err) => reject(err));
  });
}
