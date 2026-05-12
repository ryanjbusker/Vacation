const { connectLambda, getStore } = require("@netlify/blobs");

exports.handler = async (event) => {
  connectLambda(event);

  const store = getStore("activity-likes");

  // GET all likes
  if (event.httpMethod === "GET") {
    const likes = (await store.get("likes", { type: "json" })) || {};

    return {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(likes),
    };
  }

  // POST new like
  if (event.httpMethod === "POST") {
    try {
      const { activityId } = JSON.parse(event.body);

      if (!activityId) {
        return {
          statusCode: 400,
          body: JSON.stringify({ error: "Missing activityId" }),
        };
      }

      const likes =
        (await store.get("likes", { type: "json" })) || {};

      likes[activityId] = (likes[activityId] || 0) + 1;

      await store.setJSON("likes", likes);

      return {
        statusCode: 200,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          success: true,
          likes: likes[activityId],
        }),
      };
    } catch (err) {
      return {
        statusCode: 500,
        body: JSON.stringify({
          error: err.message,
        }),
      };
    }
  }

  return {
    statusCode: 405,
    body: "Method Not Allowed",
  };
};
