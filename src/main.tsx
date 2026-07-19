import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import App from './App.tsx'

if (window.location.pathname === '/contact') {
  const url = new URL(window.location.href)
  const allowedIssues = new Set(['banned', 'suspended', 'shadowban', 'restricted', 'hacked', 'other'])
  const allowedPlatforms = new Set(['instagram', 'tiktok', 'youtube', 'x', 'facebook', 'linkedin', 'other'])
  const issue = url.searchParams.get('issue') || ''
  const platform = url.searchParams.get('platform') || ''

  if (url.searchParams.has('issue') || url.searchParams.has('platform')) {
    url.searchParams.delete('issue')
    url.searchParams.delete('platform')
    const historyState = window.history.state || {}
    const routeState = typeof historyState.usr === 'object' && historyState.usr !== null ? historyState.usr : {}
    window.history.replaceState({
      ...historyState,
      usr: {
        ...routeState,
        ...(allowedIssues.has(issue) ? { issue } : {}),
        ...(allowedPlatforms.has(platform) ? { platform } : {}),
      },
    }, '', `${url.pathname}${url.search}${url.hash}`)
  }
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>,
)
