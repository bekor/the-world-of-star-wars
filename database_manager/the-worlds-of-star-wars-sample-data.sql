-
-- PostgreSQL database dump
--

-- Dumped from database version 9.5.6
-- Dumped by pg_dump version 9.5.6

ALTER TABLE IF EXISTS ONLY public.swuser DROP CONSTRAINT IF EXISTS pk_swuser_id CASCADE;
ALTER TABLE IF EXISTS ONLY public.planet_votes DROP CONSTRAINT IF EXISTS pk_planet_votes_id CASCADE;
ALTER TABLE IF EXISTS ONLY public.planet_votes DROP CONSTRAINT IF EXISTS fk_swuser_id CASCADE;


DROP TABLE IF EXISTS public.swuser;
DROP SEQUENCE IF EXISTS public.swuser_id_seq;
CREATE TABLE swuser (
    id serial NOT NULL,
    username varchar(30) NOT NULL UNIQUE,
    password TEXT NOT NULL
);

DROP TABLE IF EXISTS public.planet_votes;
DROP SEQUENCE IF EXISTS public.planet_votes_id_seq;
CREATE TABLE planet_votes (
    id serial NOT NULL,
    planet_id integer,
    swuser_id integer,
    submission_time timestamp without time zone
);


ALTER TABLE ONLY planet_votes
    ADD CONSTRAINT pk_planet_votes_id PRIMARY KEY (id);

ALTER TABLE ONLY swuser
    ADD CONSTRAINT pk_swuser_id PRIMARY KEY (id);

ALTER TABLE ONLY planet_votes
    ADD CONSTRAINT fk_swuser_id FOREIGN KEY (swuser_id) REFERENCES swuser(id);

INSERT INTO swuser VALUES(1, 'testuser', 'badpw');
SELECT pg_catalog.setval('swuser_id_seq', 1. true);

INSERT INTO planet_votes VALUES(1, 2, 1, '2017-01-01 00:00:00');
SELECT pg_catalog.setval('planet_votes_id_seq', 1, true);