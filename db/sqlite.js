import sqlite from "sqlite3";

// Класс-обёртка для работы с SQLite
// Внутри класса мы создаём подключение и методы
// для выполнения SQL-запросов
export default class sqliteLinker {
  constructor(filename) {
    // Сохраняем имя файла базы данных
    this.filename = filename;

    // Здесь позже будет храниться подключение к БД
    this.db = null;
  }

  // Подключение к базе данных
  async connect() {
    // Создаём новое подключение к SQLite
    this.db = new sqlite.Database(this.filename, function (err) {
      // Если произошла ошибка подключения
      // выводим её в консоль
      if (err) {
        console.log(JSON.stringify(err));
        return;
      }

      // Если ошибки нет сообщаем, что БД запущена
      console.log(`Database is started... on the ${this.filename}`);
    });

    // Возвращаем созданное подключение
    return this.db;
  }

  // Выполняет SQL-команду
  async run(sql, params = []) {
    // sqlite3 использует callback, поэтому оборачиваем
    // его в Promise, чтобы можно было использовать await
    const result = await new Promise(function (resolve, reject) {
      // Выполняем SQL-запрос.
      this.db.run(sql, params, function (err) {
        // Если SQL-запрос завершился ошибкой
        // передаём ошибку в reject()
        if (err) {
          console.log(err);
          reject(err);
          return;
        }

        // Если всё успешно — возвращаем информацию
        // о последней добавленной записи и количестве изменений
        resolve({
          lastId: this.lastID,
          changes: this.changes,
        });
      });
    });

    return result;
  }

  // Получает ОДНУ запись из базы данных
  // Например: SELECT * FROM users WHERE id = ?
  async get(sql, params = []) {
    const result = await new Promise(function (resolve, reject) {
      // Выполняем SQL-запрос.
      this.db.get(sql, params, function (err, row) {
        // Если произошла ошибка — отклоняем Promise
        if (err) {
          console.log(err);
          reject(err);
          return;
        }

        // Если всё успешно — возвращаем найденную строку
        resolve(row);
      });
    });

    return result;
  }

  // Получает НЕСКОЛЬКО записей из базы данных
  // Например: SELECT * FROM users
  async all(sql, params = []) {
    const result = await new Promise(function (resolve, reject) {
      // Выполняем SQL-запрос
      this.db.all(sql, params, function (err, rows) {
        // Если произошла ошибка — отклоняем Promise
        if (err) {
          console.log(err);
          reject(err);
          return;
        }

        // Если всё успешно — возвращаем массив строк
        resolve(rows);
      });
    });

    return result;
  }

  // Закрывает соединение с базой данных
  async close() {
    return new Promise(function (resolve, reject) {
      // Закрываем подключение.
      this.db.close(function (err) {
        // Если закрыть БД не удалось — возвращаем ошибку
        if (err) {
          console.log(err);
          reject(err);
          return;
        }

        // Если всё прошло успешно — завершаем Promise
        resolve();
      });
    });
  }
  createPlaceholders(arr){

    return arr.map(()=>'?').join(', ');
  }
  createSetBlock(properties){
    return Object.entries(properties).map(([key,value])=>{
    if(isEmpty(value)) return null;
    return `${key}=?`;
    })
    .filter
    (p=>p!==null)
    .join(`, `);
  }
}
