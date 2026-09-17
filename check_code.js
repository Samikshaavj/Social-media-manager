const fs = require('fs');
fetch('https://social-media-manager-nld2.onrender.com/accounts')
  .then(r => r.text())
  .then(html => {
    const m = html.match(/src="(\/assets\/index-[^"]+\.js)"/);
    if(m) {
      fetch('https://social-media-manager-nld2.onrender.com' + m[1])
        .then(r => r.text())
        .then(js => {
          const idx = js.indexOf('/api/oauth/connect/');
          if (idx !== -1) {
             console.log("SURROUNDING CODE:");
             console.log(js.substring(idx - 100, idx + 100));
          } else {
             console.log("NOT FOUND IN LIVE BUNDLE");
          }
        });
    }
  });
