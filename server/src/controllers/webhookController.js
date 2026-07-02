import Repository from '../models/Repository.js';
import { syncRepositoryData } from '../services/repositoryService.js';

const RELEVANT_EVENTS = ['push', 'pull_request', 'issues'];

export const handleGithubWebhook = async (req, res) => {
  const event = req.headers['x-github-event'];
  const payload = req.body;

  // GitHub also sends a "ping" event when the webhook is first created — safe to ignore.
  if (!RELEVANT_EVENTS.includes(event)) {
    return res.status(200).json({ message: `Event '${event}' ignored` });
  }

  const fullName = payload.repository?.full_name;
  if (!fullName) {
    return res.status(200).json({ message: 'No repository in payload' });
  }

  // Acknowledge immediately — GitHub expects a fast response and will retry/flag
  // deliveries that time out. Actual sync work happens after responding.
  res.status(200).json({ message: 'Webhook received' });

  try {
    const [owner, repo] = fullName.split('/');
    // Same repo could be connected by more than one DevPulse user
    const repositories = await Repository.find({ fullName }).populate('owner');

    await Promise.all(
      repositories.map((repository) => {
        const user = repository.owner;
        if (!user?.githubToken) return Promise.resolve();
        return syncRepositoryData(repository._id, user.githubToken, owner, repo);
      })
    );

    console.log(`Webhook sync complete: ${fullName} (${event}), ${repositories.length} repo(s) updated`);
  } catch (error) {
    console.error(`Webhook sync failed for ${fullName}:`, error.message);
  }
};