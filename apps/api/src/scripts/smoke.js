import { createId } from '../utils/ids.js';
import { signToken, verifyToken, publicUser } from '../utils/jwt.js';
import { parseSimpleFilter, inputToColumns } from '../services/records.js';

const id = createId();
const token = signToken({ id, email: 'a@b.com', name: 'Test' });
const payload = verifyToken(token);
if (payload.sub !== id) throw new Error('jwt fail');

const filter = parseSimpleFilter('userId = "abc" && title~"hi"');
if (!filter.sql.includes('user_id') || !filter.sql.includes('LIKE')) {
  throw new Error(`filter fail: ${filter.sql}`);
}

const cols = inputToColumns({ userId: 'x', title: 'y', file: 'z.png' });
if (cols.user_id !== 'x' || cols.file_path !== 'z.png' || cols.title !== 'y') {
  throw new Error(`cols fail: ${JSON.stringify(cols)}`);
}

console.log('smoke_ok', {
  id,
  user: publicUser({ id, email: 'a@b.com', name: 'Test', created_at: 'now' }),
  filter: filter.sql,
});
