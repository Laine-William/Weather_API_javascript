const https = require ('https');

// Paramètres de l'API OpenMeteo avec les coordonnées du Havre
const link_api = "https://api.open-meteo.com/v1/forecast?";
const latitude = "latitude=49,4938";
const longitude = "longitude=0,1077";
const hourly = "hourly=wind_speed_10m,wind_direction_10m,wind_gusts_10m";
const timezone = "timezone=auto";
const forecast_days = "forecast_days=1";

/**
 * Fonction getDatasOpenMeteo qui permet de récupérer les données météo de l'API OpenMeteo
 * @param {*} callback 
 */
function getDatasOpenMeteo (callback) {

    // Récupération des données de l'API OpenMeteo
    https.get (link_api
               + latitude + "&"
               + longitude + "&"
               + hourly + "&"
               + timezone + "&"
               + forecast_days,
    
    /**
     * Fonction qui récupère la réponse du statut
     * @param {*} response 
     */
    function (response) {

        // Réponse statut 200
        if (response.statusCode == 200) {

            let rawData = '';

            // Récupération des données
            response.on ('data',

            /**
             * Fonction qui ajoute les données de l'API OpenMeteo
             * @param {*} chunkData 
             */
            function (chunkData) {

                rawData += chunkData;
            });

            response.on ('end',

            function () {

                // Gère le traitement des données récupérées
                try {

                    const parsedData = JSON.parse (rawData);

                    //console.log (parsedData);

                    const hourlyData = parsedData.hourly;

                    //console.log (hourlyData);

                    let dataFound = false;
                    
                    const responseData = [];

                    // Récupération des données météo en fonction de l'heure
                    for (let i = 0; i < hourlyData.time.length; i++) {
                                
                        // Récupération des données pour une heure donnée
                        const time = hourlyData.time [i];
                        const hour = time.split ('T') [1];
                        const wind_speed = hourlyData.wind_speed_10m [i];
                        const wind_direction = hourlyData.wind_direction_10m [i] + ' ' + parsedData.hourly_units.wind_direction_10m;
                        const wind_gusts = hourlyData.wind_gusts_10m[i] + ' ' + parsedData.hourly_units.wind_gusts_10m;

                        let beaufort = 0;

                        // Détermine la force de Beaufort avec la vitesse du vent
                        switch (true) {

                            case (wind_speed < 1) :

                                beaufort = 0;

                            break;
                                
                            case (wind_speed < 6) :
                            
                                beaufort = 1;
                                
                            break;

                            case (wind_speed < 12) :

                                beaufort = 2;

                            break;

                            case (wind_speed < 20) :

                                beaufort = 3;

                            break;

                            case (wind_speed < 29) :

                                beaufort = 4;

                            break;

                            case (wind_speed < 39) :

                                beaufort = 5;

                            break;

                            case (wind_speed < 50) :

                                beaufort = 6;

                            break;

                            case (wind_speed < 62) :

                                beaufort = 7;

                            break;

                            case (wind_speed < 75) :

                                beaufort = 8;

                            break;

                            case (wind_speed < 89) :

                                beaufort = 9;

                            break;

                            case (wind_speed < 103) :

                                beaufort = 10;

                            break;

                            case (wind_speed < 118) :

                                beaufort = 11;

                            break;

                            default :

                                beaufort = 12;
                                 
                            break;
                        }

                        //console.log (beaufort);

                        // Ajout des données dans le tableau responseData pour les transmettre au serveur
                        responseData.push ({

                            hour: time.split ('T') [0],
                            time: hour,
                            wind_speed_10m: wind_speed + ' ' + parsedData.hourly_units.wind_speed_10m,
                            wind_direction_10m: wind_direction,
                            wind_gusts_10m: wind_gusts,
                            beaufort: beaufort
                        });

                        //console.log (responseData);    
                    
                        dataFound = true;
                    }

                    // Affiche un message s'il n'y a pas de données
                    if (! dataFound) {

                        console.log ('No data found');

                    } else {

                        callback (responseData);
                    }  
                // Attrape l'erreur des données récupérées
                } catch (error) {

                    console.error (error.message);
                }
            });
        };
    });
};

const http = require ('http');

const hostname = '127.0.0.1';

const port = 3000;

// Création du serveur HTTP
const server = http.createServer (function handler (request, response) {

    //console.log(`Request for ${request.url}`);

    // Headers, qui gère les CORS Origins avec une réponse HTTP (GET)
    const headers = {

        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': '*',
        'Access-Control-Allow-Methods': 'OPTIONS, GET',
        'Access-Control-Max-Age': 2592000, // 30 days
    };

    // Récupération des données de l'API OpenMeteo
    getDatasOpenMeteo (function (callback) {

        // Envoi des données au client
        response.writeHead (200, headers);

        // Envoi des données au client en format JSON
        response.write (JSON.stringify (callback));

        // Fin de la réponse du serveur
        response.end ();
    });
});

// Ecoute du serveur sur le port 3000
server.listen (port, hostname, () => {
   
    console.log (`API running at http://${hostname}:${port}/`);
});

module.exports = getDatasOpenMeteo;
