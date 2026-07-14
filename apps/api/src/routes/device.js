import express from 'express';
import crypto from 'crypto';
import {
  createRecord,
  getFullList,
  getOne,
  updateRecord,
} from '../services/records.js';
import logger from '../utils/logger.js';

const router = express.Router();

router.post('/connect', async (req, res) => {
  const userId = req.user?.id;
  const { deviceName, connectionType } = req.body;

  if (!userId) return res.status(400).json({ error: 'User ID is required' });
  if (!deviceName || typeof deviceName !== 'string') {
    return res.status(400).json({ error: 'deviceName is required' });
  }
  if (!connectionType || !['wifi', 'bluetooth', 'usb', 'cloud'].includes(connectionType)) {
    return res.status(400).json({ error: 'connectionType must be wifi, bluetooth, usb, or cloud' });
  }

  const connectionToken = crypto.randomBytes(32).toString('hex');
  const deviceId = crypto.randomBytes(16).toString('hex');

  const deviceRecord = await createRecord('devices', {
    userId,
    deviceName,
    connectionType,
    deviceId,
    connectionToken,
    status: 'connected',
    lastSyncTime: new Date().toISOString().slice(0, 19).replace('T', ' '),
  });

  res.json({
    deviceId: deviceRecord.id,
    connectionToken,
    permissions: { read: true, write: true, sync: true, delete: false },
  });
});

router.post('/sync', async (req, res) => {
  const userId = req.user?.id;
  const { deviceId, files = [] } = req.body;

  if (!userId) return res.status(400).json({ error: 'User ID is required' });
  if (!deviceId) return res.status(400).json({ error: 'deviceId is required' });
  if (!Array.isArray(files)) return res.status(400).json({ error: 'files must be an array' });

  const device = await getOne('devices', deviceId);
  if (device.userId !== userId) {
    return res.status(403).json({ error: 'Unauthorized to sync this device' });
  }

  let filesSynced = 0;
  let filesSkipped = 0;
  const errors = [];

  for (const file of files) {
    try {
      if (!file.fileName || !file.fileSize || !file.fileHash) {
        filesSkipped++;
        errors.push({ fileName: file.fileName, error: 'Missing required file metadata' });
        continue;
      }

      const existingFiles = await getFullList('synced_files', {
        filter: `userId = "${userId}" && fileHash = "${file.fileHash}"`,
      });

      if (existingFiles.length > 0) {
        filesSkipped++;
        continue;
      }

      await createRecord('synced_files', {
        userId,
        deviceId,
        fileName: file.fileName,
        fileSize: file.fileSize,
        fileHash: file.fileHash,
        fileType: file.fileType || 'unknown',
        syncedAt: new Date().toISOString().slice(0, 19).replace('T', ' '),
      });
      filesSynced++;
    } catch (error) {
      filesSkipped++;
      errors.push({ fileName: file.fileName, error: error.message });
      logger.error('Device sync file error:', error);
    }
  }

  await updateRecord('devices', deviceId, {
    lastSyncTime: new Date().toISOString().slice(0, 19).replace('T', ' '),
  });

  res.json({ filesSynced, filesSkipped, errors });
});

export default router;
