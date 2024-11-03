const { MongoClient } = require('mongodb');
// Replace the uri string with your MongoDB deployment's connection string.
const REMOTE_URI =
   'mongodb+srv://virariefertdev:qwery007@clusterpractice.yjfwl.mongodb.net/?retryWrites=true&writeConcern=majority';
const LOCAL_URI = 'mongodb://root:example@localhost:27017';

const client = new MongoClient(LOCAL_URI);
async function run() {
   try {
      await client.connect();
      console.log('Connection was successful!');
      //выбор бд
      const db = client.db('sample_guides');
      // выбор коллекции бд
      const coll = db.collection('planets');

      //объект с происковыми запросами
      const queries = {
         hasRings: { hasRings: true },
         hasNoRingsAndArMainAtmosphere: {
            hasRings: false,
            mainAtmosphere: 'Ar',
         },
         orderFromSunGt4: { orderFromSun: { $gt: 4 } },
         surfaceTemperatureCMeanLt15: {'surfaceTemperatureC.mean': {$lt:15}}
      }
      //-----------------------------------------------------------------------------
      //FIND ALL DOCUMENTS
      // получить все документы в коллекции planets
      //возвращает курсор и по этому курсору можно провести итерацию
      //не загружая в память всех элементов массива
      /* const cursor = coll.find(); */

      //------------------------------------------------------------------------------
      //FIND DOCUMENTS WHERE hasRings: true
      /* const cursor = coll.find(queries.hasRings); */

      //------------------------------------------------------------------------------
      //FIND DOCUMENTS WHERE hasRings:false AND mainAtmosphere:'Ar'(поиск в массиве)
      /* const cursor = coll.find(queries.hasNoRingsAndArMainAtmosphere); */
      
      //------------------------------------------------------------------------------
      //FIND DOCUMENTS WHERE orderFromSun > 4
      /* const cursor = coll.find(queries.orderFromSunGt4); */

      //------------------------------------------------------------------------------
      //FIND DOCUMENTS WHERE surfaceTemperatureC.mean < 15
      const cursor = coll.find(queries.surfaceTemperatureCMeanLt15);

      //чтобы посчитать сколько документов соответстует определенному запросу
      console.log('Quantity of documents found', await coll.countDocuments(queries.surfaceTemperatureCMeanLt15));

      //------------------------------------------------------------------------------
      //устаревший способ итерации по документам
      /* await cursor.forEach((planet => {console.log(planet.name);})); */
      //итерация по документам
      for await (planet of cursor) {
         console.log(planet);
      }
   } catch (error) {
      console.dir(error);
   } finally {
      // Ensures that the client will close when you finish/error
      //нужно всегда закрывать подключение к базе
      await client.close();
      console.log('Connection to DB was closed.');
   }
}
run();
