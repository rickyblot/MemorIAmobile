import express from 'express';
import { stream } from '../api/integrated-ai.js';
import { SystemPrompt } from '../constants/prompts.js';
import { createRecord, getOne } from '../services/records.js';
import logger from '../utils/logger.js';

const router = express.Router();

router.post('/generate', async (req, res) => {
  const userId = req.user?.id;

  if (!userId) {
    return res.status(400).json({ error: 'User ID is required' });
  }

  const { memoryIds, tone, length, style, title } = req.body;

  if (!memoryIds || !Array.isArray(memoryIds) || memoryIds.length === 0) {
    return res.status(400).json({ error: 'memoryIds array is required and must not be empty' });
  }

  if (!tone || !length || !style) {
    return res.status(400).json({ error: 'tone, length, and style are required' });
  }

  const memories = [];
  for (const memoryId of memoryIds) {
    const memory = await getOne('memories', memoryId);
    if (memory.userId !== userId) {
      return res.status(403).json({ error: 'Unauthorized memory access' });
    }
    memories.push(memory);
  }

  const memoryDetails = memories
    .map((mem, idx) => {
      const details = [
        `Memory ${idx + 1}:`,
        mem.title ? `  Title: ${mem.title}` : null,
        mem.description ? `  Description: ${mem.description}` : null,
        mem.date ? `  Date: ${mem.date}` : null,
        mem.location ? `  Location: ${mem.location}` : null,
        mem.people ? `  People: ${mem.people}` : null,
        mem.tags ? `  Tags: ${mem.tags}` : null,
        mem.content ? `  Content: ${mem.content}` : null,
      ].filter(Boolean);
      return details.join('\n');
    })
    .join('\n\n');

  const userPreferences = `
User Preferences:
- Tone: ${tone}
- Length: ${length}
- Style: ${style}`;

  const fullPrompt = `Please create a story from the following memories:\n\n${memoryDetails}\n${userPreferences}\n\nWeave these memories into a cohesive, engaging narrative that celebrates the user's life moments and relationships.`;

  const sseStream = await stream({
    userId,
    systemPrompt: SystemPrompt,
    userMessage: [{ type: 'text', text: fullPrompt }],
  });

  let fullContent = '';
  let buffer = '';

  return new Promise((resolve, reject) => {
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
            fullContent += event.data.content;
          }
        } catch (e) {
          logger.warn('Failed to parse SSE event:', e);
        }
      }
    });

    sseStream.on('end', async () => {
      try {
        const storyTitle = title || `Story from ${new Date().toLocaleDateString()}`;
        const storyRecord = await createRecord('stories', {
          userId,
          title: storyTitle,
          content: fullContent,
          memories_used: memoryIds,
          tone,
          length,
          style,
          generated_by_ai: true,
        });

        res.json({
          storyId: storyRecord.id,
          title: storyRecord.title,
          content: storyRecord.content,
        });
        resolve();
      } catch (error) {
        reject(error);
      }
    });

    sseStream.on('error', (error) => reject(error));
  });
});

export default router;
