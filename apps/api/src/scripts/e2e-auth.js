const base = 'http://127.0.0.1:3001';
const email = `e2e_${Date.now()}@example.com`;
const password = 'password123';

async function req(path, { method = 'GET', token, body, formData } = {}) {
  const headers = {};
  if (token) headers.Authorization = `Bearer ${token}`;
  let payload = body;
  if (body && !formData) {
    headers['Content-Type'] = 'application/json';
    payload = JSON.stringify(body);
  }
  const res = await fetch(`${base}${path}`, {
    method,
    headers,
    body: formData || payload,
  });
  const text = await res.text();
  let data;
  try {
    data = JSON.parse(text);
  } catch {
    data = text;
  }
  if (!res.ok) {
    throw new Error(`${method} ${path} => ${res.status} ${text}`);
  }
  return data;
}

const signup = await req('/auth/signup', {
  method: 'POST',
  body: { email, password, name: 'E2E' },
});
console.log('signup', signup.user.id);

const login = await req('/auth/login', {
  method: 'POST',
  body: { email, password },
});
console.log('login', Boolean(login.token));

const me = await req('/auth/me', { token: login.token });
console.log('me', me.user.email);

const fd = new FormData();
fd.append('title', 'E2E Memory');
fd.append('description', 'from smoke');
fd.append('file', new Blob(['hello memory'], { type: 'text/plain' }), 'note.txt');

const memory = await req('/data/memories', {
  method: 'POST',
  token: login.token,
  formData: fd,
});
console.log('memory', memory.id, memory.file || memory.title);

const list = await req('/data/memories', { token: login.token });
console.log('list', list.totalItems);

const fileFd = new FormData();
fileFd.append('filename', 'vault.txt');
fileFd.append('file', new Blob(['vault'], { type: 'text/plain' }), 'vault.txt');
const file = await req('/data/files', {
  method: 'POST',
  token: login.token,
  formData: fileFd,
});
console.log('file', file.id);

const story = await req('/data/stories', {
  method: 'POST',
  token: login.token,
  body: { title: 'Story', content: 'Once upon a time', memories_used: [memory.id] },
});
console.log('story', story.id);

const contact = await req('/data/contacts', {
  method: 'POST',
  body: { name: 'Guest', email: 'g@e.com', message: 'Hello' },
});
console.log('contact', contact.id);

console.log('e2e_ok');
