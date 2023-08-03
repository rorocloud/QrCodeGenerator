# QrCodeGenerator

This javascript generates HTML code that gives access to a form transforming a URL into a QR Code.
The QR Code is generated using the qrserver API.

## Usage
HTML
```
<div class="container">
  <div id="my_qr_code"></div>
</div>
```
Javascript
```
const my_qr_code = new QrCodeGenerator("my_qr_code");
```
