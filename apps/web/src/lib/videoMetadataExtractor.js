export const extractVideoMetadata = (file) => {
  return new Promise((resolve) => {
    if (!file || !file.type.startsWith('video/')) {
      resolve(null);
      return;
    }

    const video = document.createElement('video');
    video.preload = 'metadata';

    video.onloadedmetadata = () => {
      window.URL.revokeObjectURL(video.src);
      resolve({
        duration: Math.round(video.duration),
        width: video.videoWidth,
        height: video.videoHeight,
        codec: 'h264/mp4' // Basic assumed codec for standard MP4 uploads in this context
      });
    };

    video.onerror = () => {
      window.URL.revokeObjectURL(video.src);
      resolve(null);
    };

    video.src = window.URL.createObjectURL(file);
  });
};