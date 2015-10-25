
CREATE TABLE "Entry" (
  "id" serial NOT NULL,
  "data" jsonb NOT NULL,
  CONSTRAINT Entry_pk PRIMARY KEY ("id")
) WITH (
  OIDS=FALSE
);

CREATE TABLE "user" (
  "id" serial PRIMARY KEY,
  "username" text NOT NULL,
  "hash" text,
  "password_change_request_hash" text
);

CREATE TABLE "song" (
  "id" serial PRIMARY KEY,
  "plugId" integer,
  "cid" text,
  "image" text,
  "title" text NOT NULL,
  "author" text NOT NULL,
  "format" integer NOT NULL,
  "duration" integer NOT NULL,
  "status" text NOT NULL DEFAULT 'unknown',
  "path" text
);

CREATE TABLE "playlist" (
  "id" serial PRIMARY KEY,
  "name" text NOT NULL,
  "user_id" integer REFERENCES "user" ("id")
);

CREATE TABLE "playlist_has_song" (
  "playlist_id" integer REFERENCES "playlist" ("id"),
  "song_id" integer REFERENCES "song" ("id")
);


CREATE TABLE "session" (
  "sid" varchar NOT NULL COLLATE "default",
  "sess" json NOT NULL,
  "expire" timestamp(6) NOT NULL
)
WITH (OIDS=FALSE);
ALTER TABLE "session" ADD CONSTRAINT "session_pkey" PRIMARY KEY ("sid") NOT DEFERRABLE INITIALLY IMMEDIATE;


COPY "user" (id, username, hash, password_change_request_hash) FROM stdin;
1	test		qdnhbl8n1vsfg292kz53zk8m0000gn
\.

COPY playlist (id, name, user_id) FROM stdin;
1	mashup	1
\.

INSERT INTO song (id, "plugId", cid, image, title, author, format, duration, status, path) VALUES (1,	259336819,	'Sb3XfrCtjVU',	'http://i.ytimg.com/vi/Sb3XfrCtjVU/default.jpg',	'test1', '',	1,	160,	'valid',	'bensound-thejazzpiano.mp3');
INSERT INTO song (id, "plugId", cid, image, title, author, format, duration, status, path) VALUES (2,	245909691,	'UzIxHtKrV9I',	'https://i.ytimg.com/vi/UzIxHtKrV9I/default.jpg',	'test2','',	1,	160,	'valid',	'bensound-thejazzpiano.mp3');
INSERT INTO song (id, "plugId", cid, image, title, author, format, duration, status, path) VALUES (3,	193726453,	'svosd_KstEA',	'http://i.ytimg.com/vi/svosd_KstEA/default.jpg',	'test3','',	1,	160,	'valid',	'bensound-thejazzpiano.mp3');
INSERT INTO song (id, "plugId", cid, image, title, author, format, duration, status, path) VALUES (4,	249748537,	'lLJyOMcFYeA',	'http://i.ytimg.com/vi/lLJyOMcFYeA/default.jpg',	'test4','',	1,	160,	'valid',	'bensound-thejazzpiano.mp3');
INSERT INTO song (id, "plugId", cid, image, title, author, format, duration, status, path) VALUES (5,	193722421,	'SsmcReeKMyU',	'http://i.ytimg.com/vi/SsmcReeKMyU/default.jpg',	'test5','',	1,	160,	'valid',	'bensound-thejazzpiano.mp3');

COPY playlist_has_song (playlist_id, song_id) FROM stdin;
1	1
1	2
1	3
1	4
1	5
\.

SELECT pg_catalog.setval('playlist_id_seq', 1, true);



SELECT pg_catalog.setval('song_id_seq', 5, true);

SELECT pg_catalog.setval('user_id_seq', 1, true);
