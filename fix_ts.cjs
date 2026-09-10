const fs = require('fs');
const path = require('path');

const replaceInFile = (filePath, search, replacement) => {
  const fullPath = path.join(__dirname, filePath);
  let content = fs.readFileSync(fullPath, 'utf8');
  content = content.replace(search, replacement);
  fs.writeFileSync(fullPath, content);
};

// Footer.tsx
replaceInFile('src/components/Footer.tsx', /import \{ Button \} from '\.\/Button';\n?/, '');

// Navbar.tsx
replaceInFile('src/components/Navbar.tsx', /Menu, X, Hexagon, ArrowLeft, User, Share2/, 'Menu, X, ArrowLeft, User, Share2');

// AppContext.tsx
replaceInFile('src/context/AppContext.tsx', /const \{ data, error \} = await supabase\.auth\.getSession\(\);/, 'const { data, error: _error } = await supabase.auth.getSession();');

// AdminDashboard.tsx
replaceInFile('src/pages/AdminDashboard.tsx', /LogOut, Calendar, Users, Settings, Plus, Image as ImageIcon, Upload, Trash2, Edit2/, 'LogOut, Calendar, Users, Settings, Plus, Image as ImageIcon');
replaceInFile('src/pages/AdminDashboard.tsx', /const \{ error \} = await supabase\.from\('events'\)\.insert/, 'const { error: _error } = await supabase.from(\'events\').insert');
replaceInFile('src/pages/AdminDashboard.tsx', /const \{ error \} = await supabase\.from\('sub_events'\)\.insert/, 'const { error: _error } = await supabase.from(\'sub_events\').insert');

// EventDetails.tsx
replaceInFile('src/pages/EventDetails.tsx', /Calendar, MapPin, Share2, ArrowRight/, 'Calendar, MapPin, Share2');

// Login.tsx
replaceInFile('src/pages/Login.tsx', /Hexagon, LogIn, AlertCircle/, 'LogIn, AlertCircle');
replaceInFile('src/pages/Login.tsx', /const \{ data, error: authError \} = await supabase\.auth\.signUp/, 'const { data: _data, error: authError } = await supabase.auth.signUp');

// Registration.tsx
replaceInFile('src/pages/Registration.tsx', /CheckCircle2, AlertCircle, Calendar, MapPin/, 'AlertCircle, MapPin');

// StudentDashboard.tsx
replaceInFile('src/pages/StudentDashboard.tsx', /User, Calendar, XCircle, Download/, 'User, Calendar, XCircle');

console.log('Fixes applied successfully!');
