const fs = require('fs');
const path = require('path');
const csv = require('fast-csv');

function getCSV() {
    return fs.readdirSync('./data')
}

async function readCSV(file) {
    const rows = []
    const stream = fs.createReadStream(path.resolve(__dirname, 'data', file)).pipe(csv.parse({ headers: true }));
    for await (const row of stream) {
        rows.push(row);
    }
    return rows;
}

async function loadFiles() {
    let allData = [];
    const files = getCSV();
    for (let file of files) {
        const data = await readCSV(file);
        allData = [...allData, ...data];
    }
    const data = JSON.stringify(allData);
    const writer = fs.createWriteStream('data.json');
    writer.write(data);
    writer.end();
    writer.on('close', () => {
        process.exit();
    })
    return allData;
}

loadFiles()