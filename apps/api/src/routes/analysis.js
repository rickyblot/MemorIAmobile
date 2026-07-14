import express from 'express';
import crypto from 'crypto';
import { stream } from '../api/integrated-ai.js';
import { SystemPrompt } from '../constants/prompts.js';
import {
  createRecord,
  getFullList,
  getOne,
  updateRecord,
} from '../services/records.js';
import logger from '../utils/logger.js';

const router = express.Router();

router.post('/batch', async (req, res) => {
  const userId = req.user?.id;
  const { fileIds = [] } = req.body;

  if (!userId) return res.status(400).json({ error: 'User ID is required' });
  if (!Array.isArray(fileIds) || fileIds.length === 0) {
    return res.status(400).json({ error: 'fileIds must be a non-empty array' });
  }

  const analysisId = crypto.randomBytes(16).toString('hex');
  const analysisRecord = await createRecord('batch_analyses', {
    userId,
    analysisId,
    fileIds,
    status: 'processing',
    totalFiles: fileIds.length,
    completedFiles: 0,
    startedAt: new Date().toISOString().slice(0, 19).replace('T', ' '),
  });

  processBatchAnalysis({ userId, analysisId: analysisRecord.id, fileIds, publicAnalysisId: analysisId }).catch((error) => {
    logger.error('Batch analysis error:', error);
  });

  res.json({
    analysisId: analysisRecord.id,
    status: 'processing',
    estimatedTime: `${Math.ceil(fileIds.length * 2)} seconds`,
  });
});

router.get('/status/:analysisId', async (req, res) => {
  const userId = req.user?.id;
  const { analysisId } = req.params;

  if (!userId) return res.status(400).json({ error: 'User ID is required' });
  if (!analysisId) return res.status(400).json({ error: 'analysisId is required' });

  const analysis = await getOne('batch_analyses', analysisId);
  if (analysis.userId !== userId) {
    return res.status(403).json({ error: 'Unauthorized to view this analysis' });
  }

  const results = await getFullList('analysis_results', {
    filter: `analysisId = "${analysisId}"`,
    sort: 'created',
  });

  res.json({
    status: analysis.status,
    progress: Math.round(((analysis.completedFiles || 0) / (analysis.totalFiles || 1)) * 100),
    completedFiles: analysis.completedFiles,
    totalFiles: analysis.totalFiles,
    results: results.map((r) => ({
      fileId: r.fileId,
      fileName: r.fileName,
      analysisStatus: r.status,
      detectedObjects: r.detectedObjects || [],
      detectedPeople: r.detectedPeople || [],
      emotions: r.emotions || [],
      suggestedTags: r.suggestedTags || [],
      confidence: r.confidence || 0,
    })),
  });
});

async function processBatchAnalysis({ userId, analysisId, fileIds, publicAnalysisId }) {
  try {
    let completedFiles = 0;

    for (const fileId of fileIds) {
      try {
        const file = await getOne('synced_files', fileId);
        const analysisPrompt = `Analyze this file and provide:
1. Detected objects with confidence scores
2. Detected people (count and characteristics)
3. Emotions and mood
4. Scene description
5. Suggested tags
6. Story potential

File: ${file.fileName}
Type: ${file.fileType}`;

        const sseStream = await stream({
          userId,
          systemPrompt: SystemPrompt,
          userMessage: [{ type: 'text', text: analysisPrompt }],
        });

        let analysisContent = '';
        let buffer = '';

        await new Promise((resolve, reject) => {
          sseStream.on('data', (chunk) => {
            buffer += chunk.toString();
            const lines = buffer.split('\n');
            buffer = lines.pop() || '';
            for (const line of lines) {
              if (!line.startsWith('data: ')) continue;
              const jsonStr = line.slice(6);
              if (jsonStr === '[DONE]' || jsonStr === '[COMPLETED]') return;
              try {
                const event = JSON.parse(jsonStr);
                if (event.type === 'content' && event.data?.content) {
                  analysisContent += event.data.content;
                }
              } catch (e) {
                logger.warn('Failed to parse SSE event:', e);
              }
            }
          });
          sseStream.on('end', () => resolve());
          sseStream.on('error', reject);
        });

        await createRecord('analysis_results', {
          userId,
          analysisId,
          fileId,
          fileName: file.fileName,
          status: 'completed',
          detectedObjects: [],
          detectedPeople: [],
          emotions: [],
          suggestedTags: [],
          confidence: 0.85,
          rawAnalysis: analysisContent,
        });

        completedFiles++;
      } catch (error) {
        logger.error(`Error analyzing file ${fileId}:`, error);
        await createRecord('analysis_results', {
          userId,
          analysisId,
          fileId,
          status: 'error',
          error: error.message,
        }).catch(() => {});
      }

      await updateRecord('batch_analyses', analysisId, { completedFiles });
    }

    await updateRecord('batch_analyses', analysisId, {
      status: 'completed',
      completedAt: new Date().toISOString().slice(0, 19).replace('T', ' '),
    });
  } catch (error) {
    logger.error('Batch analysis processing error:', error);
    await updateRecord('batch_analyses', analysisId, {
      status: 'error',
      error: error.message,
    }).catch(() => {});
  }
}

export default router;
