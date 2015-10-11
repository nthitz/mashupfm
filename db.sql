
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
);

#{"id":308196380,"cid":"221529349","image":"https://i1.sndcdn.com/artworks-000127941413-69fefn-large.jpg","title":"Fuck Shit Track","author":"Cryptrik's Vault","format":2,"duration":201},
CREATE TABLE "song" (
  "id" serial PRIMARY KEY,
  "plugId" integer,
  "cid" text,
  "image" text,
  "title" text NOT NULL,
  "author" text NOT NULL,
  "format" integer NOT NULL,
  "duration" integer NOT NULL,
  "status" text NOT NULL DEFAULT 'unknown'
  "path" text,
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
