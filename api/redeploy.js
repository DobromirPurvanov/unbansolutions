import { articleDates } from './blog-schedule.js';

// Извиква се от седмичния Vercel cron (vercel.json → crons). Публикуването на
// статиите е по дата при build, затова единственото, което кронът прави, е да
// пусне нов production build през deploy hook — но само докато има статия,
// публикувана наскоро или предстояща; после тихо спира да гори билдове.
const REBUILD_WINDOW_DAYS = 21;

export default async function handler(req, res) {
  const secret = process.env.CRON_SECRET;
  if (!secret || req.headers.authorization !== `Bearer ${secret}`) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const hookUrl = process.env.DEPLOY_HOOK_URL;
  if (!hookUrl || !hookUrl.startsWith('https://api.vercel.com/')) {
    console.error('[Redeploy] DEPLOY_HOOK_URL is missing or not a Vercel deploy hook.');
    return res.status(500).json({ error: 'DEPLOY_HOOK_URL is not configured' });
  }

  const today = new Date().toISOString().slice(0, 10);
  const windowStart = new Date(Date.now() - REBUILD_WINDOW_DAYS * 24 * 60 * 60 * 1000)
    .toISOString()
    .slice(0, 10);
  const needsRebuild = articleDates.some((date) => date > windowStart && date <= today);
  if (!needsRebuild) {
    return res.status(200).json({ triggered: false, reason: 'No recently published articles; nothing to roll out.' });
  }

  try {
    const response = await fetch(hookUrl, { method: 'POST' });
    if (!response.ok) {
      console.error('[Redeploy] Deploy hook responded with status', response.status);
      return res.status(502).json({ triggered: false, error: 'Deploy hook request failed' });
    }
    return res.status(200).json({ triggered: true });
  } catch (error) {
    console.error('[Redeploy] Deploy hook request threw:', error instanceof Error ? error.name : 'unknown_error');
    return res.status(502).json({ triggered: false, error: 'Deploy hook request failed' });
  }
}
