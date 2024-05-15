const express = require('express');
const bodyParser = require('body-parser');
const pdf = require('html-pdf');
const path = require('path');

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.post('/', (req, res) => {
    const { header, footer, htmlContent, options } = req.body;

    // Merge options with headers and footers
    const pdfOptions = {
        ...options,
        header: {
            height: '45mm',
            contents: header || '<div style="text-align: center;">Default Header</div>'
        },
        footer: {
            height: '28mm',
            contents: footer || '<span style="color: #444;">{{page}}</span>/<span>{{pages}}</span>'
        }
    };

    pdf.create(htmlContent, pdfOptions).toFile(path.join(__dirname, 'test.pdf'), (err, result) => {
        if (err) {
            return res.status(500).send({ error: 'Failed to generate PDF' });
        }   
        res.send({ filePath: result.filename });
    });
});

app.listen(3000, () => {
    console.log(`Server is running at http://localhost:3000`);
});
