const fs = require('fs');
fetch('https://social-media-manager-nld2.onrender.com/assets/index-8SJKgS6z.js?bypass=' + Math.random())
  .then(r => r.text())
  .then(js => {
    const idx = js.indexOf('/api/oauth/connect');
    console.log("CONNECT CODE:");
    console.log(js.substring(idx - 100, idx + 100));
  });
