const fs = require('fs')
const path = require('path')
const express = require('express')
const bp = require('body-parser')
const MarkdownIt = require('markdown-it'),
	md = new MarkdownIt();
const app = express()

app.use(express.static('publi'))
app.use(bp.json())
app.use(bp.urlencoded({
	extended: true
}))

app.listen(3000, () => {
	console.log("Escuchando en: http://localhost:3000")
})

app.get('/', (request, response) => {
	response.sendFile(path.resolve(__dirname, 'index.html'))
})

// Ruta para obtener la lista de archivos Markdown disponibles
app.get('/files', (req, res) => {
    fs.readdir(path.join(__dirname, 'publi', 'MarkDownFiles'), (err, files) => {
        if (err) {
            res.status(500).json({ error: 'Error al leer los archivos' });
        } else {
            const markdownFiles = files.filter(file => file.endsWith('.md'));
            res.json({ files: markdownFiles });
        }
    });
});

app.post('/viewFile', (req, res) => {
    const filename = req.body.filename;
    const filePath = path.join(__dirname, 'publi', 'MarkDownFiles', filename);
	console.log('mk a ver: ' + filename);

    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            res.status(500).json({ error: 'Error al leer el archivo Markdown' });
			console.log("mal");
        } else {
			console.log(data);
            const htmlText = md.render(data);
            res.setHeader('Content-Type', 'application/json');
			console.log('enviado a fetch:', htmlText);
            res.end(JSON.stringify({ text: htmlText }));
        }
    });
});

app.post('/deleteFile', (req, res) => {
	
    const filename = req.body.filename;
    const filePath = path.join(__dirname, 'publi', 'MarkDownFiles', filename)
	console.log('mk a eliminar: ', filename);
	
    fs.unlink(filePath, (err) => {
        if (err) {
            res.status(500).json({ error: 'Error al eliminar el archivo' });
        } else {
            res.json({ message: 'Archivo eliminado correctamente' });
        }
    });
});

app.post('/saveFile', (req, res) => {
    const { title, markdownText } = req.body;
    const fileName = title + '.md'; // Asegurar un nombre de archivo válido

    const filePath = path.join(__dirname, 'publi', 'MarkDownFiles', fileName);

    fs.writeFile(filePath, markdownText, 'utf8', (err) => {
        if (err) {
            res.status(500).json({ error: 'Error al crear el archivo Markdown' });
        } else {
            res.json({ message: 'Archivo Markdown creado correctamente' });
        }
    });
});