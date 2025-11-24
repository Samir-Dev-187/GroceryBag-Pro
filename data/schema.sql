PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS suppliers (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  supplier_id TEXT UNIQUE NOT NULL,
  first_name TEXT,
  last_name TEXT,
  company TEXT,
  phone TEXT,
  email TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS customers (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  customer_id TEXT UNIQUE NOT NULL,
  first_name TEXT,
  last_name TEXT,
  phone TEXT,
  email TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS purchases (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  purchase_id TEXT UNIQUE NOT NULL,
  supplier_id TEXT NOT NULL,
  date DATE,
  total_amount REAL,
  data_json TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (supplier_id) REFERENCES suppliers(supplier_id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS sales (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  sale_id TEXT UNIQUE NOT NULL,
  customer_id TEXT NOT NULL,
  date DATE,
  total_amount REAL,
  data_json TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (customer_id) REFERENCES customers(customer_id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS transactions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  tx_id TEXT UNIQUE NOT NULL,
  related_type TEXT,
  related_id TEXT,
  amount REAL,
  note TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  username TEXT UNIQUE,
  password_example TEXT,
  role TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
