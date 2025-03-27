-- Create the pizzas table
CREATE TABLE pizzas (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100),
    topping VARCHAR(100),
    price DECIMAL(10,2)
);

-- Insert pizza records
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
('Custom Pizza', 'Custom Toppings', 0.00);

-- Create the customer role (user)
CREATE ROLE customer LOGIN PASSWORD 'customerpass';

-- Grant privileges:
-- - The customer can only SELECT and update the topping column.
GRANT SELECT, UPDATE(topping) ON TABLE pizzas TO customer;

-- Enable Row-Level Security on the pizzas table
ALTER TABLE pizzas ENABLE ROW LEVEL SECURITY;

-- Create a policy that allows all users to SELECT all rows
CREATE POLICY select_all ON pizzas
  FOR SELECT
  TO PUBLIC
  USING (true);

-- Create a policy for the customer that only permits UPDATE on the "Custom Pizza" row.
CREATE POLICY customer_update_policy ON pizzas
  FOR UPDATE
  TO customer
  USING (name = 'Custom Pizza')
  WITH CHECK (name = 'Custom Pizza');
