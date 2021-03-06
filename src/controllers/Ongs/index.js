const {
    BAD_REQUEST, 
    INTERNAL_SERVER_ERROR, 
    UNAUTHORIZED,
    NOT_FOUND,
} = require('http-status-codes');
const OngsService = require('../../services/Ongs');

module.exports = {
    async create(req, res){
        const {name, email, whatsapp, city, uf, password} = req.body;
        if(!name || !email || !whatsapp || !city || !uf || !password){
            return res.status(BAD_REQUEST).json({
                name: name ? undefined : "campo inválido!",
                email: email ? undefined : "campo inválido!",
                whatsapp: whatsapp ? undefined : "campo inválido!",
                city: city ? undefined : "campo inválido!",
                uf: uf ? undefined : "campo inválido!",
                password: password ? undefined : "campo inválido!"
            });
        }
        try{
            const [hex, iv,...rest] = password.split('=');
            if(!iv || !hex){
                return res.status(BAD_REQUEST).json({
                    error: "Não foi possível realizar o cadastro! Tente novamente!"
                });
            }
            return res.json({
                id: await OngsService.create({
                    name,
                    email: email.toLowerCase().replace(/\s+/g,''),
                    whatsapp,
                    city,
                    uf,
                    iv,
                    hex,
                }),
            });
        }catch(e){
            console.log(e);
            return res.status(INTERNAL_SERVER_ERROR).json({
                error: "Ocorreu um erro ao tentar realizar o cadastro!",
            });
        }
    },
    async listAll(req, res){
        const defaultMaxValue = 10;
        let {offset = 0, max = defaultMaxValue} = req.query;
        offset = new Number(offset).valueOf() || 0;
        max = new Number(max).valueOf() || defaultMaxValue;
        try{
            const {count, results} = res.json(await OngsService.listAll({offset, max}));
            res.header('X-Total-Count', count);
            res.json(results);
        }catch(e){
            console.log(e);
            return res.status(INTERNAL_SERVER_ERROR).json({
                error: "Ocorreu um erro ao tentar listar as ONGS cadastradas!",
            });
        }
    },
};