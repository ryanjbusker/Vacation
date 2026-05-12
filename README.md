# Busker vacation likes

Upload these files to the root of your Netlify site/repository:

- `busker-vacation.html`
- `package.json`
- `netlify/functions/likes.js`

How it works:

- The HTML adds a thumbs-up button and visible count to every activity card.
- `/.netlify/functions/likes` stores shared counts in Netlify Blobs.
- Each browser remembers which activities it already liked using `localStorage`, which prevents casual duplicate votes.

After deploying on Netlify, open the page and click a like button. Everyone visiting the site should see the updated shared count.
