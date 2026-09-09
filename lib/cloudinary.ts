const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || 'pervy9rr';
const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || 'studytrack_preset';

export const isCloudinaryConfigured = (): boolean => {
  return (
    Boolean(cloudName) &&
    Boolean(uploadPreset) &&
    !cloudName.includes('your_cloudinary') &&
    !uploadPreset.includes('studytrack_preset_placeholder')
  );
};

export interface UploadResult {
  url: string;
  publicId: string;
  format: string;
  originalFilename: string;
  bytes: number;
  isMock?: boolean;
}

/**
 * Uploads a file to Cloudinary Storage PaaS using Unsigned Upload API.
 */
export async function uploadToCloudinary(file: File): Promise<UploadResult> {
  if (isCloudinaryConfigured()) {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', uploadPreset);

    const endpoint = `https://api.cloudinary.com/v1_1/${cloudName}/auto/upload`;

    const response = await fetch(endpoint, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.error?.message || `Cloudinary upload failed: ${response.statusText}`
      );
    }

    const data = await response.json();
    return {
      url: data.secure_url || data.url,
      publicId: data.public_id,
      format: data.format,
      originalFilename: file.name,
      bytes: data.bytes || file.size,
      isMock: false,
    };
  }

  // Fallback for immediate preview if unconfigured
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = () => {
      resolve({
        url: reader.result as string,
        publicId: `mock_${Date.now()}`,
        format: file.type.split('/')[1] || 'file',
        originalFilename: file.name,
        bytes: file.size,
        isMock: true,
      });
    };
    reader.readAsDataURL(file);
  });
}
