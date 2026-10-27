import { up } from "../migration.js";

async function createDB() {
  // Таблица предметов
  await up(`
    CREATE TABLE IF NOT EXISTS item (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      properties JSONB NOT NULL,
      status TEXT NOT NULL,
      category_id INTEGER NOT NULL,
      expected_location_id INTEGER NOT NULL,
      actual_location_id INTEGER NOT NULL,

      FOREIGN KEY (category_id) REFERENCES category(id),
      FOREIGN KEY (expected_location_id) REFERENCES location(id),
      FOREIGN KEY (actual_location_id) REFERENCES location(id)
    );
  `);

  // Таблица категорий
  await up(`
    CREATE TABLE IF NOT EXISTS category (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      parent_id INTEGER,

      FOREIGN KEY (parent_id) REFERENCES category(id)
        ON DELETE SET NULL
    );
  `);

  // Таблица структур / зданий
  await up(`
    CREATE TABLE IF NOT EXISTS structure (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL
    );
  `);

  // Таблица этажей
  await up(`
    CREATE TABLE IF NOT EXISTS floor (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      structure_id INTEGER NOT NULL,

      FOREIGN KEY (structure_id) REFERENCES structure(id)
        ON DELETE CASCADE
    );
  `);

  // Таблица комнат
  await up(`
    CREATE TABLE IF NOT EXISTS room (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      floor_id INTEGER NOT NULL,

      FOREIGN KEY (floor_id) REFERENCES floor(id)
        ON DELETE CASCADE
    );
  `);

  // Таблица мест
  await up(`
    CREATE TABLE IF NOT EXISTS place (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      room_id INTEGER NOT NULL,

      FOREIGN KEY (room_id) REFERENCES room(id)
        ON DELETE CASCADE
    );
  `);

  // Таблица локаций
  await up(`
    CREATE TABLE IF NOT EXISTS location (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      is_deleted boolean,
      name TEXT NOT NULL,
      place_id INTEGER NOT NULL,

      FOREIGN KEY (place_id) REFERENCES place(id)
        ON DELETE CASCADE
    );
  `);
}

export { createDB };
