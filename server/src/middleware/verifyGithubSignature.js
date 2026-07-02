import crypto from 'crypto';

export const verifyGithubSignature = (req, res, next) => {
  const signature = req.headers['x-hub-signature-256'];

  if (!signature || !req.rawBody) {
    return res.status(401).json({ message: 'Missing signature' });
  }

  const expected =
    'sha256=' +
    crypto.createHmac('sha256', process.env.GITHUB_WEBHOOK_SECRET).update(req.rawBody).digest('hex');

  const sigBuffer = Buffer.from(signature);
  const expectedBuffer = Buffer.from(expected);

  const isValid =
    sigBuffer.length === expectedBuffer.length && crypto.timingSafeEqual(sigBuffer, expectedBuffer);

  if (!isValid) {
    return res.status(401).json({ message: 'Invalid signature' });
  }

  next();
};