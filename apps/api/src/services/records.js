import { createId } from '../utils/ids.js';
import { query } from '../db/pool.js';
import { filePublicUrl } from '../utils/uploads.js';

/** collection name (API/PB style) -> MySQL table */
export const COLLECTION_TABLE = {
  memories: 'memories',
  files: 'files',
  stories: 'stories',
  familyMembers: 'family_members',
  devices: 'devices',
  syncLogs: 'sync_logs',
  synced_files: 'synced_files',
  contacts: 'contacts',
  analysisResults: 'analysis_results',
  analysis_results: 'analysis_results',
  batch_analyses: 'batch_analyses',
  story_exports: 'story_exports',
  _integratedAiMessages: 'ai_messages',
  _integratedAiImages: 'ai_images',
  users: 'users',
};

/** API camelCase -> DB column (per-table overrides + defaults) */
const FIELD_MAP = {
  userId: 'user_id',
  file: 'file_path',
  video_file: 'video_file_path',
  fileType: 'file_type',
  fileSize: 'file_size',
  uploadDate: 'upload_date',
  file_size_bytes: 'file_size_bytes',
  video_duration: 'video_duration',
  video_metadata: 'video_metadata',
  user_notes: 'user_notes',
  event_category: 'event_category',
  file_type_extracted: 'file_type_extracted',
  memories_used: 'memories_used',
  generated_by_ai: 'generated_by_ai',
  story_format: 'story_format',
  joinedDate: 'joined_date',
  deviceName: 'device_name',
  connectionType: 'connection_type',
  deviceId: 'external_device_id',
  connectionToken: 'connection_token',
  lastSyncTime: 'last_sync_time',
  fileCount: 'file_count',
  storageInfo: 'storage_info',
  syncStatus: 'sync_status',
  syncStartTime: 'sync_start_time',
  syncEndTime: 'sync_end_time',
  filesCount: 'files_count',
  filesSynced: 'files_synced',
  filesFailed: 'files_failed',
  syncType: 'sync_type',
  errorMessage: 'error_message',
  syncSpeed: 'sync_speed',
  fileName: 'file_name',
  fileHash: 'file_hash',
  syncedAt: 'synced_at',
  analysisId: 'analysis_id',
  fileId: 'file_id',
  detectedObjects: 'detected_objects',
  detectedPeople: 'detected_people',
  suggestedTags: 'suggested_tags',
  ocrText: 'ocr_text',
  eventType: 'event_type',
  rawAnalysis: 'raw_analysis',
  analysisTimestamp: 'analysis_timestamp',
  fileIds: 'file_ids',
  totalFiles: 'total_files',
  completedFiles: 'completed_files',
  startedAt: 'started_at',
  completedAt: 'completed_at',
  storyId: 'story_id',
  exportType: 'export_type',
  frameRate: 'frame_rate',
  includeMusic: 'include_music',
  musicVolume: 'music_volume',
  pageSize: 'page_size',
  textSettings: 'text_settings',
  transitionType: 'transition_type',
  avatar: 'avatar_path',
  password: null, // never map via generic CRUD
  passwordConfirm: null,
  password_hash: null,
};

const JSON_COLUMNS = new Set([
  'people', 'tags', 'video_metadata', 'memories_used', 'storage_info',
  'detected_objects', 'detected_people', 'emotions', 'suggested_tags',
  'file_ids', 'text_settings', 'dimensions', 'content',
]);

const BOOL_COLUMNS = new Set(['generated_by_ai', 'include_music', 'email_verified']);

function toDbColumn(key) {
  if (Object.prototype.hasOwnProperty.call(FIELD_MAP, key)) return FIELD_MAP[key];
  // already snake_case or known column names
  if (/^[a-z][a-z0-9_]*$/.test(key)) return key;
  return key.replace(/[A-Z]/g, (m) => `_${m.toLowerCase()}`);
}

/** Columns we never write via generic CRUD */
const BLOCKED_COLUMNS = new Set(['password', 'password_hash', 'passwordConfirm']);

/** Validate column exists via allowlist per table (best-effort) */
const TABLE_COLUMNS = {
  memories: new Set(['id','user_id','title','description','date','location','people','tags','content','file_path','video_file_path','file_type','file_type_extracted','event_category','file_size_bytes','video_duration','video_metadata','user_notes']),
  files: new Set(['id','user_id','filename','file_path','file_type','file_size','upload_date','folder']),
  stories: new Set(['id','user_id','title','content','memories_used','tone','length','style','story_format','generated_by_ai']),
  family_members: new Set(['id','user_id','email','role','status','joined_date']),
  devices: new Set(['id','user_id','device_name','connection_type','external_device_id','connection_token','status','last_sync_time','file_count','storage_info']),
  sync_logs: new Set(['id','user_id','device_id','sync_start_time','sync_end_time','files_count','files_synced','files_failed','sync_status','sync_type','error_message','sync_speed']),
  synced_files: new Set(['id','user_id','device_id','file_name','file_size','file_hash','file_type','synced_at']),
  contacts: new Set(['id','name','email','message']),
  analysis_results: new Set(['id','user_id','analysis_id','file_id','file_name','status','detected_objects','detected_people','emotions','suggested_tags','tags','location','ocr_text','event_type','confidence','raw_analysis','error','analysis_timestamp']),
  batch_analyses: new Set(['id','user_id','analysis_id','file_ids','status','total_files','completed_files','started_at','completed_at','error']),
  story_exports: new Set(['id','user_id','story_id','export_type','format','resolution','frame_rate','quality','include_music','music_volume','page_size','orientation','text_settings','transition_type','duration','platform','dimensions','status']),
  ai_messages: new Set(['id','user_id','role','content']),
  ai_images: new Set(['id','user_id','file_path']),
  users: new Set(['id','email','name','avatar_path','theme']),
};

export function inputToColumns(data = {}, table = null) {
  const cols = {};
  const allow = table ? TABLE_COLUMNS[table] : null;
  for (const [key, value] of Object.entries(data)) {
    if (key === 'id' || key === 'created' || key === 'updated') continue;
    const col = toDbColumn(key);
    if (col == null || BLOCKED_COLUMNS.has(col)) continue;
    if (allow && !allow.has(col)) continue;
    const prepared = prepareValue(col, value);
    if (prepared !== undefined) cols[col] = prepared;
  }
  return cols;
}

function parseJsonMaybe(value) {
  if (value == null) return value;
  if (typeof value === 'object') return value;
  if (typeof value === 'string') {
    try {
      return JSON.parse(value);
    } catch {
      return value;
    }
  }
  return value;
}

/** DB row -> PocketBase-like record (camelCase where UI expects it) */
export function rowToRecord(table, row) {
  if (!row) return null;

  const base = {
    id: row.id,
    created: row.created_at,
    updated: row.updated_at,
  };

  const map = {
    memories: () => ({
      ...base,
      userId: row.user_id,
      title: row.title,
      description: row.description,
      date: row.date,
      location: row.location,
      people: parseJsonMaybe(row.people),
      tags: parseJsonMaybe(row.tags),
      content: row.content,
      file: row.file_path,
      video_file: row.video_file_path,
      fileType: row.file_type,
      file_type_extracted: row.file_type_extracted,
      event_category: row.event_category,
      file_size_bytes: row.file_size_bytes,
      video_duration: row.video_duration,
      video_metadata: parseJsonMaybe(row.video_metadata),
      user_notes: row.user_notes,
    }),
    files: () => ({
      ...base,
      userId: row.user_id,
      filename: row.filename,
      file: row.file_path,
      fileType: row.file_type,
      fileSize: row.file_size,
      uploadDate: row.upload_date,
      folder: row.folder,
    }),
    stories: () => ({
      ...base,
      userId: row.user_id,
      title: row.title,
      content: row.content,
      memories_used: parseJsonMaybe(row.memories_used),
      tone: row.tone,
      length: row.length,
      style: row.style,
      story_format: row.story_format,
      generated_by_ai: Boolean(row.generated_by_ai),
    }),
    family_members: () => ({
      ...base,
      userId: row.user_id,
      email: row.email,
      role: row.role,
      status: row.status,
      joinedDate: row.joined_date,
    }),
    devices: () => ({
      ...base,
      userId: row.user_id,
      deviceName: row.device_name,
      connectionType: row.connection_type,
      deviceId: row.external_device_id,
      connectionToken: row.connection_token,
      status: row.status,
      lastSyncTime: row.last_sync_time,
      fileCount: row.file_count,
      storageInfo: parseJsonMaybe(row.storage_info),
    }),
    sync_logs: () => ({
      ...base,
      userId: row.user_id,
      deviceId: row.device_id,
      syncStartTime: row.sync_start_time,
      syncEndTime: row.sync_end_time,
      filesCount: row.files_count,
      filesSynced: row.files_synced,
      filesFailed: row.files_failed,
      syncStatus: row.sync_status,
      syncType: row.sync_type,
      errorMessage: row.error_message,
      syncSpeed: row.sync_speed,
    }),
    synced_files: () => ({
      ...base,
      userId: row.user_id,
      deviceId: row.device_id,
      fileName: row.file_name,
      fileSize: row.file_size,
      fileHash: row.file_hash,
      fileType: row.file_type,
      syncedAt: row.synced_at,
    }),
    contacts: () => ({
      ...base,
      name: row.name,
      email: row.email,
      message: row.message,
    }),
    analysis_results: () => ({
      ...base,
      userId: row.user_id,
      analysisId: row.analysis_id,
      fileId: row.file_id,
      fileName: row.file_name,
      status: row.status,
      detectedObjects: parseJsonMaybe(row.detected_objects),
      detectedPeople: parseJsonMaybe(row.detected_people),
      emotions: parseJsonMaybe(row.emotions),
      suggestedTags: parseJsonMaybe(row.suggested_tags),
      tags: parseJsonMaybe(row.tags),
      location: row.location,
      ocrText: row.ocr_text,
      eventType: row.event_type,
      confidence: row.confidence,
      rawAnalysis: row.raw_analysis,
      error: row.error,
      analysisTimestamp: row.analysis_timestamp,
    }),
    batch_analyses: () => ({
      ...base,
      userId: row.user_id,
      analysisId: row.analysis_id,
      fileIds: parseJsonMaybe(row.file_ids),
      status: row.status,
      totalFiles: row.total_files,
      completedFiles: row.completed_files,
      startedAt: row.started_at,
      completedAt: row.completed_at,
      error: row.error,
    }),
    story_exports: () => ({
      ...base,
      userId: row.user_id,
      storyId: row.story_id,
      exportType: row.export_type,
      format: row.format,
      resolution: row.resolution,
      frameRate: row.frame_rate,
      quality: row.quality,
      includeMusic: Boolean(row.include_music),
      musicVolume: row.music_volume,
      pageSize: row.page_size,
      orientation: row.orientation,
      textSettings: parseJsonMaybe(row.text_settings),
      transitionType: row.transition_type,
      duration: row.duration,
      platform: row.platform,
      dimensions: parseJsonMaybe(row.dimensions),
      status: row.status,
    }),
    ai_messages: () => ({
      ...base,
      userId: row.user_id,
      role: row.role,
      content: parseJsonMaybe(row.content),
    }),
    ai_images: () => ({
      ...base,
      userId: row.user_id,
      file: row.file_path,
    }),
    users: () => ({
      ...base,
      email: row.email,
      name: row.name,
      avatar: row.avatar_path,
      theme: row.theme,
    }),
  };

  return (map[table] || (() => ({ ...base, ...row })))();
}

function prepareValue(column, value) {
  if (value === undefined) return undefined;
  if (JSON_COLUMNS.has(column)) {
    if (value == null) return null;
    return typeof value === 'string' ? value : JSON.stringify(value);
  }
  if (BOOL_COLUMNS.has(column)) return value ? 1 : 0;
  return value;
}

export function resolveTable(collection) {
  const table = COLLECTION_TABLE[collection];
  if (!table) {
    const err = new Error(`Unknown collection: ${collection}`);
    err.status = 404;
    throw err;
  }
  return table;
}

/** Very small subset of PB filter: `userId = "x"` and `field = "y" && ...` */
export function parseSimpleFilter(filter, params = {}) {
  if (!filter) return { sql: '1=1', params: {} };

  let f = filter;
  // Replace {:name} placeholders
  for (const [k, v] of Object.entries(params)) {
    f = f.replaceAll(`{:${k}}`, typeof v === 'string' ? `"${v}"` : String(v));
  }

  const parts = f.split('&&').map((p) => p.trim());
  const clauses = [];
  const outParams = {};
  let i = 0;

  for (const part of parts) {
    // field~"text" contains
    let m = part.match(/^(\w+)\s*~\s*"([^"]*)"$/);
    if (m) {
      const col = toDbColumn(m[1]);
      const key = `p${i++}`;
      clauses.push(`${col} LIKE :${key}`);
      outParams[key] = `%${m[2]}%`;
      continue;
    }
    m = part.match(/^(\w+)\s*=\s*"([^"]*)"$/);
    if (m) {
      const col = toDbColumn(m[1]);
      const key = `p${i++}`;
      clauses.push(`${col} = :${key}`);
      outParams[key] = m[2];
      continue;
    }
    m = part.match(/^(\w+)\s*=\s*'([^']*)'$/);
    if (m) {
      const col = toDbColumn(m[1]);
      const key = `p${i++}`;
      clauses.push(`${col} = :${key}`);
      outParams[key] = m[2];
      continue;
    }
    m = part.match(/^(\w+)\s*!=\s*""$/);
    if (m) {
      const col = toDbColumn(m[1]);
      clauses.push(`(${col} IS NOT NULL AND ${col} != '')`);
      continue;
    }
    // fallback: ignore unsupported
  }

  return { sql: clauses.length ? clauses.join(' AND ') : '1=1', params: outParams };
}

function parseSort(sort) {
  if (!sort) return 'created_at DESC';
  const desc = sort.startsWith('-');
  const field = desc ? sort.slice(1) : sort;
  const col = field === 'created' ? 'created_at' : field === 'updated' ? 'updated_at' : toDbColumn(field);
  return `${col} ${desc ? 'DESC' : 'ASC'}`;
}

export async function getOne(collection, id) {
  const table = resolveTable(collection);
  const rows = await query(`SELECT * FROM \`${table}\` WHERE id = :id LIMIT 1`, { id });
  if (!rows[0]) {
    const err = new Error('Not found');
    err.status = 404;
    throw err;
  }
  return rowToRecord(table, rows[0]);
}

export async function getList(collection, { page = 1, perPage = 50, filter, filterParams, sort } = {}) {
  const table = resolveTable(collection);
  const { sql, params } = parseSimpleFilter(filter, filterParams);
  const order = parseSort(sort);
  const offset = (Math.max(1, page) - 1) * perPage;

  const countRows = await query(
    `SELECT COUNT(*) AS c FROM \`${table}\` WHERE ${sql}`,
    params,
  );
  const totalItems = Number(countRows[0]?.c || 0);

  const rows = await query(
    `SELECT * FROM \`${table}\` WHERE ${sql} ORDER BY ${order} LIMIT ${Number(perPage)} OFFSET ${Number(offset)}`,
    params,
  );

  return {
    page: Number(page),
    perPage: Number(perPage),
    totalItems,
    totalPages: Math.ceil(totalItems / perPage) || 0,
    items: rows.map((r) => rowToRecord(table, r)),
  };
}

export async function getFullList(collection, options = {}) {
  const result = await getList(collection, { ...options, page: 1, perPage: 500 });
  return result.items;
}

export async function createRecord(collection, data) {
  const table = resolveTable(collection);
  const id = data.id || createId();
  const cols = inputToColumns(data, table);
  cols.id = id;

  const keys = Object.keys(cols);
  const placeholders = keys.map((k) => `:${k}`).join(', ');
  await query(
    `INSERT INTO \`${table}\` (${keys.map((k) => `\`${k}\``).join(', ')}) VALUES (${placeholders})`,
    cols,
  );
  return getOne(collection, id);
}

export async function updateRecord(collection, id, data) {
  const table = resolveTable(collection);
  const cols = inputToColumns(data, table);
  const keys = Object.keys(cols);
  if (!keys.length) return getOne(collection, id);

  const sets = keys.map((k) => `\`${k}\` = :${k}`).join(', ');
  await query(`UPDATE \`${table}\` SET ${sets} WHERE id = :id`, { ...cols, id });
  return getOne(collection, id);
}

export async function deleteRecord(collection, id) {
  const table = resolveTable(collection);
  await query(`DELETE FROM \`${table}\` WHERE id = :id`, { id });
  return true;
}

export { filePublicUrl };
