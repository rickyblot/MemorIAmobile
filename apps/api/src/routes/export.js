import express from 'express';
import { createRecord, getOne } from '../services/records.js';

const router = express.Router();

function exportUrls(id, ext) {
  const domain = process.env.WEBSITE_DOMAIN || 'localhost';
  const base = `https://${domain}/hcgi/api/exports/${id}`;
  return {
    videoUrl: `${base}/video.${ext || 'mp4'}`,
    downloadUrl: `${base}/download`,
    shareUrls: {
      direct: `${base}/share`,
      social: `${base}/social`,
    },
    pdfUrl: `${base}/story.pdf`,
    slideshowUrl: `${base}/slideshow.html`,
  };
}

async function assertStoryOwner(userId, storyId) {
  const story = await getOne('stories', storyId);
  if (story.userId !== userId) {
    const err = new Error('Unauthorized to export this story');
    err.status = 403;
    throw err;
  }
  return story;
}

router.post('/video', async (req, res) => {
  const userId = req.user?.id;
  const {
    storyId,
    format = 'mp4',
    resolution = '1080p',
    frameRate = 30,
    quality = 'high',
    includeMusic = false,
    musicVolume = 0.5,
  } = req.body;

  if (!userId) return res.status(400).json({ error: 'User ID is required' });
  if (!storyId) return res.status(400).json({ error: 'storyId is required' });
  if (!['mp4', 'webm'].includes(format)) {
    return res.status(400).json({ error: 'format must be mp4 or webm' });
  }

  await assertStoryOwner(userId, storyId);
  const exportRecord = await createRecord('story_exports', {
    userId,
    storyId,
    exportType: 'video',
    format,
    resolution,
    frameRate,
    quality,
    includeMusic,
    musicVolume,
    status: 'processing',
  });

  const urls = exportUrls(exportRecord.id, format);
  res.json({
    exportId: exportRecord.id,
    status: 'processing',
    videoUrl: urls.videoUrl,
    downloadUrl: urls.downloadUrl,
    shareUrls: urls.shareUrls,
  });
});

router.post('/pdf', async (req, res) => {
  const userId = req.user?.id;
  const { storyId, pageSize = 'A4', orientation = 'portrait', includeMusic = false, textSettings = {} } = req.body;
  if (!userId) return res.status(400).json({ error: 'User ID is required' });
  if (!storyId) return res.status(400).json({ error: 'storyId is required' });

  await assertStoryOwner(userId, storyId);
  const exportRecord = await createRecord('story_exports', {
    userId,
    storyId,
    exportType: 'pdf',
    pageSize,
    orientation,
    includeMusic,
    textSettings,
    status: 'processing',
  });

  const urls = exportUrls(exportRecord.id);
  res.json({
    exportId: exportRecord.id,
    status: 'processing',
    pdfUrl: urls.pdfUrl,
    downloadUrl: urls.downloadUrl,
  });
});

router.post('/slideshow', async (req, res) => {
  const userId = req.user?.id;
  const { storyId, transitionType = 'fade', duration = 3000, includeMusic = false } = req.body;
  if (!userId) return res.status(400).json({ error: 'User ID is required' });
  if (!storyId) return res.status(400).json({ error: 'storyId is required' });

  await assertStoryOwner(userId, storyId);
  const exportRecord = await createRecord('story_exports', {
    userId,
    storyId,
    exportType: 'slideshow',
    transitionType,
    duration,
    includeMusic,
    status: 'completed',
  });

  const urls = exportUrls(exportRecord.id);
  res.json({
    exportId: exportRecord.id,
    status: 'completed',
    slideshowUrl: urls.slideshowUrl,
    downloadUrl: urls.downloadUrl,
  });
});

router.post('/social-media', async (req, res) => {
  const userId = req.user?.id;
  const { storyId, platform, format = 'mp4' } = req.body;
  if (!userId) return res.status(400).json({ error: 'User ID is required' });
  if (!storyId) return res.status(400).json({ error: 'storyId is required' });
  if (!['instagram', 'tiktok', 'youtube', 'facebook'].includes(platform)) {
    return res.status(400).json({ error: 'platform must be instagram, tiktok, youtube, or facebook' });
  }

  await assertStoryOwner(userId, storyId);

  const platformDimensions = {
    instagram: { width: 1080, height: 1350, aspectRatio: '4:5' },
    tiktok: { width: 1080, height: 1920, aspectRatio: '9:16' },
    youtube: { width: 1920, height: 1080, aspectRatio: '16:9' },
    facebook: { width: 1200, height: 628, aspectRatio: '1.91:1' },
  };

  const exportRecord = await createRecord('story_exports', {
    userId,
    storyId,
    exportType: 'social_media',
    platform,
    format,
    dimensions: platformDimensions[platform],
    status: 'processing',
  });

  const urls = exportUrls(exportRecord.id, format);
  res.json({
    exportId: exportRecord.id,
    status: 'processing',
    videoUrl: urls.videoUrl,
    downloadUrl: urls.downloadUrl,
    platformUrl: `https://${platform}.com/share?id=${exportRecord.id}`,
  });
});

export default router;
