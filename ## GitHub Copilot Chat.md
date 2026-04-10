## GitHub Copilot Chat

- Extension: 0.42.3 (prod)
- VS Code: 1.114.0 (e7fb5e96c0730b9deb70b33781f98e2f35975036)
- OS: darwin 25.4.0 arm64
- GitHub Account: sanskar-yadav-git

## Network

User Settings:
```json
  "http.systemCertificatesNode": false,
  "github.copilot.advanced.debug.useElectronFetcher": true,
  "github.copilot.advanced.debug.useNodeFetcher": false,
  "github.copilot.advanced.debug.useNodeFetchFetcher": true
```

Connecting to https://api.github.com:
- DNS ipv4 Lookup: 20.207.73.85 (2 ms)
- DNS ipv6 Lookup: ::ffff:20.207.73.85 (2 ms)
- Proxy URL: None (1 ms)
- Electron fetch (configured): Error (3036 ms): Error: net::ERR_CERT_AUTHORITY_INVALID
	at SimpleURLLoaderWrapper.<anonymous> (node:electron/js2c/utility_init:2:10684)
	at SimpleURLLoaderWrapper.emit (node:events:519:28)
  {"is_request_error":true,"network_process_crashed":false}
- Node.js https: Error (30 ms): Error: self signed certificate in certificate chain
	at TLSSocket.onConnectSecure (node:_tls_wrap:1697:34)
	at TLSSocket.emit (node:events:519:28)
	at TLSSocket._finishInit (node:_tls_wrap:1095:8)
	at ssl.onhandshakedone (node:_tls_wrap:881:12)
- Node.js fetch: Error (41 ms): TypeError: fetch failed
	at node:internal/deps/undici/undici:14902:13
	at process.processTicksAndRejections (node:internal/process/task_queues:103:5)
	at async t._fetch (/Users/sanskar/.vscode/extensions/github.copilot-chat-0.42.3/dist/extension.js:5171:5228)
	at async t.fetch (/Users/sanskar/.vscode/extensions/github.copilot-chat-0.42.3/dist/extension.js:5171:4540)
	at async u (/Users/sanskar/.vscode/extensions/github.copilot-chat-0.42.3/dist/extension.js:5203:186)
	at async yg._executeContributedCommand (file:///Applications/Visual%20Studio%20Code.app/Contents/Resources/app/out/vs/workbench/api/node/extensionHostProcess.js:501:48675)
  Error: self signed certificate in certificate chain
  	at TLSSocket.onConnectSecure (node:_tls_wrap:1697:34)
  	at TLSSocket.emit (node:events:519:28)
  	at TLSSocket._finishInit (node:_tls_wrap:1095:8)
  	at ssl.onhandshakedone (node:_tls_wrap:881:12)

Connecting to https://api.githubcopilot.com/_ping:
- DNS ipv4 Lookup: 140.82.113.21 (58 ms)
- DNS ipv6 Lookup: ::ffff:140.82.113.21 (2 ms)
- Proxy URL: None (1 ms)
- Electron fetch (configured): Error (126 ms): Error: net::ERR_CERT_AUTHORITY_INVALID
	at SimpleURLLoaderWrapper.<anonymous> (node:electron/js2c/utility_init:2:10684)
	at SimpleURLLoaderWrapper.emit (node:events:519:28)
  {"is_request_error":true,"network_process_crashed":false}
- Node.js https: Error (1034 ms): Error: self signed certificate in certificate chain
	at TLSSocket.onConnectSecure (node:_tls_wrap:1697:34)
	at TLSSocket.emit (node:events:519:28)
	at TLSSocket._finishInit (node:_tls_wrap:1095:8)
	at ssl.onhandshakedone (node:_tls_wrap:881:12)
- Node.js fetch: Error (37 ms): TypeError: fetch failed
	at node:internal/deps/undici/undici:14902:13
	at process.processTicksAndRejections (node:internal/process/task_queues:103:5)
	at async t._fetch (/Users/sanskar/.vscode/extensions/github.copilot-chat-0.42.3/dist/extension.js:5171:5228)
	at async t.fetch (/Users/sanskar/.vscode/extensions/github.copilot-chat-0.42.3/dist/extension.js:5171:4540)
	at async u (/Users/sanskar/.vscode/extensions/github.copilot-chat-0.42.3/dist/extension.js:5203:186)
	at async yg._executeContributedCommand (file:///Applications/Visual%20Studio%20Code.app/Contents/Resources/app/out/vs/workbench/api/node/extensionHostProcess.js:501:48675)
  Error: self signed certificate in certificate chain
  	at TLSSocket.onConnectSecure (node:_tls_wrap:1697:34)
  	at TLSSocket.emit (node:events:519:28)
  	at TLSSocket._finishInit (node:_tls_wrap:1095:8)
  	at ssl.onhandshakedone (node:_tls_wrap:881:12)

Connecting to https://copilot-proxy.githubusercontent.com/_ping:
- DNS ipv4 Lookup: 4.225.11.192 (40 ms)
- DNS ipv6 Lookup: ::ffff:4.225.11.192 (2 ms)
- Proxy URL: None (1 ms)
- Electron fetch (configured): Error (1149 ms): Error: net::ERR_CERT_AUTHORITY_INVALID
	at SimpleURLLoaderWrapper.<anonymous> (node:electron/js2c/utility_init:2:10684)
	at SimpleURLLoaderWrapper.emit (node:events:519:28)
  {"is_request_error":true,"network_process_crashed":false}
- Node.js https: Error (2028 ms): Error: self signed certificate in certificate chain
	at TLSSocket.onConnectSecure (node:_tls_wrap:1697:34)
	at TLSSocket.emit (node:events:519:28)
	at TLSSocket._finishInit (node:_tls_wrap:1095:8)
	at ssl.onhandshakedone (node:_tls_wrap:881:12)
- Node.js fetch: Error (7044 ms): TypeError: fetch failed
	at node:internal/deps/undici/undici:14902:13
	at process.processTicksAndRejections (node:internal/process/task_queues:103:5)
	at async t._fetch (/Users/sanskar/.vscode/extensions/github.copilot-chat-0.42.3/dist/extension.js:5171:5228)
	at async t.fetch (/Users/sanskar/.vscode/extensions/github.copilot-chat-0.42.3/dist/extension.js:5171:4540)
	at async u (/Users/sanskar/.vscode/extensions/github.copilot-chat-0.42.3/dist/extension.js:5203:186)
	at async yg._executeContributedCommand (file:///Applications/Visual%20Studio%20Code.app/Contents/Resources/app/out/vs/workbench/api/node/extensionHostProcess.js:501:48675)
  Error: self signed certificate in certificate chain
  	at TLSSocket.onConnectSecure (node:_tls_wrap:1697:34)
  	at TLSSocket.emit (node:events:519:28)
  	at TLSSocket._finishInit (node:_tls_wrap:1095:8)
  	at ssl.onhandshakedone (node:_tls_wrap:881:12)

Connecting to https://mobile.events.data.microsoft.com: Error (99 ms): Error: net::ERR_CERT_AUTHORITY_INVALID
	at SimpleURLLoaderWrapper.<anonymous> (node:electron/js2c/utility_init:2:10684)
	at SimpleURLLoaderWrapper.emit (node:events:519:28)
  {"is_request_error":true,"network_process_crashed":false}
Connecting to https://dc.services.visualstudio.com: Error (1342 ms): Error: net::ERR_CERT_AUTHORITY_INVALID
	at SimpleURLLoaderWrapper.<anonymous> (node:electron/js2c/utility_init:2:10684)
	at SimpleURLLoaderWrapper.emit (node:events:519:28)
  {"is_request_error":true,"network_process_crashed":false}
Connecting to https://copilot-telemetry.githubusercontent.com/_ping: timed out after 10 seconds
Connecting to https://copilot-telemetry.githubusercontent.com/_ping: Error (31 ms): Error: self signed certificate in certificate chain
	at TLSSocket.onConnectSecure (node:_tls_wrap:1697:34)
	at TLSSocket.emit (node:events:519:28)
	at TLSSocket._finishInit (node:_tls_wrap:1095:8)
	at ssl.onhandshakedone (node:_tls_wrap:881:12)
Connecting to https://default.exp-tas.com: Error (2218 ms): Error: self signed certificate in certificate chain
	at TLSSocket.onConnectSecure (node:_tls_wrap:1697:34)
	at TLSSocket.emit (node:events:519:28)
	at TLSSocket._finishInit (node:_tls_wrap:1095:8)
	at ssl.onhandshakedone (node:_tls_wrap:881:12)

Number of system certificates: 3

## Documentation

In corporate networks: [Troubleshooting firewall settings for GitHub Copilot](https://docs.github.com/en/copilot/troubleshooting-github-copilot/troubleshooting-firewall-settings-for-github-copilot).