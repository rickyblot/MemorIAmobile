/**
 * Utility to extract frames from a video URL and compress images.
 */

// Compress an image URL to a File object
export const compressImageUrlToFile = async (imageUrl, filename, maxSize = 1024) => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      let width = img.width;
      let height = img.height;

      if (width > maxSize || height > maxSize) {
        if (width > height) {
          height = Math.round((height * maxSize) / width);
          width = maxSize;
        } else {
          width = Math.round((width * maxSize) / height);
          height = maxSize;
        }
      }

      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0, width, height);

      canvas.toBlob((blob) => {
        if (!blob) {
          reject(new Error('Canvas to Blob failed'));
          return;
        }
        resolve(new File([blob], filename, { type: 'image/jpeg' }));
      }, 'image/jpeg', 0.8);
    };
    img.onerror = () => reject(new Error(`Failed to load image: ${filename}`));
    img.src = imageUrl;
  });
};

// Convert data URL to File
export const dataUrlToFile = (dataUrl, filename) => {
  const arr = dataUrl.split(',');
  const mime = arr[0].match(/:(.*?);/)[1];
  const bstr = atob(arr[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  return new File([u8arr], filename, { type: mime });
};

export const extractVideoFrames = async (videoUrl, videoName, frameCount = 3) => {
  const cacheKey = `video-frames-${videoUrl}`;
  try {
    const cached = sessionStorage.getItem(cacheKey);
    if (cached) {
      const parsed = JSON.parse(cached);
      return parsed.map((frame, i) => ({
        timestamp: frame.timestamp,
        file: dataUrlToFile(frame.dataUrl, `${videoName}_frame_${i}.jpg`)
      }));
    }
  } catch (e) {
    // Ignore sessionStorage errors
  }

  return new Promise((resolve, reject) => {
    const video = document.createElement('video');
    video.crossOrigin = 'anonymous';
    video.muted = true;
    video.playsInline = true;
    video.preload = 'auto';

    let frames = [];
    let currentFrameIndex = 0;
    let targetTimes = [];

    video.addEventListener('loadedmetadata', () => {
      const duration = video.duration;
      if (!duration || !isFinite(duration)) {
        reject(new Error('Invalid video duration'));
        return;
      }
      
      // Calculate evenly spaced intervals, avoiding exactly 0 and the very end
      for (let i = 1; i <= frameCount; i++) {
        targetTimes.push((duration / (frameCount + 1)) * i);
      }
      video.currentTime = targetTimes[0];
    });

    video.addEventListener('seeked', () => {
      try {
        const canvas = document.createElement('canvas');
        // Max 800px for video frames to save payload size
        const maxSize = 800;
        let width = video.videoWidth;
        let height = video.videoHeight;

        if (width > maxSize || height > maxSize) {
          if (width > height) {
            height = Math.round((height * maxSize) / width);
            width = maxSize;
          } else {
            width = Math.round((width * maxSize) / height);
            height = maxSize;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(video, 0, 0, width, height);

        const dataUrl = canvas.toDataURL('image/jpeg', 0.7);
        frames.push({
          timestamp: targetTimes[currentFrameIndex].toFixed(2),
          dataUrl,
          file: dataUrlToFile(dataUrl, `${videoName}_frame_${currentFrameIndex}.jpg`)
        });

        currentFrameIndex++;
        if (currentFrameIndex < targetTimes.length) {
          video.currentTime = targetTimes[currentFrameIndex];
        } else {
          // Attempt caching
          try {
            sessionStorage.setItem(cacheKey, JSON.stringify(frames.map(f => ({
              timestamp: f.timestamp,
              dataUrl: f.dataUrl
            }))));
          } catch (e) {
            // Storage quota exceeded likely, ignore
          }
          resolve(frames);
        }
      } catch (err) {
        reject(new Error(`Failed to extract frame: ${err.message}`));
      }
    });

    video.addEventListener('error', () => {
      reject(new Error(`Failed to load video: ${videoName}`));
    });

    video.src = videoUrl;
    video.load();
  });
};