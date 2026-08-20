const fs = require('fs');
const path = require('path');

const files = [
  'app/page.tsx',
  'app/services/page.tsx',
  'app/client/appointments/page.tsx',
  'app/client/dashboard/page.tsx',
  'app/client/reviews/page.tsx',
  'app/owner/dashboard/page.tsx',
  'app/owner/reviews/page.tsx'
];

for (const rel of files) {
  const full = path.join(__dirname, '..', rel);
  if (!fs.existsSync(full)) continue;
  let content = fs.readFileSync(full, 'utf8');

  // Ensure Lucide Star & X are imported if needed
  let updated = content
    .replace(/\{"★"\.repeat\((.*?)\)\}/g, "{Array.from({ length: $1 }).map((_, i) => <Star key={i} className=\"w-3.5 h-3.5 fill-amber-400 text-amber-400\" />)}")
    .replace(/✕/g, "<X className=\"w-4 h-4\" />");

  if (content !== updated) {
    fs.writeFileSync(full, updated, 'utf8');
    console.log('Cleaned emojis in:', rel);
  }
}
console.log('Done cleaning all emojis!');
