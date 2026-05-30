export const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.readAsDataURL(file);

    reader.onload = () => {
      if (typeof reader.result === 'string') {
        resolve(reader.result);
      } else {
        reject('Failed to convert file to base64.');
      }
    };

    reader.onerror = (error) => {
      reject(error);
    };
  });
};

// fileUtils.ts
export type UploadedImage = {
  base64: string;
  extension: string;
};

export const fileToBase64WithExtension = (
  file: File
): Promise<UploadedImage> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        try {
          const sanitizedBase64 = sanitizeBase64(reader.result);
          const extension = (file.type.split('/')[1] || '').toLowerCase();
          resolve({ base64: sanitizedBase64, extension });
        } catch (error) {
          reject(error);
        }
      } else {
        reject(new Error('Failed to convert file to base64.'));
      }
    };
    reader.onerror = (error) => reject(error);
  });
};

const sanitizeBase64 = (base64: string): string => {
  if (!base64.startsWith('data:')) {
    throw new Error('Invalid base64 format');
  }

  const allowedTypes = ['image/png', 'image/jpeg', 'image/gif', 'image/webp'];
  const mimeType = base64.substring(
    base64.indexOf(':') + 1,
    base64.indexOf(';')
  );
  if (!allowedTypes.includes(mimeType)) {
    throw new Error(`Unsupported mime type: ${mimeType}`);
  }

  return base64;
};
