const { getStore } = require('@netlify/blobs');

const headers = {
  'Content-Type': 'application/json',
  'Cache-Control': 'no-store'
};

exports.handler = async (event) => {
  const store = getStore('busker-vacation-likes');

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 204, headers, body: '' };
  }

  try {
    const likes = (await store.get('activity-likes', { type: 'json' })) || {};

    if (event.httpMethod === 'GET') {
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ likes })
      };
    }

    if (event.httpMethod === 'POST') {
      const body = JSON.parse(event.body || '{}');
      const id = String(body.id || '').trim();

      if (!id || !/^[a-z0-9-]{1,120}$/.test(id)) {
        return {
          statusCode: 400,
          headers,
          body: JSON.stringify({ error: 'A valid activity id is required.' })
        };
      }

      likes[id] = (Number(likes[id]) || 0) + 1;
      await store.setJSON('activity-likes', likes);

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ id, count: likes[id], likes })
      };
    }

    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method not allowed.' })
    };
  } catch (error) {
    console.error(error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'Unable to process likes right now.' })
    };
  }
};
