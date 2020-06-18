-- PRIMEIRO, CRIE O BANCO DE DADOS:

CREATE DATABASE "foodfy";

-- DEPOIS, SELECIONE O BANCO DE DADOS E EXECUTE O RESTANTE DO CÓDIGO:

CREATE TABLE "users" (
    "id" SERIAL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "email" TEXT UNIQUE NOT NULL,
    "password" TEXT NOT NULL,
    "is_admin" BOOLEAN DEFAULT false,
    "created_at" TIMESTAMP DEFAULT(now()),
    "updated_at" TIMESTAMP DEFAULT(now()),
    "reset_token" TEXT,
    "reset_token_expires" TEXT
);

CREATE TABLE "files" (
    "id" SERIAL PRIMARY KEY,
    "name" TEXT,
    "path" TEXT NOT NULL
);

CREATE TABLE "chefs" (
    "id" SERIAL PRIMARY KEY,
    "name" TEXT,
    "file_id" INTEGER REFERENCES files(id),
    "created_at" TIMESTAMP DEFAULT (now())
);

CREATE TABLE "recipes" (
    "id" SERIAL PRIMARY KEY,
    "user_id" INTEGER REFERENCES users(id) ON DELETE CASCADE,
    "chef_id" INTEGER REFERENCES chefs(id),
    "title" TEXT,
    "ingredients" TEXT[],
    "preparation" TEXT[],
    "information" TEXT,
    "created_at" TIMESTAMP DEFAULT (now()),
    "updated_at" TIMESTAMP DEFAULT (now())
);

CREATE TABLE "recipe_files" (
    "id" SERIAL PRIMARY KEY,
    "recipe_id" INTEGER REFERENCES recipes(id) ON DELETE CASCADE,
    "file_id" INTEGER REFERENCES files(id) ON DELETE CASCADE
);

CREATE TABLE "session" (
  "sid" VARCHAR NOT NULL COLLATE "default",
  "sess" JSON NOT NULL,
  "expire" TIMESTAMP(6) NOT NULL
)
WITH (OIDS=FALSE);
ALTER TABLE "session" 
ADD CONSTRAINT "session_pkey" 
PRIMARY KEY ("sid") NOT DEFERRABLE INITIALLY IMMEDIATE;

CREATE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_updated_at
BEFORE UPDATE ON recipes
FOR EACH ROW
EXECUTE PROCEDURE set_updated_at();

CREATE TRIGGER set_updated_at
BEFORE UPDATE ON users
FOR EACH ROW
EXECUTE PROCEDURE set_updated_at();