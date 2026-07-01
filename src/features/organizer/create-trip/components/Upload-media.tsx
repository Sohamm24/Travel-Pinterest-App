/**
 * services/mediaUpload.ts
 *
 * Single entry point for all client-side media uploads.
 * Flow: presign → PUT to Supabase → confirm to FastAPI → return paths
 */

import { tripApi } from "../api";

interface UploadOptions {
  localUri: string;
  mimeType: 'image/jpeg' | 'image/png' | 'image/webp';
  mediaContext: 'thumbnail' | 'itinerary';
  tripId: string;
  itinerarySlot?: string;
}

interface UploadResult {
  filePath: string;
  publicUrl: string;
}

export async function uploadMedia(opts: UploadOptions): Promise<UploadResult> {
  const { localUri, mimeType, mediaContext, tripId, itinerarySlot } = opts;

  // ── Step 1: get presigned URL from FastAPI ──────────────────────────────
  const presignRes = await tripApi.presign({
    trip_id: tripId,
    media_context: mediaContext,
    mime_type: mimeType,
    itinerary_slot: itinerarySlot ?? null,
  });

  const { presigned_url, file_path } = presignRes;

  const signed_url = presigned_url;
  const filePath = file_path;
  

  // ── Step 2: PUT directly to Supabase (no server in the middle) ──────────
  const fileBlob = await uriToBlob(localUri);

  const putRes = await fetch(signed_url, {
    method: 'PUT',
    headers: { 'Content-Type': mimeType },
    body: fileBlob,
  });

  if (!putRes.ok) {
    throw new Error(`Supabase PUT failed: ${putRes.status} ${putRes.statusText}`);
  }

  // ── Step 3: confirm to FastAPI so it can write to DB ───────────────────
  const confirmRes = await tripApi.confirmUpload( {
    trip_id: tripId,
    file_path: filePath,
    media_context: mediaContext,
    itinerary_slot: itinerarySlot ?? null,
  });

  const publicUrl = confirmRes.public_url;

  return { filePath, publicUrl };
}

function uriToBlob(uri: string): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.onload = () => resolve(xhr.response);
    xhr.onerror = () => reject(new Error('Failed to read local file'));
    xhr.responseType = 'blob';
    xhr.open('GET', uri, true);
    xhr.send(null);
  });
}