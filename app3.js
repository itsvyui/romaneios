const express = require('express');
const app = express();
const PDFDocument = require('pdfkit');
const fs = require('fs');
const bodyParser = require('body-parser');
const favicon = require('express-favicon');
const axios = require('axios');

// Use the body-parser middleware to parse form data
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
//app.use(favicon(__dirname + '/public/favicon.ico'));

const control = require('./controller/control');

let ano = 2023;
let semana = 15;
let romIds = [];

// Serve the index.html file
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

// servir o css e js
app.get('/public/styles.css', function(req, res) {
    res.setHeader('Content-Type', 'text/css');
    res.sendFile(__dirname + '/public/gpt.css');
});
app.get('/public/favicon.ico', function(req, res) {
  res.setHeader('Content-Type', 'image/x-icon');
  res.sendFile(__dirname + '/public/favicon.ico');
});
app.get('/index.js', function(req, res) {
    res.setHeader('Content-Type', 'text/css');
    res.sendFile(__dirname + '/index.js');
});

// servir as funcionalidades
app.post('/cadastrar', control.cadastrar);
app.post('/editar', control.editar);
app.post('/deletar', control.deletar);
app.get('/listarRomaneios', control.getRomaneios);
app.get('/listarRomaneiosById', control.getRomaneiosById);

// Handle POST request
app.post('/submit', (req, res) => {
  const items = req.body.items;
  console.log(items);
  res.send('Received data');
});

// Generate and download PDF file on click
app.post('/download', (req, res) => {
    console.log('/download chamado');

    const romaneios = req.body.items;
    ano = req.body.ano;
    semana = req.body.semana;
    console.log(romaneios);
    romIds.length = 0;
    romaneios.forEach(rom=>{
      rom = JSON.parse(rom);
      romIds.push(rom.id);
    })

    res.send('ok');

});

app.get('/gen-romaneio', (req,res)=>{
  const queryParams = {romIds: romIds};
  axios.get('http://localhost:3000/listarRomaneiosById', {params: queryParams})
    .then(response => {
      const roms = response.data.romaneios;
      console.log('/gen-pdf');
      console.log(roms);
      const fileName = 'romaneio sem' + semana + '.pdf'

      const doc = new PDFDocument();
      // Set the response headers to force a download of the PDF file
      res.set({
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'attachment; filename=' + fileName,
      });

      // add content to the PDF
      subtitle = '1 CAIXA BRINDE DE TUPPERWARE'
      roms.forEach(rom => {
        console.log('assinatura');
        console.log(rom);
        title = 'SEM ' + semana + "/" + ano + " - " + rom.cidade.toUpperCase();
        doc.font('Helvetica-Bold').fontSize(25).text(title, {lineGap: 20});
        doc.font('Helvetica-Bold').fontSize(20).text(subtitle, {underline: true, lineGap: 15});
        doc.font('Helvetica').fontSize(16).text(rom.nome, {lineGap: 10});
        doc.font('Helvetica').fontSize(16).text(rom.endereco, {lineGap: 10});
        doc.font('Helvetica').fontSize(16).text(rom.bairro, {lineGap: 10});
        doc.font('Helvetica').fontSize(16).text('Recebido por : _______________________________', {lineGap: 10});
        doc.font('Helvetica').fontSize(16).text('Assinatura : _________________________________', {lineGap: 10});
        doc.addPage();
      });
      for (var i=0; i < roms.length; i++){
        rom = roms[i];
        console.log('normal');
        console.log(rom);
        title = 'SEM ' + semana + "/" + ano + " - " + rom.cidade.toUpperCase();
        doc.font('Helvetica-Bold').fontSize(25).text(title, {lineGap: 15});
        doc.font('Helvetica-Bold').fontSize(20).text(subtitle, {underline: true, lineGap: 15});
        doc.font('Helvetica').fontSize(16).text(rom.nome, {lineGap: 10});
        doc.font('Helvetica').fontSize(16).text(rom.endereco, {lineGap: 10});
        doc.font('Helvetica').fontSize(16).text(rom.bairro, {lineGap: 30});

        if(i%2==0 && i>0 && i<roms.length-1){
          doc.addPage();
        }
      }

      doc.pipe(res);
      doc.end();

    })
    .catch(e=>console.log(e));

/*
  // Create a new PDF document
  const doc = new PDFDocument();

  // Set the response headers to force a download of the PDF file
  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', 'attachment; filename=example.pdf');

  console.log('/download get chamado');

  doc.font('Helvetica-Bold').fontSize(25).text('batata', {lineGap: 15});

  doc.pipe(res);

  // Finalize the PDF document and end the response
  doc.end();
*/
});

app.get('/gen-pdf', (req,res)=>{
  axios.get('http://localhost:3000/listarRomaneios')
    .then(response => {
      const roms = response.data.romaneios;
      console.log('/gen-pdf');
      console.log(roms);
      const fileName = 'romaneio sem' + semana + '.pdf'

      const doc = new PDFDocument();
      // Set the response headers to force a download of the PDF file
      res.set({
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'attachment; filename=' + fileName,
      });

      // add content to the PDF
      subtitle = '1 CAIXA BRINDE DE TUPPERWARE'
      roms.forEach(rom => {
        console.log('assinatura');
        console.log(rom);
        title = 'SEM ' + semana + "/" + ano + " - " + rom.cidade.toUpperCase();
        doc.font('Helvetica-Bold').fontSize(25).text(title, {lineGap: 20});
        doc.font('Helvetica-Bold').fontSize(20).text(subtitle, {underline: true, lineGap: 15});
        doc.font('Helvetica').fontSize(16).text(rom.nome, {lineGap: 10});
        doc.font('Helvetica').fontSize(16).text(rom.endereco, {lineGap: 10});
        doc.font('Helvetica').fontSize(16).text(rom.bairro, {lineGap: 10});
        doc.font('Helvetica').fontSize(16).text('Recebido por : _______________________________', {lineGap: 10});
        doc.font('Helvetica').fontSize(16).text('Assinatura : _________________________________', {lineGap: 10});
        doc.text('assinar');
        doc.addPage();
      });
      for (var i=0; i < roms.length; i++){
        rom = roms[i];
        console.log('normal');
        console.log(rom);
        title = 'SEM ' + semana + "/" + ano + " - " + rom.cidade.toUpperCase();
        doc.font('Helvetica-Bold').fontSize(25).text(title, {lineGap: 15});
        doc.font('Helvetica-Bold').fontSize(20).text(subtitle, {underline: true, lineGap: 15});
        doc.font('Helvetica').fontSize(16).text(rom.nome, {lineGap: 10});
        doc.font('Helvetica').fontSize(16).text(rom.endereco, {lineGap: 10});
        doc.font('Helvetica').fontSize(16).text(rom.bairro, {lineGap: 30});
        doc.text('normal');

        if(i%3==0 && i>0 && i<roms.length-1){
          doc.addPage();
        }
      }

      doc.pipe(res);
      doc.end();

    })
    .catch(e=>console.log(e));

/*
  // Create a new PDF document
  const doc = new PDFDocument();

  // Set the response headers to force a download of the PDF file
  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', 'attachment; filename=example.pdf');

  console.log('/download get chamado');

  doc.font('Helvetica-Bold').fontSize(25).text('batata', {lineGap: 15});

  doc.pipe(res);

  // Finalize the PDF document and end the response
  doc.end();
*/
});

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});

