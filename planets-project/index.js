// bringing in the node package management packets

const { parse } = require('csv-parse');
const fs = require('fs');


// create array to hold the data results
const habitablePlanets = [];

//jquery on() function = attach one or more event handlers for the selected elements and child elements in the DOM tree.
// createReadStream open up a file/stream and read the data present in it

// function that filters out only those planets that are habitable
function isHabitablePlanet(planet) {
    return planet['koi_disposition'] === 'CONFIRMED' 
    // measure for the amount of light/energy the planet gets from their sun
    && planet['koi_insol'] > 0.36
    && planet['koi_insol'] < 1.11
    // checking if the planet is less than 1.6x size of earth
    && planet['koi_prad'] < 1.6;
}



fs.createReadStream('kepler_data.csv')

/* csv -->(createReadStream) --> readable.pipe(writeable) -->(parse function) --> series of proccessed rows(array of js objects)
    anything that starts with '#' is treated as a comment
    columns set to true set each row in csv file as a js object with key value pairs, rather than as just an array of values in row */

// pipe first and then on event listeners after. Order is important

.pipe(parse({
    comment: '#',
    columns: true,
}))

.on('data', (data) => {
    if (isHabitablePlanet(data)) {
        habitablePlanets.push(data);
    }
})

//  'on' event that the data has an error
.on('error', (err) => {
    console.log(err);
})
// output
.on('end', () => {
    console.log(habitablePlanets.map((planet) => {
        return planet['kepler_name'];
    }))
    console.log(`${habitablePlanets.length} habitable planets found!`);
})