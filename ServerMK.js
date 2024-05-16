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