const http = require('http');

const server = http.createServer((req, res) => {
  // HTTP durum kodu ve içerik tipi HTML olarak ayarlandı
  res.writeHead(200, {'Content-Type': 'text/html'});
  
  // HTML sayfası gönderiliyor
  res.end(`
    <!DOCTYPE html>
    <html lang="tr">
      <head>
        <meta charset="UTF-8">
        <title>Ödev Testi</title>
      </head>
      <body>
        <h1>Merhaba, bu ödev testi!</h1>
        <p>Node.js ile çalışan basit bir web sunucusu.</p>
      </body>
    </html>
  `);
});

server.listen(3000, () => {
  console.log('Sunucu http://localhost:3000 adresinde çalışıyor');
});