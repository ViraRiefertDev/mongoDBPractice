const { MongoClient } = require('mongodb');

const URI = 'mongodb://root:example@localhost:27017';
const client = new MongoClient(URI);

async function run() {
   try {
      await client.connect();
      console.log('Connection was successful!');

      //Выбор базы данных и коллекции
      const db = client.db('restoran');
      const coll = db.collection('drink');

      // Добавление нескольких документов (напитков) в коллекцию 'drink'
      /* await coll.insertMany([
         { name: "Whiskey", price: 25, strength: 40, volume: 500, type: "alcoholic" },
         { name: "Beer", price: 5, strength: 5, volume: 500, type: "alcoholic" },
         { name: "Vodka", price: 15, strength: 40, volume: 500, type: "alcoholic" },
         { name: "Orange Juice", price: 3, strength: 0, volume: 500, type: "non-alcoholic" },
         { name: "Lemonade", price: 4, strength: 0, volume: 500, type: "non-alcoholic" },
         { name: "Tequila", price: 30, strength: 45, volume: 500, type: "alcoholic" }
      ]); */
      // Объект с поисковыми запросами
      const queries = {
         mostExpensive: coll.find().sort({ price: -1 }).limit(1),
         topThreeCheapest: coll.find().sort({ price: 1 }).limit(3),
         strongestDrink: coll
            .find()
            .sort({ strength: -1 })
            .limit(1)
            .project({ name: 1, _id: 0 }),
      };

      // Вывод результатов для каждого запроса

      // Самый дорогой напиток
      console.log('Самый дорогой напиток:');
      for await (const drink of queries.mostExpensive) {
         console.log(drink);
      }
      // Топ 3 самых дешевых напитка
      console.log('Топ 3 самых дешевых напитка:');
      for await (const drink of queries.topThreeCheapest) {
         console.log(drink);
      }

      // Название самого крепкого напитка
      console.log('Самый крепкий напиток:');
      for await (const drink of queries.strongestDrink) {
         console.log(drink);
      }
      
   } catch (error) {
      console.dir(error);
   } finally {
      //Закрытие подключения к бд
      await client.close();
      console.log('Connection to DB was closed.');
   }
}
run();
