const bd = require('../model/bd');
const Romaneio = require('../model/romaneios');

module.exports = {

    cadastrar(req, res)  {
        console.log(req.body);
        const {nome, cidade, endereco, bairro} = req.body;

        console.log(nome, cidade, endereco, bairro);

        const novoRomaneio = new Romaneio({
            nome: nome.toString(),
            cidade: cidade.toString(),
            endereco: endereco.toString(),
            bairro: bairro.toString()
        });

        bd.connect()
            .then(() => {
                console.log('conectado ao bd');
                novoRomaneio.save()
                    .then((rom)=>{
                        return res.status(200).json({message: 'Romaneio cadastrado com sucesso.'});
                    })
                    .catch((e)=>{
                        return res.status(400).json({message: 'Erro ao cadastrar novo romaneio.'});
                    });
            })
            .catch((e)=>{
                return res.status(400).json({message: 'Erro ao conectar ao banco de dados.'});
            })
    }, // fim do cadastar

    editar(req, res) {
        const romaneio = req.body;
        console.log(romaneio);
        const id = JSON.parse(romaneio.id).id;

        console.log(id);

        bd.connect()
            .then(()=>{
                console.log('editando' + id);
                Romaneio.findById(id)
                .then(rom => {
                    rom.nome = romaneio.nome.toString();
                    rom.cidade = romaneio.cidade.toString();
                    rom.endereco = romaneio.endereco.toString();
                    rom.bairro = romaneio.bairro.toString();

                    rom.save()
                        .then(() => {
                            console.log('romaneio editado');
                            return res.status(200).json({message: 'Romaneio editado com sucesso.'});
                        })
                        .catch((e)=>{
                            return res.status(400).json({message: 'Erro ao editar romaneio.'});
                        });
                })
                .catch((e) => {
                    return res.status(400).json({message: 'Erro ao editar o romaneio 2.'});
                });
            })
            .catch((e)=>{
                return res.status(400).json({message: 'Erro ao conectar ao banco de dados.'});
            })
        
    }, // fim do editar

    deletar(req, res) {
        const romaneio = req.body;
        console.log(romaneio);
        const id = romaneio.id;

        console.log(id);

        bd.connect()
            .then(()=>{
                Romaneio.findById(id)
                .then( rom => {
                    rom.deleteOne()
                        .then(()=>{
                            return res.status(200).json({message: 'Romaneio deletado com sucesso.'});
                        })
                        .catch((e)=>{
                            return res.status(400).json({message: 'Erro ao deletar romaneio'});
                        })
                })
                .catch((e) => {
                    return res.status(400).json({message: 'Erro ao deletar o romaneio 2.'});
                });
            })
            .catch((e)=>{
                return res.status(400).json({message: 'Erro ao conectar ao banco de dados.'});
            })   
    }, // fim do deletar

    getRomaneios(req, res) {
        bd.connect()
            .then(()=> {
                console.log('conectado ao banco');
                Romaneio.find()
                    .then((roms) => {
                        console.log(roms);
                        return res.status(200).json({romaneios: roms, message: 'ok'});
                    })
                    .catch(e => {
                        return res.status(400).json({message: 'Erro ao listar'});
                    });
            })
            .catch((e)=> {
                return res.status(400).json({message: 'Erro ao conectar ao banco de dados.'});
            })
    }, // fim do get Romaneios

    getRomaneiosById(req, res) {
        bd.connect()
            .then(()=>{
                console.log('tentando buscar por romaneios...');
                console.log(req.query.romIds);
                Romaneio.find({_id: {$in: req.query.romIds}})
                    .then(roms => {
                        console.log('romaneios encontrados por id');
                        console.log(roms);
                        return res.status(200).json({romaneios: roms, message:'ok'});
                    })
                    .catch(e => {
                        return res.status(400).json({message: 'Erro ao listar por Id'});
                    });
            })
            .catch((e)=> {
                return res.status(400).json({message: 'Erro ao conectar ao banco de dados.'});
            })
    }, // fim do get Romaneios by ID
}