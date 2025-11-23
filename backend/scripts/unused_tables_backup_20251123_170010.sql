-- Backup of unused tables
-- Created: 20251123_170010
-- Source DB: C:\Users\USER\OneDrive\Desktop\GroceryBag Pro\backend\instance\grocerybag.db

CREATE TABLE alert (
	id INTEGER NOT NULL, 
	type VARCHAR(50), 
	message VARCHAR(500), 
	related_type VARCHAR(30), 
	related_id INTEGER, 
	resolved BOOLEAN, 
	created_at DATETIME, 
	PRIMARY KEY (id)
);
INSERT INTO 'alert' (id, type, message, related_type, related_id, resolved, created_at) VALUES (1, 'info', 'Test alert 1', 'other', NULL, 0, '2025-11-22 19:25:58.606688');
INSERT INTO 'alert' (id, type, message, related_type, related_id, resolved, created_at) VALUES (2, 'info', 'Test alert 2', 'other', NULL, 0, '2025-11-22 19:25:58.606697');
INSERT INTO 'alert' (id, type, message, related_type, related_id, resolved, created_at) VALUES (3, 'info', 'Test alert 3', 'other', NULL, 0, '2025-11-22 19:25:58.606702');
INSERT INTO 'alert' (id, type, message, related_type, related_id, resolved, created_at) VALUES (4, 'info', 'Test alert 4', 'other', NULL, 0, '2025-11-22 19:25:58.606706');
INSERT INTO 'alert' (id, type, message, related_type, related_id, resolved, created_at) VALUES (5, 'info', 'Test alert 5', 'other', NULL, 0, '2025-11-22 19:25:58.606710');

CREATE TABLE customer (
	id INTEGER NOT NULL, 
	uid VARCHAR(20), 
	name VARCHAR(120) NOT NULL, 
	phone VARCHAR(20), 
	address VARCHAR(250), 
	created_at DATETIME, 
	PRIMARY KEY (id), 
	UNIQUE (phone)
);
INSERT INTO 'customer' (id, uid, name, phone, address, created_at) VALUES (1, 'CU-0001', 'Demo Customer 1', '900100001', 'City 1', '2025-11-22 19:25:58.408557');
INSERT INTO 'customer' (id, uid, name, phone, address, created_at) VALUES (2, 'CU-0002', 'Demo Customer 2', '900100002', 'City 2', '2025-11-22 19:25:58.408566');
INSERT INTO 'customer' (id, uid, name, phone, address, created_at) VALUES (3, 'CU-0003', 'Demo Customer 3', '900100003', 'City 3', '2025-11-22 19:25:58.408570');
INSERT INTO 'customer' (id, uid, name, phone, address, created_at) VALUES (4, 'CU-0004', 'Demo Customer 4', '900100004', 'City 4', '2025-11-22 19:25:58.408574');
INSERT INTO 'customer' (id, uid, name, phone, address, created_at) VALUES (5, 'CU-0005', 'Demo Customer 5', '900100005', 'City 5', '2025-11-22 19:25:58.408577');
INSERT INTO 'customer' (id, uid, name, phone, address, created_at) VALUES (6, NULL, 'Quick Test Customer', '9123456789', 'Test Ave', '2025-11-22 19:31:00.899917');

CREATE TABLE purchase (
	id INTEGER NOT NULL, 
	supplier_id INTEGER NOT NULL, 
	bag_size VARCHAR(20) NOT NULL, 
	units INTEGER NOT NULL, 
	price_per_unit FLOAT NOT NULL, 
	total_amount FLOAT NOT NULL, 
	invoice_image VARCHAR(300), 
	date DATETIME, 
	PRIMARY KEY (id), 
	FOREIGN KEY(supplier_id) REFERENCES supplier (id)
);
INSERT INTO 'purchase' (id, supplier_id, bag_size, units, price_per_unit, total_amount, invoice_image, date) VALUES (1, 1, '10kg', 11, 51.0, 561.0, NULL, '2025-11-22 19:25:58.535003');
INSERT INTO 'purchase' (id, supplier_id, bag_size, units, price_per_unit, total_amount, invoice_image, date) VALUES (2, 2, '10kg', 12, 52.0, 624.0, NULL, '2025-11-22 19:25:58.540447');
INSERT INTO 'purchase' (id, supplier_id, bag_size, units, price_per_unit, total_amount, invoice_image, date) VALUES (3, 3, '10kg', 13, 53.0, 689.0, NULL, '2025-11-22 19:25:58.541971');
INSERT INTO 'purchase' (id, supplier_id, bag_size, units, price_per_unit, total_amount, invoice_image, date) VALUES (4, 4, '10kg', 14, 54.0, 756.0, NULL, '2025-11-22 19:25:58.543409');
INSERT INTO 'purchase' (id, supplier_id, bag_size, units, price_per_unit, total_amount, invoice_image, date) VALUES (5, 5, '10kg', 15, 55.0, 825.0, NULL, '2025-11-22 19:25:58.544663');

CREATE TABLE sale (
	id INTEGER NOT NULL, 
	customer_id INTEGER NOT NULL, 
	bag_size VARCHAR(20) NOT NULL, 
	units INTEGER NOT NULL, 
	total_amount FLOAT NOT NULL, 
	paid_amount FLOAT, 
	outstanding FLOAT, 
	invoice_image VARCHAR(300), 
	date DATETIME, 
	PRIMARY KEY (id), 
	FOREIGN KEY(customer_id) REFERENCES customer (id)
);
INSERT INTO 'sale' (id, customer_id, bag_size, units, total_amount, paid_amount, outstanding, invoice_image, date) VALUES (1, 1, '5kg', 6, 486.0, 243.0, 243.0, NULL, '2025-11-22 19:25:58.558358');
INSERT INTO 'sale' (id, customer_id, bag_size, units, total_amount, paid_amount, outstanding, invoice_image, date) VALUES (2, 2, '5kg', 7, 574.0, 574.0, 0.0, NULL, '2025-11-22 19:25:58.562821');
INSERT INTO 'sale' (id, customer_id, bag_size, units, total_amount, paid_amount, outstanding, invoice_image, date) VALUES (3, 3, '5kg', 8, 664.0, 332.0, 332.0, NULL, '2025-11-22 19:25:58.564323');
INSERT INTO 'sale' (id, customer_id, bag_size, units, total_amount, paid_amount, outstanding, invoice_image, date) VALUES (4, 4, '5kg', 9, 756.0, 756.0, 0.0, NULL, '2025-11-22 19:25:58.567530');
INSERT INTO 'sale' (id, customer_id, bag_size, units, total_amount, paid_amount, outstanding, invoice_image, date) VALUES (5, 5, '5kg', 10, 850.0, 425.0, 425.0, NULL, '2025-11-22 19:25:58.568847');

CREATE TABLE supplier (
	id INTEGER NOT NULL, 
	name VARCHAR(120) NOT NULL, 
	phone VARCHAR(20), 
	address VARCHAR(250), 
	created_at DATETIME, 
	PRIMARY KEY (id)
);
INSERT INTO 'supplier' (id, name, phone, address, created_at) VALUES (1, 'Demo Supplier 1', '999200001', 'Street 1', '2025-11-22 19:25:58.494390');
INSERT INTO 'supplier' (id, name, phone, address, created_at) VALUES (2, 'Demo Supplier 2', '999200002', 'Street 2', '2025-11-22 19:25:58.494400');
INSERT INTO 'supplier' (id, name, phone, address, created_at) VALUES (3, 'Demo Supplier 3', '999200003', 'Street 3', '2025-11-22 19:25:58.494404');
INSERT INTO 'supplier' (id, name, phone, address, created_at) VALUES (4, 'Demo Supplier 4', '999200004', 'Street 4', '2025-11-22 19:25:58.494408');
INSERT INTO 'supplier' (id, name, phone, address, created_at) VALUES (5, 'Demo Supplier 5', '999200005', 'Street 5', '2025-11-22 19:25:58.494411');

CREATE TABLE "transaction" (
	id INTEGER NOT NULL, 
	type VARCHAR(20) NOT NULL, 
	amount FLOAT NOT NULL, 
	related_type VARCHAR(30), 
	related_id INTEGER, 
	note VARCHAR(300), 
	date DATETIME, 
	PRIMARY KEY (id)
);
INSERT INTO 'transaction' (id, type, amount, related_type, related_id, note, date) VALUES (1, 'cash', 243.0, 'sale', 1, 'Payment for sale 1', '2025-11-22 19:25:58.587680');
INSERT INTO 'transaction' (id, type, amount, related_type, related_id, note, date) VALUES (2, 'cash', 574.0, 'sale', 2, 'Payment for sale 2', '2025-11-22 19:25:58.591988');
INSERT INTO 'transaction' (id, type, amount, related_type, related_id, note, date) VALUES (3, 'cash', 332.0, 'sale', 3, 'Payment for sale 3', '2025-11-22 19:25:58.593425');
INSERT INTO 'transaction' (id, type, amount, related_type, related_id, note, date) VALUES (4, 'cash', 756.0, 'sale', 4, 'Payment for sale 4', '2025-11-22 19:25:58.594830');
INSERT INTO 'transaction' (id, type, amount, related_type, related_id, note, date) VALUES (5, 'cash', 425.0, 'sale', 5, 'Payment for sale 5', '2025-11-22 19:25:58.596002');

CREATE TABLE user (
	id INTEGER NOT NULL, 
	uid VARCHAR(20), 
	phone VARCHAR(20) NOT NULL, 
	password_hash VARCHAR(128) NOT NULL, 
	role VARCHAR(10) NOT NULL, 
	created_at DATETIME, 
	PRIMARY KEY (id), 
	UNIQUE (phone)
);
INSERT INTO 'user' (id, uid, phone, password_hash, role, created_at) VALUES (1, 'AD-0001', '9000000011', 'scrypt:32768:8:1$gMqG2Tv6lu7rfaVp$426a783d1ca661677b12ad6764361d421d81a9e6dc49b4d888a900da9049965ecbad70a64f67694e2888e0bdc24c63918cdd8dc26605c7f10adf127c47164d37', 'admin', '2025-11-22 19:25:58.345058');
INSERT INTO 'user' (id, uid, phone, password_hash, role, created_at) VALUES (2, 'US-0002', '9000000012', 'scrypt:32768:8:1$L955qz5dx78OHFu7$63fb6d803fa1088b995bc2bde26b9d996c2c07b6ac62dd38c606429a52a4b7f946a2a278de077a5d691bd0591174281b34bd5a16a8bb9da67b42263f9ca5b002', 'user', '2025-11-22 19:25:58.345069');
INSERT INTO 'user' (id, uid, phone, password_hash, role, created_at) VALUES (3, 'CU-0003', '9000000013', 'scrypt:32768:8:1$E2t5IV99HXMpgK33$7330e0cd757562adc3a235950a670fdb0fb050ce744706ab560a9be313d3600cb16b94bd8250d5b4ba76e27bd6ee70a7d7aa6f013714a00720ea8e3461b30d85', 'customer', '2025-11-22 19:25:58.345074');
INSERT INTO 'user' (id, uid, phone, password_hash, role, created_at) VALUES (4, 'CU-0004', '9000000014', 'scrypt:32768:8:1$YZZ5bdca3dgGicYk$0f28adfb84bc24ef96b1192ec85e6b3050491b449ceec40bcd2aade1d72950710cb53ce0f5e778dad7733665bf1d87c7348a6af00c07ae2aa2dc8ee991de4145', 'customer', '2025-11-22 19:25:58.345078');
INSERT INTO 'user' (id, uid, phone, password_hash, role, created_at) VALUES (5, 'CU-0005', '9000000015', 'scrypt:32768:8:1$mPypbuwFVu6V3MJM$7435df752d7315212d40279fdb561ef566efd420b12902f48ffa35bf0705780d41048200450985414a041a12492418a707a110dfb94a064a0258536a677f90fc', 'customer', '2025-11-22 19:25:58.345081');

