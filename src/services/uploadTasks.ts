import { apiEndpoints, config } from '../config';

interface UploadTaskResultLeads {
  leads_saved: number;
  leads_skipped: number;
  unmapped_headers: string[];
}

interface UploadTaskResultEmails {
  emails_saved: number;
  emails_skipped: number;
  unmapped_headers: string[];
}

export interface UploadTask {
  id: string;
  company_id: string;
  user_id: string;
  file_name: string;
  type: string;
  status: string;
  result: UploadTaskResultLeads | UploadTaskResultEmails | string;
  created_at: string;
}

export interface PaginatedUploadTaskResponse {
  items: UploadTask[];
  total: number;
  page: number;
  page_size: number;
  total_pages: number;
}

export interface SkippedRow {
  id: string;
  upload_task_id: string;
  category: string;
  row_data: Record<string, any>;
  created_at: string;
}

export interface PaginatedSkippedRowResponse {
  items: SkippedRow[];
  total: number;
  page: number;
  page_size: number;
  total_pages: number;
}

export async function getUploadTasks(
  token: string,
  companyId: string,
  page: number = 1,
  pageSize: number = 20
): Promise<PaginatedUploadTaskResponse> {
  const params = new URLSearchParams();
  params.append('page_number', page.toString());
  params.append('limit', pageSize.toString());

  const response = await fetch(
    apiEndpoints.companies.uploadTasks.list(companyId) + '?' + params.toString(),
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!response.ok) {
    throw new Error('Failed to fetch upload tasks');
  }

  return response.json();
}

export async function downloadUploadFile(
  token: string,
  uploadTaskId: string
): Promise<Blob> {
  const response = await fetch(
    apiEndpoints.uploadHistory.download(uploadTaskId),
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!response.ok) {
    throw new Error('Failed to download file');
  }

  return response.blob();
}

export async function getSkippedRows(
  token: string,
  uploadTaskId: string,
  page: number = 1,
  pageSize: number = 20
): Promise<PaginatedSkippedRowResponse> {
  const params = new URLSearchParams();
  params.append('page_number', page.toString());
  params.append('limit', pageSize.toString());

  const response = await fetch(
    `${config.apiUrl}/api/upload-tasks/${uploadTaskId}/skipped-rows?${params.toString()}`,
    {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    }
  );

  if (!response.ok) {
    throw new Error('Failed to fetch skipped rows');
  }

  return response.json();
} 