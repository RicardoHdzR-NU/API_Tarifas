const express = require('express')
const app = express();
const morgan=require('morgan');
const sql = require('mssql')

app.use(morgan('dev'));
app.use(express.urlencoded({extended:false}));
app.use(express.json());

/*const Pool = require('pg').Pool;

const pgPool = new Pool({
    user: 'me',
    host: 'localhost',
    database: 'nuapi',
    password: 'password',
    port: 5432,
});*/

const sqlConfig = {
    user: process.env.DB_USER,
    password: process.env.DB_PWD,
    database: process.env.DB_NAME,
    server: process.env.DB_SERVER,
  }

app.get('/', (req, res) => {    
    res.json(
        {
            "Title": "Hola mundo"
        }
    );
})

async function queryTarifas(apiData){
    let pool = await sql.connect(config)

    let result = await pool.request()
            .input('MotivoVisita', apiData.motivoVisita)
            .input('Producto', apiData.producto)
            .input('EstadoEntrada', apiData.estadoEntrada)
            .input('Vigencia', apiData.vigencia)
            .input('TipoPlaca', apiData.tipoPlaca)
            .input('PaisPlaca', apiData.paisPlaca)
            .input('bAsistenciaPlus', apiData.bAsistenciaPlus)
            .input('EdadConductor', apiData.edadConductor)
            .input('bRemolque', apiData.bRemolque)
            .input('AnioVehiculo', apiData.anioVehiculo)
            .output('Prima', 0)
            .output('Derecho', 0)
            .output('Asistencia', 0)
            .output('AsistenciaPlus', 0)
            .output('ExtraPrimaCobrar', 0)
            .output('ProductoAumento', 0)
            .output('PrimaOfrecer', 0)
            .output('DerechoOfrecer', 0)
            .output('DiferenciaProductoOfrecer', 0)
            .output('DiferenciaProductoOfrecerDerecho', 0)
            .execute('spGetTarifasAutoAPI')
        
        console.log(result)

    return result;
}

app.post('/tarifas', async (req, res) => {
    const motivoVisita = req.body.body.motivoVisita;
    const producto = req.body.body.producto;
    const estadoEntrada = req.body.body.estadoEntrada;
    const vigencia = req.body.body.vigencia;
    const tipoPlaca = req.body.body.tipoPlaca;
    const paisPlaca = req.body.body.paisPlaca;
    const bAsistenciaPlus = req.body.body.bAsistenciaPlus;
    const edadConductor = req.body.body.edadConductor;
    const bRemolque = req.body.body.bRemolque;
    const anioVehiculo = req.body.body.anioVehiculo;

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

    const result = await queryTarifas(apiData)

    res.json(result)

    /*pgPool.query(`CALL spGetTarifasAutoAPI(${apiData})`, (err, result) => {
        if(err){
            console.error('Error en query: ', err);
        }else {
            console.log(result.rows)
            res.json(result.rows);
        }
    })*/
})

const port = process.env.PORT || 8080;
app.listen(port, () => console.log(`Listening on port ${port}...`));