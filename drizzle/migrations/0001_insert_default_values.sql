-- migrations/20231010_insert_default_values.sql

-- Insert default values into the currencies table
DO $$ 
BEGIN
  INSERT INTO "factura_currencies" (id, name, symbol, code) VALUES
    (gen_random_uuid(), 'US Dollar', '$', 'USD'),
    (gen_random_uuid(), 'Euro', '€', 'EUR'),
    (gen_random_uuid(), 'Polish Zloty', 'PNL', 'PLN'),
    (gen_random_uuid(), 'British Pound', '£', 'GBP');
END $$;
