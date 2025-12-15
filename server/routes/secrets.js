const express = require('express');
const router = express.Router();
const { SecretManagerServiceClient } = require('@google-cloud/secret-manager');

const client = new SecretManagerServiceClient();
const projectId = process.env.GCP_PROJECT_ID;

// Middleware to check authentication
const isAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  res.status(401).json({ error: 'Not authenticated' });
};

// List all secrets for the user
router.get('/', isAuthenticated, async (req, res) => {
  try {
    const [secrets] = await client.listSecrets({
      parent: `projects/${projectId}`,
    });

    const userSecrets = secrets.map(secret => ({
      name: secret.name.split('/').pop(),
      created: secret.createTime,
      labels: secret.labels || {}
    }));

    res.json(userSecrets);
  } catch (error) {
    console.error('Error listing secrets:', error);
    res.status(500).json({ error: 'Failed to list secrets' });
  }
});

// Get a specific secret value
router.get('/:secretName', isAuthenticated, async (req, res) => {
  try {
    const { secretName } = req.params;
    const [version] = await client.accessSecretVersion({
      name: `projects/${projectId}/secrets/${secretName}/versions/latest`,
    });

    const payload = version.payload.data.toString('utf8');

    res.json({
      name: secretName,
      value: payload,
      version: version.name.split('/').pop()
    });
  } catch (error) {
    console.error('Error accessing secret:', error);
    res.status(500).json({ error: 'Failed to access secret' });
  }
});

// Create a new secret
router.post('/', isAuthenticated, async (req, res) => {
  try {
    const { name, value, labels } = req.body;

    if (!name || !value) {
      return res.status(400).json({ error: 'Name and value are required' });
    }

    // Create secret
    const [secret] = await client.createSecret({
      parent: `projects/${projectId}`,
      secretId: name,
      secret: {
        replication: {
          automatic: {},
        },
        labels: {
          ...labels,
          owner: req.user.email.replace(/[@.]/g, '_')
        }
      },
    });

    // Add secret version
    const [version] = await client.addSecretVersion({
      parent: secret.name,
      payload: {
        data: Buffer.from(value, 'utf8'),
      },
    });

    res.status(201).json({
      name: name,
      created: true,
      version: version.name.split('/').pop()
    });
  } catch (error) {
    console.error('Error creating secret:', error);
    res.status(500).json({ error: 'Failed to create secret' });
  }
});

// Update a secret (add new version)
router.put('/:secretName', isAuthenticated, async (req, res) => {
  try {
    const { secretName } = req.params;
    const { value } = req.body;

    if (!value) {
      return res.status(400).json({ error: 'Value is required' });
    }

    const [version] = await client.addSecretVersion({
      parent: `projects/${projectId}/secrets/${secretName}`,
      payload: {
        data: Buffer.from(value, 'utf8'),
      },
    });

    res.json({
      name: secretName,
      updated: true,
      version: version.name.split('/').pop()
    });
  } catch (error) {
    console.error('Error updating secret:', error);
    res.status(500).json({ error: 'Failed to update secret' });
  }
});

// Delete a secret
router.delete('/:secretName', isAuthenticated, async (req, res) => {
  try {
    const { secretName } = req.params;

    await client.deleteSecret({
      name: `projects/${projectId}/secrets/${secretName}`,
    });

    res.json({
      name: secretName,
      deleted: true
    });
  } catch (error) {
    console.error('Error deleting secret:', error);
    res.status(500).json({ error: 'Failed to delete secret' });
  }
});

module.exports = router;
