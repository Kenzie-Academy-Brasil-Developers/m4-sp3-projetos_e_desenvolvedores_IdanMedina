CREATE TYPE OS AS ENUM ('Linux', 'Windows', 'MacOS');

CREATE TABLE IF NOT EXISTS developer_infos (
	id SERIAL PRIMARY KEY,
	"developerSince" DATE NOT NULL,
	"preferredOS" OS NOT NULL
);

ALTER TABLE
	developer_infos 
ALTER COLUMN
	"developerSince" 	
DROP NOT NULL;

ALTER TABLE
	developer_infos 
ALTER COLUMN
	"preferredOS" 	
DROP NOT NULL;

CREATE TABLE IF NOT EXISTS developers (
	id SERIAL PRIMARY KEY,
	name VARCHAR(50) NOT NULL,
	email VARCHAR(50) UNIQUE NOT NULL,
	"developerInfoId" INTEGER UNIQUE,
	FOREIGN KEY ("developerInfoId") REFERENCES developer_infos(id)
);

CREATE TABLE projects (
	id SERIAL PRIMARY KEY,
	name VARCHAR(50) NOT NULL,
	description TEXT NOT NULL,
	"estimatedTime" VARCHAR(20) NOT NULL,
	repository VARCHAR(120) NOT NULL,
	"startDate" DATE NOT NULL,
	"endDate" DATE,
	"developerId" INTEGER NOT NULL,
	FOREIGN KEY ("developerId") REFERENCES developers(id)
);

CREATE TABLE IF NOT EXISTS technologies (
	id SERIAL PRIMARY KEY,
	name VARCHAR (30) NOT NULL
);

INSERT INTO technologies (name)
VALUES ('Javascript'),
	('Python'),
	('React'),
	('Express.js'),
	('HTML'),
	('CSS'),
	('Django'),
	('PostgreSQL'),
	('MongoDB')
RETURNING name;

CREATE TABLE IF NOT EXISTS projects_technologies(
	id SERIAL PRIMARY KEY,
	"addedIn" DATE NOT NULL,
	"projectId" INTEGER NOT NULL,
	"technologyId" INTEGER NOT NULL,
	FOREIGN KEY ("projectId") REFERENCES projects(id),
	FOREIGN KEY ("technologyId") REFERENCES technologies(id)
);
