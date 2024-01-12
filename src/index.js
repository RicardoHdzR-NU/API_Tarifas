//Modulos necesarios para el funcionamiento
const express = require('express')
const app = express();
const morgan=require('morgan');
const sql = require('mssql')
const bodyParser = require('body-parser');
const axios = require('axios');

app.use(morgan('dev'));
app.use(express.urlencoded({extended:false}));
app.use(bodyParser.json());

//configuración para la conexión con la base de datos
const sqlConfig = {
    user: `sa`,
    password: `unity`,
    database: `nusis`,
    server: `192.168.1.187`,
    options: {
        cryptoCredentialsDetails: {
            minVersion: 'TLSv1'
        },
        trustServerCertificate: true
    },
}

//accesando a la ruta raíz abre el archivo
app.get("/", (req, res) => {
    res.sendFile(__dirname + '/index.html');
})

//función que llama al SP spGetTarifasAutoAPI
async function queryTarifas(apiData){
    try{
        let pool = await sql.connect(sqlConfig)

        let result = await pool.request()
                .input('MotivoVisita', apiData.MotivoVisita)
                .input('Producto', apiData.Producto)
                .input('EstadoEntrada', apiData.EstadoEntrada)
                .input('Vigencia', apiData.Vigencia)
                .input('TipoPlaca', apiData.TipoPlaca)
                .input('PaisVenta', apiData.PaisPlaca)
                .input('bAsistenciaPlus', apiData.bAsistenciaPlus)
                .input('EdadConductor', apiData.EdadConductor)
                .input('bRemolque', apiData.bRemolque)
                .input('AnioVehiculo', apiData.AnioVehiculo)
                .execute('spGetTarifasAutoAPI')
            
            console.log(result)
    
        return result;
    }catch(error){
        console.log('Error: ', error)
    }
    
}

//Función que llama al SP sp_digitalpermit
async function queryCodigo(apiData){
    try{
        let pool = await sql.connect(sqlConfig)

        let result = await pool.request()
                .input('Agente', apiData.Agente)
                .input('Subagente', apiData.Subagente)
                .execute('sp_digitalpermit')
            
            console.log(result)
    
        return result.recordset;
    }catch(error){
        console.log('Error: ', error)
    }
    
}

//request que recibe los datos para enviar al SP spGetTarifasAutoAPI
app.post('/tarifas', async (req, res) => {
    //console.log(req.body)
    
    const motivoVisita =  parseInt(req.body.motivoVisita);
    const producto = req.body.producto;
    const estadoEntrada = req.body.estadoEntrada;
    const vigencia = parseInt(req.body.vigencia);
    const tipoPlaca = req.body.tipoPlaca;
    const paisPlaca = req.body.paisPlaca;
    const bAsistenciaPlus = parseInt(req.body.bAsistenciaPlus);
    const edadConductor = parseInt(req.body.edadConductor);
    const bRemolque = parseInt(req.body.bRemolque);
    const anioVehiculo = parseInt(req.body.anioVehiculo);

    const apiData = {
        MotivoVisita: motivoVisita,
        Producto: producto,
        EstadoEntrada: estadoEntrada,
        Vigencia: vigencia,
        TipoPlaca: tipoPlaca,
        PaisPlaca: paisPlaca,
        bAsistenciaPlus: bAsistenciaPlus,
        EdadConductor: edadConductor,
        bRemolque: bRemolque,
        AnioVehiculo: anioVehiculo,
    }
    //console.log(typeof apiData.MotivoVisita)
    const result = await queryTarifas(apiData)

    res.json(result)

})

//request que recibe los datos para enviar al SP spGetTarifasAutoAPI
app.post("/XCodeDigital", async (req, res) => {
    //const agente =  req.body.Agente
    //const subagente = req.body.subagente
    console.log(req)
    const noTransaction = req.body.NoTransaction
    const usuario = req.body.Usuario
    const password = req.body.Password
    const identifyCode = req.body.IdentifyCode
    const sku = req.body.Sku
    const telefono = req.body.Telefono
    const email = req.body.Email

    /*const apiData = {
        Agente: agente,
        Subagente: subagente,
    }

    const result = await queryCodigo(apiData)*/

    const postData = {
        Usuario: usuario,
        Password: password,
        identifyCode: identifyCode,
        Sku: parseInt(sku),
        Telefono: parseInt(telefono),
        Email: email,
        NoTransactionCte: parseInt(noTransaction),
    }

    const response = await axios.post('https://www.nuicservices.com/National/proc_WsAutoDigital.asp', {
        body: {
            postData
        }
    })
    console.log(response.data)
    res.json(response.data)

})

//inicialización del servidor
const port = process.env.PORT || 8080;
app.listen(port, () => console.log(`Listening on port ${port}...`));