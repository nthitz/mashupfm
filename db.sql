
CREATE TABLE "Entry" (
  "id" serial NOT NULL,
  "data" jsonb NOT NULL,
  CONSTRAINT Entry_pk PRIMARY KEY ("id")
) WITH (
  OIDS=FALSE
);
