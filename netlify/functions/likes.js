const { connectLambda, getStore } = require("@netlify/blobs");

exports.handler = async (event) => {
  connectLambda(event);

  const store = getStore("busker-vacation-likes");
  await store.setJSON("activity-likes", {});

  return {
    statusCode: 200,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ success: true, message: "Likes reset" }),
  };
};

// const { connectLambda, getStore } = require("@netlify/blobs");

// const headers = {
//   "Content-Type": "application/json",
//   "Cache-Control": "no-store",
// };

// exports.handler = async (event) => {
//   connectLambda(event);

//   const store = getStore("busker-vacation-likes");

//   try {
//     const likes = (await store.get("activity-likes", { type: "json" })) || {};

//     if (event.httpMethod === "GET") {
//       return {
//         statusCode: 200,
//         headers,
//         body: JSON.stringify({ likes }),
//       };
//     }

//     if (event.httpMethod === "POST") {
//       const body = JSON.parse(event.body || "{}");
//       const id = String(body.id || "").trim();

//       if (!id) {
//         return {
//           statusCode: 400,
//           headers,
//           body: JSON.stringify({ error: "Missing activity id" }),
//         };
//       }

//       likes[id] = (Number(likes[id]) || 0) + 1;

//       await store.setJSON("activity-likes", likes);

//       return {
//         statusCode: 200,
//         headers,
//         body: JSON.stringify({
//           id,
//           count: likes[id],
//           likes,
//         }),
//       };
//     }

//     return {
//       statusCode: 405,
//       headers,
//       body: JSON.stringify({ error: "Method not allowed" }),
//     };
//   } catch (error) {
//     return {
//       statusCode: 500,
//       headers,
//       body: JSON.stringify({ error: error.message }),
//     };
//   }
// };
