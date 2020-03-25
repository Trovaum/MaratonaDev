const express = require("express")
const server = express()

//configurar o servidor para arquivos extras
server.use(express.static('public'))

//habilitar body do formulario
server.use(express.urlencoded({ extended: true }))

//configurando template engine
const nunjucks = require('nunjucks')
nunjucks.configure('./', {
    express: server
})

//configurar a conexão com o banco de dados
const Pool = require('pg').Pool
const db = new Pool({
    user: 'postgres',
    password: '0000',
    host: 'localhost',
    port: 5432,
    database: 'doe'
})


//configurar a pagina
server.get('/', function(req, res) {
    db.query('SELECT * FROM donors', function(err, results) {
        if (err) return res.send('Erro ao buscar no banco de dados!!')
        const donors = results.rows
        return res.render('index.html', { donors })
    })
})

server.post('/', function(req, res) {
    //pegar dados do formulario
    const name = req.body.name
    const email = req.body.email
    const blood = req.body.blood

    if (name == "" || email == "" || blood == "") {
        res.send('Todos os campos são obrigatórios.')
        return res.redirect('/')
    }

    //coloca valor dentro do bd
    const query = `INSERT INTO donors ("name", "email", "blood")
                    VALUES ($1, $2, $3)`

    const values = [name, email, blood]

    db.query(query, values, function(err) {
        if (err) return res.send('Erro ao salvar no banco de dados.')
        return res.redirect('/')
    })
    
})

// ligar o servidor na porta 3000
server.listen(3000, function() {
    console.log('Servidor iniciado!')
})