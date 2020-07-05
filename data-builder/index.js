const fetch = require('node-fetch');
const cheerio = require('cheerio');
const fs = require('fs');
const csv = require('fast-csv');

async function main() {
    const colectivos = await getColectivos();
    for (let colectivo of colectivos) {

        const csvStream = csv.format({ headers: true });
        const writeStream = fs.createWriteStream('./data/' + colectivo.idLinea + '-' + colectivo.name + '.csv');
        csvStream.pipe(writeStream);

        console.log('Starting ', colectivo.name);

        try {
            const getCallesRetry = retry.bind(null, getCalles.bind(null, colectivo));
            const calles = await getCallesRetry();
            for (let calle of calles) {

                const getInterseccionRetry = retry.bind(null, getInterseccion.bind(null, colectivo, calle));
                const intersecciones = await getInterseccionRetry();
                for (let interseccion of intersecciones) {
                    const getParadasXCallesRetry = retry.bind(null, getParadasXCalles.bind(null, colectivo, calle, interseccion));
                    const paradas = await getParadasXCallesRetry();

                    paradas.forEach((data) => {

                        const dto = {
                            colectivo_value: colectivo.value,
                            colectivo_idLinea: colectivo.idLinea,
                            colectivo_identidad: colectivo.identidad,
                            colectivo_name: colectivo.name,
                            calle_id: calle.id,
                            calle_name: calle.nombre,
                            calle_city: calle.ciudad,
                            interseccion_id: interseccion.id,
                            interseccion_name: interseccion.nombre,
                            interseccion_city: interseccion.ciudad,
                            parada: data.parada,
                            bandera: data.bandera,
                            destino: data.destino,
                            destinoRaw: data.destinoRaw
                        }

                        csvStream.write(dto);

                    });


                }
            }
            csvStream.end();

        } catch (e) {
            console.error('Error en la linea', colectivo.idLinea, colectivo.name, e);
        }
    }
}

async function getColectivos() {
    const response = await fetch('http://www.etr.gov.ar/cuandollega.php#');
    const html = await response.text();

    const $ = cheerio.load(html);
    const optionLineas = $('#linea option');

    const colectivos = [];

    optionLineas.each(function () {
        const value = $(this).attr('value');
        const idLinea = $(this).attr('idlinea');
        const identidad = $(this).attr('identidad');
        const name = $(this).text();
        if (value !== '0') {
            colectivos.push({
                value, idLinea, identidad, name
            });
        }
    })

    return colectivos;
}

async function getCalles(colectivo) {
    const params = new URLSearchParams();
    params.append('accion', 'getCalle');
    params.append('idLinea', colectivo.idLinea);
    const response = await fetch('http://www.etr.gov.ar/ajax/cuandollega/getInfoParadas.php', {
        method: 'POST',
        body: params
    });
    if (!response.ok) {
        console.log(response.statusText)
    }
    const calles = await response.json();
    return calles.map(calle => {
        const i = calle.desc.lastIndexOf('-');
        const nombre = calle.desc.substring(0, i).trim();
        const ciudad = calle.desc.substring(i + 1).trim();
        return {
            id: calle.id,
            nombre,
            ciudad
        }
    });
}

async function getInterseccion(colectivo, calle) {
    const params = new URLSearchParams();
    params.append('accion', 'getInterseccion');
    params.append('idLinea', colectivo.idLinea);
    params.append('idCalle', calle.id);
    const response = await fetch('http://www.etr.gov.ar/ajax/cuandollega/getInfoParadas.php', {
        method: 'POST',
        body: params
    });
    const calles = await response.json();
    return calles.map(calle => {
        const i = calle.desc.lastIndexOf('-');
        const nombre = calle.desc.substring(0, i).trim();
        const ciudad = calle.desc.substring(i + 1).trim();
        return {
            id: calle.id,
            nombre,
            ciudad
        }
    });
}

async function getParadasXCalles(colectivo, calle, interseccion) {
    const params = new URLSearchParams();
    params.append('accion', 'getParadasXCalles');
    params.append('idLinea', colectivo.idLinea);
    params.append('txtLinea', colectivo.name);
    params.append('idCalle', calle.id);
    params.append('idInt', interseccion.id);
    const response = await fetch('http://www.etr.gov.ar/ajax/cuandollega/getInfoParadas.php', {
        method: 'POST',
        body: params
    });
    const html = await response.text();
    const $ = cheerio.load(html);
    const paradas = $('table tr');

    let lastID = null;
    const paradasResult = [];
    paradas.each((i, e) => {
        if ($(e).find('td').length === 2) {

            let parada = $(e).find('td').eq(0).text().trim();
            const destinoRaw = $(e).find('td').eq(1).text().trim();

            const bandera = destinoRaw.replace(colectivo.name, '').split('>')[0].trim();
            const destino = destinoRaw.split('>')[1].trim();

            if (parada.length) {
                lastID = parada;
            } else {
                parada = lastID;
            }
            paradasResult.push({
                parada, bandera, destino, destinoRaw
            });
        }
    })
    return paradasResult;

}

async function retry(fn) {
    try {
        const resp = await fn();
        return resp;
    } catch (e) {
        const resp = await fn();
        return resp;
    }
}

main();
