-- Connect to the pizza_shop database
\c pizza_shop;

-- Create Pizzas Table
CREATE TABLE pizzas (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100),
    topping VARCHAR(100),
    price DECIMAL(10, 2)
);

-- Insert 10 Pizza Records
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
('Custom Pizza', 'Custom Toppings', 13.99);

-- Create Users
CREATE USER admin_pizza WITH PASSWORD 'admin_pass';
CREATE USER user_pizza WITH PASSWORD 'user_pass';

-- Grant Permissions to admin_pizza (Full Access)
GRANT ALL PRIVILEGES ON DATABASE pizza_shop TO admin_pizza;
GRANT ALL PRIVILEGES ON TABLE pizzas TO admin_pizza;

-- Grant Permissions to user_pizza (View All Pizzas)
GRANT SELECT ON pizzas TO user_pizza;

-- Enable Row-Level Security for the pizzas table
ALTER TABLE pizzas ENABLE ROW LEVEL SECURITY;

-- Create Row-Level Security Policy for user_pizza
-- Allow user_pizza to UPDATE the 'topping' of the pizza with id = 10 only
CREATE POLICY user_pizza_update_policy
    ON pizzas
    FOR UPDATE
    USING (id = 10 AND current_user = 'user_pizza'); 

-- Grant UPDATE on 'topping' to user_pizza
GRANT UPDATE(topping) ON pizzas TO user_pizza;

-- Optional: Revoke All Public Permissions (Security)
REVOKE ALL ON SCHEMA public FROM PUBLIC;

