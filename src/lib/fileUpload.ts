export interface UploadProgress {
  progress: number;
  status: 'uploading' | 'completed' | 'error';
  error?: string;
}

export const validateAudioFile = (file: File): { valid: boolean; error?: string } => {
  const validTypes = ['audio/mpeg', 'audio/wav', 'audio/mp3', 'audio/m4a', 'audio/ogg'];
  const maxSize = 50 * 1024 * 1024;

  if (!validTypes.includes(file.type) && !file.name.match(/\.(mp3|wav|m4a|ogg)$/i)) {
    return {
      valid: false,
      error: 'Invalid file type. Please upload MP3, WAV, M4A, or OGG files only.',
    };
  }

  if (file.size > maxSize) {
    return {
      valid: false,
      error: 'File size exceeds 50MB limit. Please upload a smaller file.',
    };
  }

  return { valid: true };
};

export const uploadAudioFile = async (
  file: File,
  onProgress?: (progress: UploadProgress) => void
): Promise<string> => {
  const validation = validateAudioFile(file);
  if (!validation.valid) {
    throw new Error(validation.error);
  }

  try {
    if (onProgress) {
      onProgress({ progress: 0, status: 'uploading' });
    }

    const progressInterval = setInterval(() => {
      if (onProgress) {
        onProgress({
          progress: Math.min(90, Math.random() * 90),
          status: 'uploading',
        });
      }
    }, 500);

    await new Promise(resolve => setTimeout(resolve, 2000));

    clearInterval(progressInterval);

    const mockUrl = `https://storage.example.com/submissions/${Date.now()}-${file.name}`;

    if (onProgress) {
      onProgress({ progress: 100, status: 'completed' });
    }

    return mockUrl;
  } catch (error) {
    if (onProgress) {
      onProgress({
        progress: 0,
        status: 'error',
        error: error instanceof Error ? error.message : 'Upload failed',
      });
    }
    throw error;
  }
};
