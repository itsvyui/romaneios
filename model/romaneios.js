const mongo = require('mongoose');

const Romaneio = new mongo.Schema({
    nome: String,
    endereco: String,
    cidade: String,
    bairro: String
});

module.exports = mongo.model("Romaneio", Romaneio);