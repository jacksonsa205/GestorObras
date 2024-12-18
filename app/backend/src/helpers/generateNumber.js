//gerador de codigo para senha nova
const random = function(start, end) {
    return Math.floor(Math.random() * (end - start + 1) + start);
};
const NUMERO_RANDOM = random(123456, 987654).toString();

module.exports = NUMERO_RANDOM;