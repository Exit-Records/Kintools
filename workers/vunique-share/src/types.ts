// Re-exported for use in Vunique app's share.ts client library

export interface UploadResponse {
  url: string
  slug: string
  deleteToken: string
  uploadedAt: string
}

export interface DeleteResponse {
  deleted: boolean
  slug: string
}
