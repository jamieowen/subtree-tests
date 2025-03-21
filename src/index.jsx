import { getUrlBoolean } from '@/helpers/UrlParam';
import { createRoot } from 'react-dom/client';
import VConsole from 'vconsole';
import { App } from './App.jsx';
import '@/services/ResizeService';
import '@/services/ContextMenuService';
import '@/libs/gsap';

import '@/styles/app/index.sass';
import '@/styles/core.sass';
import '@/styles/shared.sass';
import 'virtual:uno.css';

if (getUrlBoolean('console', false)) {
  const vConsole = new VConsole();
}

const rootContainer = document.getElementById('root');
const root = createRoot(rootContainer);

root.render(<App />);

// ContextMenuService.disable();
