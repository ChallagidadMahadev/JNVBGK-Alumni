import Papa from 'papaparse';
import * as XLSX from 'xlsx-js-style';
import { BatchStudent } from '../types/batch';

export const parseCSV = (file: File): Promise<BatchStudent[]> => {
  return new Promise((resolve, reject) => {
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        const students = results.data.map(cleanStudentRecord);
        resolve(students);
      },
      error: (error) => {
        reject(new Error(`Error parsing CSV: ${error.message}`));
      }
    });
  });
};

export const parseExcel = async (file: File): Promise<BatchStudent[]> => {
  try {
    const buffer = await file.arrayBuffer();
    const workbook = XLSX.read(buffer, { type: 'array' });
    const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
    const records = XLSX.utils.sheet_to_json(firstSheet);
    return records.map(cleanStudentRecord);
  } catch (error) {
    throw new Error('Error parsing Excel file');
  }
};

export const parseTXT = async (file: File): Promise<BatchStudent[]> => {
  try {
    const content = await file.text();
    const lines = content.split('\n').filter(line => line.trim());
    
    if (lines.length < 2) {
      throw new Error('File must contain at least a header row and one data row');
    }

    const headers = lines[0].split('\t').map(h => h.trim().toLowerCase());
    const requiredHeaders = ['name'];
    
    if (!requiredHeaders.every(h => headers.includes(h))) {
      throw new Error('Missing required columns: name');
    }

    return lines.slice(1).map(line => {
      const values = line.split('\t').map(v => v.trim());
      const record: Record<string, string> = {};
      headers.forEach((header, index) => {
        record[header] = values[index] || '';
      });
      return cleanStudentRecord(record);
    });
  } catch (error) {
    throw new Error('Error parsing TXT file');
  }
};

const cleanStudentRecord = (record: any): BatchStudent => {
  // Validate and clean house name
  let house = record.house?.toString().toUpperCase();
  if (house && !['ARAVALI', 'NILGIRI', 'SHIVALIK', 'UDAIGIRI'].includes(house)) {
    house = undefined;
  }

  return {
    name: record.name?.toString().trim() || '',
    rollNumber: record.rollnumber?.toString().trim() || record.roll?.toString().trim(),
    house,
    achievements: record.achievements?.toString().trim(),
    currentStatus: record.currentstatus?.toString().trim() || record.status?.toString().trim()
  };
};