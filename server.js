const http = require('http');

const fs = require('fs');

const path = require('path');

const hostname = '127.0.0.1';

const port = 8000;

// Création du serveur HTTP
const server = http.createServer (function handler (request, response) {

    let filePath = '.' + request.url;

    //console.log (filePath);
    
    // Vérifie que le chemin existe sinon on renvoi vers le fichier index.html
    if (filePath === './') {
    
        filePath = './index.html';
    }

    // Récupère l'extension du fichier en minuscule
    const nameFiles = String (path.extname (filePath)).toLowerCase ();

    //console.log (nameFiles);
    
    let contentType = 'text/html';

    // Vérifie le type de fichier
    switch (nameFiles) {
    
        case '.css':
    
            contentType = 'text/css';

            filePath = './style.css';
    
        break;
        
        case '.js':
            
            contentType = 'text/javascript';

            filePath = './script.js';
            
        break;
    }

    // Lit le fichier
    fs.readFile (filePath, function (error, content) {
    
        // Vérifie s'il y a une erreur
        if (error) {
    
            // Vérifie si le fichier ou dossier n'existe pas
            if (error.code === 'ENOENT') {
    
                response.writeHead (404, { 'Content-Type': 'text/html' });
    
                response.end ('404 Not Found');
    
            // Retourne une erreur serveur
            } else {
    
                response.writeHead (500);
    
                response.end ('Internal Server Error: ' + error.code);
            }
        // Sinon trouve le fichier
        } else {
    
            response.writeHead (200, { 'Content-Type': contentType });
    
            response.end (content, 'utf-8');
        }
    });
});

// Ecoute du serveur sur le port 8000
server.listen (port, hostname, () => {
   
    console.log (`Server running at http://${hostname}:${port}/`);
});