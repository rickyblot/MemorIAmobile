import express from 'express';
import authMiddleware, { optionalAuth } from '../middleware/auth.js';
import { upload } from '../utils/uploads.js';
import {
  createRecord,
  deleteRecord,
  getFullList,
  getList,
  getOne,
  updateRecord,
} from '../services/records.js';

const router = express.Router();

const PUBLIC_CREATE = new Set(['contacts']);
const OWNER_COLLECTIONS = new Set([
  'memories', 'files', 'stories', 'familyMembers', 'devices', 'syncLogs',
  'synced_files', 'analysisResults', 'analysis_results', 'batch_analyses',
  'story_exports', '_integratedAiMessages', '_integratedAiImages',
]);

function ensureOwnerFilter(collection, filter, userId) {
  if (!OWNER_COLLECTIONS.has(collection) || !userId) return filter;
  const ownerClause = `userId = "${userId}"`;
  return filter ? `(${filter}) && ${ownerClause}` : ownerClause;
}

router.get('/:collection', optionalAuth, async (req, res) => {
  const { collection } = req.params;
  const page = Number(req.query.page || 1);
  const perPage = Number(req.query.perPage || 50);
  const sort = req.query.sort || '-created';
  let filter = req.query.filter || '';

  if (OWNER_COLLECTIONS.has(collection)) {
    if (!req.user) return res.status(401).json({ error: 'Unauthorized' });
    filter = ensureOwnerFilter(collection, filter, req.user.id);
  }

  const result = await getList(collection, { page, perPage, filter, sort });
  res.json(result);
});

router.get('/:collection/full', authMiddleware, async (req, res) => {
  const { collection } = req.params;
  let filter = req.query.filter || '';
  if (OWNER_COLLECTIONS.has(collection)) {
    filter = ensureOwnerFilter(collection, filter, req.user.id);
  }
  const items = await getFullList(collection, { filter, sort: req.query.sort || '-created' });
  res.json({ items });
});

router.get('/:collection/:id', optionalAuth, async (req, res) => {
  const record = await getOne(req.params.collection, req.params.id);
  if (OWNER_COLLECTIONS.has(req.params.collection)) {
    if (!req.user || record.userId !== req.user.id) {
      return res.status(403).json({ error: 'Forbidden' });
    }
  }
  res.json(record);
});

router.post(
  '/:collection',
  optionalAuth,
  upload.any(),
  async (req, res) => {
    const { collection } = req.params;

    if (!PUBLIC_CREATE.has(collection) && !req.user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const body = { ...req.body };

    // Map uploaded files onto PB-style field names
    if (req.files?.length) {
      for (const f of req.files) {
        const field = f.fieldname || 'file';
        body[field] = f.filename;
        if (collection === 'files') {
          if (field === 'file' && !body.filename) body.filename = f.originalname;
          if (field === 'file' && !body.fileSize) body.fileSize = f.size;
          if (field === 'file' && !body.fileType) body.fileType = f.mimetype;
          if (field === 'file' && !body.uploadDate) body.uploadDate = new Date().toISOString();
        }
        if (collection === 'memories') {
          if ((field === 'file' || field === 'video_file') && !body.file_size_bytes) {
            body.file_size_bytes = f.size;
          }
          if (field === 'file' && !body.fileType) body.fileType = f.mimetype;
        }
      }
    }

    if (OWNER_COLLECTIONS.has(collection) && req.user) {
      body.userId = body.userId || req.user.id;
      if (body.userId !== req.user.id) {
        return res.status(403).json({ error: 'Forbidden' });
      }
    }

    // content may arrive as JSON string for AI messages
    if (typeof body.content === 'string' && (body.content.startsWith('{') || body.content.startsWith('['))) {
      try { body.content = JSON.parse(body.content); } catch { /* keep */ }
    }

    const record = await createRecord(collection, body);
    res.status(201).json(record);
  },
);

router.patch('/:collection/:id', authMiddleware, upload.any(), async (req, res) => {
  const { collection, id } = req.params;
  const existing = await getOne(collection, id);

  if (OWNER_COLLECTIONS.has(collection) && existing.userId !== req.user.id) {
    return res.status(403).json({ error: 'Forbidden' });
  }

  const body = { ...req.body };
  if (req.files?.length) {
    for (const f of req.files) {
      body[f.fieldname || 'file'] = f.filename;
    }
  }

  const record = await updateRecord(collection, id, body);
  res.json(record);
});

router.delete('/:collection/:id', authMiddleware, async (req, res) => {
  const { collection, id } = req.params;
  const existing = await getOne(collection, id);
  if (OWNER_COLLECTIONS.has(collection) && existing.userId !== req.user.id) {
    return res.status(403).json({ error: 'Forbidden' });
  }
  await deleteRecord(collection, id);
  res.json({ success: true });
});

export default router;
