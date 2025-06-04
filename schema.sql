-- Users Table
CREATE TABLE Users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    firstname VARCHAR(100),
    lastname VARCHAR(100),
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Products Table
CREATE TABLE Products (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    price DECIMAL(10, 2) NOT NULL,
    brand VARCHAR(100),
    tire_type VARCHAR(50), -- e.g., 'Été', 'Hiver', 'Toutes Saisons'
    tire_width INT,
    tire_ratio INT,
    tire_diameter INT,
    is_runflat BOOLEAN DEFAULT FALSE,
    is_reinforced BOOLEAN DEFAULT FALSE,
    image_url VARCHAR(500), -- URL to the product image
    stock_quantity INT NOT NULL DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- UserAddresses Table
CREATE TABLE UserAddresses (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    address_nickname VARCHAR(100), -- e.g., 'Maison', 'Travail'
    recipient_firstname VARCHAR(100) NOT NULL,
    recipient_lastname VARCHAR(100) NOT NULL,
    street_address VARCHAR(255) NOT NULL,
    address_complement VARCHAR(255), -- e.g., 'Appartement 123', 'Bâtiment B'
    city VARCHAR(100) NOT NULL,
    zip_code VARCHAR(20) NOT NULL,
    country VARCHAR(50) NOT NULL,
    phone_number VARCHAR(30), -- Optional, but useful for delivery
    is_default_shipping BOOLEAN DEFAULT FALSE,
    is_default_billing BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES Users(id) ON DELETE CASCADE
);

-- Orders Table
CREATE TABLE Orders (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    order_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status VARCHAR(50) NOT NULL DEFAULT 'Pending', -- e.g., 'Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'
    total_amount DECIMAL(10, 2) NOT NULL,
    shipping_address_id INT,
    billing_address_id INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES Users(id) ON DELETE RESTRICT, -- Prevent user deletion if they have orders
    FOREIGN KEY (shipping_address_id) REFERENCES UserAddresses(id) ON DELETE SET NULL, -- Keep order history even if address is deleted
    FOREIGN KEY (billing_address_id) REFERENCES UserAddresses(id) ON DELETE SET NULL
);

-- OrderItems Table
CREATE TABLE OrderItems (
    id INT AUTO_INCREMENT PRIMARY KEY,
    order_id INT NOT NULL,
    product_id INT NOT NULL,
    quantity INT NOT NULL,
    price_at_purchase DECIMAL(10, 2) NOT NULL, -- Price of the product at the time of order
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (order_id) REFERENCES Orders(id) ON DELETE CASCADE, -- If order is deleted, its items are deleted
    FOREIGN KEY (product_id) REFERENCES Products(id) ON DELETE RESTRICT, -- Prevent product deletion if it's in an order
    UNIQUE (order_id, product_id) -- Ensure a product appears only once per order; quantity handles multiples
);

-- Basic Indexes for Foreign Keys (Good Practice)
-- MySQL creates indexes for PRIMARY KEYs and UNIQUE constraints automatically.
-- For foreign keys, it's often good to have them indexed for performance if not done automatically by the DB engine.
-- Most modern InnoDB engines in MySQL create indexes for FKs automatically.
-- If explicit creation is desired:
/*
CREATE INDEX idx_useraddresses_user_id ON UserAddresses(user_id);
CREATE INDEX idx_orders_user_id ON Orders(user_id);
CREATE INDEX idx_orders_shipping_address_id ON Orders(shipping_address_id);
CREATE INDEX idx_orders_billing_address_id ON Orders(billing_address_id);
CREATE INDEX idx_orderitems_order_id ON OrderItems(order_id);
CREATE INDEX idx_orderitems_product_id ON OrderItems(product_id);
*/
