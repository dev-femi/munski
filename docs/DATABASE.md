# Database Schema

## Core Tables

### Users
```sql
CREATE TABLE users (
  id UUID PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  name VARCHAR(255),
  role ENUM('admin', 'grower', 'distributor', 'retailer'),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Farms
```sql
CREATE TABLE farms (
  id UUID PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES users(id),
  name VARCHAR(255) NOT NULL,
  location VARCHAR(255),
  capacity_sqft DECIMAL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Crops / Batches
```sql
CREATE TABLE crop_batches (
  id UUID PRIMARY KEY,
  farm_id UUID NOT NULL REFERENCES farms(id),
  variety VARCHAR(255),
  planting_date DATE,
  expected_harvest_date DATE,
  actual_harvest_date DATE,
  status ENUM('planning', 'growing', 'ready', 'harvested'),
  yield_lbs DECIMAL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Inventory
```sql
CREATE TABLE inventory (
  id UUID PRIMARY KEY,
  batch_id UUID NOT NULL REFERENCES crop_batches(id),
  quantity_lbs DECIMAL NOT NULL,
  location VARCHAR(255),
  expiration_date DATE,
  status ENUM('available', 'reserved', 'sold', 'expired'),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Orders
```sql
CREATE TABLE orders (
  id UUID PRIMARY KEY,
  customer_id UUID NOT NULL REFERENCES users(id),
  order_date TIMESTAMP,
  delivery_date DATE,
  status ENUM('pending', 'confirmed', 'shipped', 'delivered', 'cancelled'),
  total_amount DECIMAL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Order Items
```sql
CREATE TABLE order_items (
  id UUID PRIMARY KEY,
  order_id UUID NOT NULL REFERENCES orders(id),
  inventory_id UUID NOT NULL REFERENCES inventory(id),
  quantity_lbs DECIMAL,
  unit_price DECIMAL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## Relationships

- Users (1) → (Many) Farms
- Farms (1) → (Many) Crop Batches
- Crop Batches (1) → (Many) Inventory
- Users (1) → (Many) Orders
- Orders (1) → (Many) Order Items
- Inventory (1) → (Many) Order Items
