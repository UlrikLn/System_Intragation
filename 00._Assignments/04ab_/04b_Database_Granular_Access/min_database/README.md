# Opgave med Exposer, hvor vi opretter og sætter databasen op og defter Integrator som som afprøver den opsatte database

Denne guide hjælper dig med at opsætte en PostgreSQL-database med Docker og Docker Compose.

## 1. Opret `init.sql`-fil

Lav en fil kaldet `init.sql` med følgende indhold:

```sql
-- Opret pizzas-tabellen
CREATE TABLE pizzas (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100),
    topping VARCHAR(100),
    price DECIMAL(10,2)
);

-- Indsæt pizza-data
INSERT INTO pizzas (name, topping, price) VALUES
('Margherita', 'Tomato, Mozzarella, Basil', 7.99),
('Pepperoni', 'Pepperoni, Mozzarella', 9.99),
('Vegetarian', 'Tomato, Mushrooms, Peppers, Olives', 8.99),
('BBQ Chicken', 'Chicken, BBQ Sauce, Red Onion, Mozzarella', 10.49),
('Hawaiian', 'Ham, Pineapple, Mozzarella', 9.49),
('Meat Feast', 'Pepperoni, Sausage, Bacon, Mozzarella', 11.99),
('Margarita Deluxe', 'Tomato, Fresh Mozzarella, Basil, Extra Virgin Olive Oil', 10.99),
('Seafood Special', 'Shrimp, Mussels, Calamari, Mozzarella', 12.99),
('Four Cheese', 'Mozzarella, Cheddar, Gorgonzola, Parmesan', 11.49),
('Custom Pizza', 'Custom Toppings', 0.00),
('Secret Pizza', 'Secret Toppings', 15.00);

-- Opret customer-bruger
CREATE ROLE customer LOGIN PASSWORD 'customerpass';

-- Tildel rettigheder til customer-bruger
GRANT SELECT, UPDATE(topping) ON TABLE pizzas TO customer;

-- Aktiver Row-Level Security
ALTER TABLE pizzas ENABLE ROW LEVEL SECURITY;

-- Tillad customer-bruger at SELECT alle pizzaer undtagen "Secret Pizza"
CREATE POLICY select_for_customer ON pizzas
  FOR SELECT TO customer
  USING (name <> 'Secret Pizza');

-- Tillad customer-bruger kun at UPDATE "Custom Pizza"
CREATE POLICY customer_update_policy ON pizzas
  FOR UPDATE TO customer
  USING (name = 'Custom Pizza')
  WITH CHECK (name = 'Custom Pizza');
```

## 2. Opret `docker-compose.yml`

Opret en fil kaldet `docker-compose.yml` med følgende indhold:

```yaml
version: '3.8'
services:
  postgres:
    image: postgres:15
    container_name: pizza_shop_db
    environment:
      POSTGRES_USER: owner
      POSTGRES_PASSWORD: ownerpass
      POSTGRES_DB: pizza_shop
    volumes:
      - ./init.sql:/docker-entrypoint-initdb.d/init.sql:ro
      - pgdata:/var/lib/postgresql/data
    ports:
      - '5432:5432'

volumes:
  pgdata:
```

## 3. Start PostgreSQL-containeren

Navigér til mappen, hvor dine filer ligger, og start databasen (Husk at hav dem under samme sted):

```bash
docker-compose up -d
```

## 4. Kontroller at containeren kører

```bash
docker-compose ps
```

## 5. Test din opsætning

### Test som bruger `owner`

```bash
docker exec -it pizza_shop_db psql -U owner -d pizza_shop
```

Udfør f.eks.:

```sql
SELECT * FROM pizzas;
UPDATE pizzas SET price = 5.99 WHERE name = 'Custom Pizza';
```

### Test som bruger `customer`
_Koden er = `customerpass`._


```bash
docker exec -it pizza_shop_db psql -U customer -d pizza_shop
```

Udfør f.eks.:

```sql
SELECT * FROM pizzas; -- bemærk at du ikke ser "Secret Pizza"
UPDATE pizzas SET price = 5.99 WHERE name = 'Custom Pizza'; -- vil fejle
UPDATE pizzas SET topping = 'Chorizo' WHERE name = 'Custom Pizza'; -- vil lykkes
```

## Integrator Guide

### 1. Forbind til PostgreSQL

```bash
psql -h [værts-ip fx 192.168.1.100] -p 5432 -U customer -d pizza_shop
```

### 2. Vis pizzaer

```sql
SELECT * FROM pizzas;
```

_For at se alle, inkl. den hemmelige pizza, log ind som bruger `owner` password = `ownerpass`._

### 3. Ændre prisen på "Custom Pizza" (vil fejle som customer)

```sql
UPDATE pizzas SET price = 5.99 WHERE name = 'Custom Pizza';
```

### 4. Ændre toppings på "Custom Pizza"

```sql
UPDATE pizzas SET topping = 'Ananas, Skinke, Leverpostej' WHERE name = 'Custom Pizza';
```


