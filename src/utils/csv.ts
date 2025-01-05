import { Lead } from '../types';

export async function parseLeadsCsv(file: File): Promise<Lead[]> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (event) => {
      try {
        const text = event.target?.result as string;
        const lines = text.split('\n');
        const headers = lines[0].split(',').map(header => header.trim());
        
        const leads = lines.slice(1).map((line, index) => {
          const values = line.split(',').map(value => value.trim());
          const lead: Partial<Lead> = {
            id: `imported-${index}`,
            companyId: '', // Set this based on the current company
          };
          
          headers.forEach((header, i) => {
            const value = values[i];
            switch (header.toLowerCase()) {
              case 'name': lead.name = value; break;
              case 'email': lead.email = value; break;
              case 'phone number': lead.phoneNumber = value; break;
              case 'company size': lead.companySize = value; break;
              case 'job title': lead.jobTitle = value; break;
              case 'company revenue': lead.companyRevenue = value; break;
              case 'facebook': lead.companyFacebook = value; break;
              case 'twitter': lead.companyTwitter = value; break;
            }
          });
          
          return lead as Lead;
        });
        
        resolve(leads);
      } catch (error) {
        reject(error);
      }
    };
    
    reader.onerror = () => reject(reader.error);
    reader.readAsText(file);
  });
}