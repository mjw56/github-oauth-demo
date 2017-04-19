const http = require('http');
const https = require('https');
const express = require('express');
const app = express();

const port = 1337;

app.use(express.static(__dirname));

const server = http.createServer(app);

app.get("/callback", function(req, res) {
  const data = JSON.stringify({
    client_id: process.env.OAUTH_DEMO_GITHUB_CLIENT_ID,
    client_secret: process.env.OAUTH_DEMO_GITHUB_CLIENT_SECRET,
    code: req.query.code
  });

  const options = {
    host: "github.com",
    port: "443",
    path: "/login/oauth/access_token",
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Content-Length": Buffer.byteLength(data)
    }
  };

  const post_req = https.request(
    options,
    function(resp) {
      resp.setEncoding("utf8");
      resp.on("data", function(chunk) {
        console.log("GitHub API Response: " + chunk);
        res.send(
          `<html><body><script>window.opener.postMessage("${chunk}", '*')</script></body></html>`
        );
      });
    },
    function(err) {
      console.log("error", err);
    }
  );

  post_req.write(data);
  post_req.end();
});

server.listen(port, () => {
  console.log(`==> Server is listening on port ${port}`);
  console.log(`==> 🌎  Go to localhost:${port}`);
});
