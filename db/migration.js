// Импортируем наш класс для работы с SQLite
import Linker from "./sqlite.js";

// Функция выполняет SQL-запрос
// Например, SQL для создания таблицы
async function exec(sql) {
  // Проверяем, что sql действительно является строкой
  // и что строка не пустая
  if (typeof sql !== "string" || sql.trim().length === 0) {
    // Если проверка не пройдена — останавливаем выполнение
    // и создаём ошибку
    throw new Error("This migration failed the validation");
  }

  // Здесь позже будет храниться подключение к базе данных
  let linker;

  try {
    // Создаём объект для работы с базой данных
    // Файл database.db будет использоваться как SQLite-база
    linker = new Linker("./database.db");

    // Подключаемся к базе данных
    // await ждёт, пока подключение завершится
    await linker.connect();

    // Выполняем переданный SQL-запрос
    // Результат работы run() возвращаем из функции
    return await linker.run(sql);
  } catch (err) {
    // Если на любом этапе произошла ошибка
    // выводим её в консоль.
    console.log(err);

    // Затем создаём свою ошибку с понятным сообщением.
    throw new Error("This migration is failed. Try with another sql.");
  } finally {
    // Этот блок выполняется в любом случае
    // и при успехе, и при ошибке.
    // Здесь закрываем соединение с базой данных
    // чтобы оно не оставалось открытым
    await linker.close();
  }
}
// Применяет миграцию: выполняет SQL-запрос
async function up(sql) {
  await exec(sql);
}
// Откатывает миграцию: выполняет SQL-запрос
async function down(sql) {
  await exec(sql);
}
// Экспортируем функции
export { up, down };
