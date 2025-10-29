// ratingCalculator.js — small helper to compute overall rating
// Exports calculateOverallRating(ratings) which receives an object of numeric ratings


function calculateOverallRating(ratings) {
// Expects ratings to be an object like { teaching: 4.5, marks: 4, quiz: 4.2, communication: 4.7 }
if (!ratings || typeof ratings !== 'object') return 0;


const values = Object.values(ratings).filter(v => typeof v === 'number' && !isNaN(v));
if (values.length === 0) return 0;


const sum = values.reduce((acc, v) => acc + v, 0);
const avg = sum / values.length;
// Round to 2 decimals for neatness
return Math.round(avg * 100) / 100;
}


module.exports = { calculateOverallRating };