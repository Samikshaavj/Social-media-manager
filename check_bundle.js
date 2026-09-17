const fs = require('fs');
fetch('https://social-media-manager-nld2.onrender.com/accounts')
  .then(r => r.text())
  .then(html => {
    const m = html.match(/src="(\/assets\/index-[^"]+\.js)"/);
    if(m) {
      console.log('Found bundle:', m[1]);
      fetch('https://social-media-manager-nld2.onrender.com' + m[1])
        .then(r => r.text())
        .then(js => {
          console.log('Bundle length:', js.length);
          console.log('Has localhost:5000?', js.includes('localhost:5000'));
          console.log('Has relative url?', js.includes('/api/oauth/connect/'));
        });
    } else {
      console.log('No bundle found in HTML');
    }
  });
