const express = require('express')
const app = express();
const morgan=require('morgan');
const sql = require('mssql')
const bodyParser = require('body-parser');

app.use(morgan('dev'));
app.use(express.urlencoded({extended:false}));
app.use(bodyParser.json());

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

app.get("/", (req, res) => {
    res.sendFile(__dirname + '/index.html');
})

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

app.post('/tarifas', async (req, res) => {
    console.log(req.body)
    
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

const port = process.env.PORT || 8080;
app.listen(port, () => console.log(`Listening on port ${port}...`));