var CACHE='playground-v2';
var FILES=["./", "index.html", "math.html", "maze.html", "hidden.html", "memory.html", "manifest.webmanifest", "icon-192.png", "icon-512.png"];
self.addEventListener('install',function(e){e.waitUntil(caches.open(CACHE).then(function(c){return c.addAll(FILES);}).then(function(){return self.skipWaiting();}));});
self.addEventListener('activate',function(e){e.waitUntil(caches.keys().then(function(ks){return Promise.all(ks.filter(function(k){return k!==CACHE;}).map(function(k){return caches.delete(k);}));}).then(function(){return self.clients.claim();}));});
self.addEventListener('fetch',function(e){var req=e.request;if(req.method!=='GET')return;var url=new URL(req.url);
  if(url.origin===location.origin){
    // 앱 파일: 인터넷이 되면 새 버전을 받아 저장, 안 되면 저장본 사용
    e.respondWith(fetch(req).then(function(res){var cp=res.clone();caches.open(CACHE).then(function(c){c.put(req,cp);});return res;}).catch(function(){return caches.match(req,{ignoreSearch:true}).then(function(r){return r||caches.match('index.html');});}));
  }else if(url.hostname.indexOf('fonts.g')===0){
    e.respondWith(caches.match(req).then(function(r){return r||fetch(req).then(function(res){var cp=res.clone();caches.open(CACHE).then(function(c){c.put(req,cp);});return res;});}));
  }
});
