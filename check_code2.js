const fs = require('fs');
fetch('https://social-media-manager-nld2.onrender.com/accounts?bypass=' + Math.random())
  .then(r => r.text())
  .then(html => {
    const m = html.match(/src="(\/assets\/index-[^"]+\.js)"/);
    if(m) {
      console.log('Found bundle:', m[1]);
      fetch('https://social-media-manager-nld2.onrender.com' + m[1] + '?bypass=' + Math.random())
        .then(r => r.text())
        .then(js => {
          console.log('Has localhost:5000?', js.includes('localhost:5000'));
        });
    }
  });
