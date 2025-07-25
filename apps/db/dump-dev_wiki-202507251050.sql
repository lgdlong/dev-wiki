--
-- PostgreSQL database dump
--

-- Dumped from database version 16.9 (Debian 16.9-1.pgdg120+1)
-- Dumped by pg_dump version 17.0

-- Started on 2025-07-25 10:50:26

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

DROP DATABASE dev_wiki;
--
-- TOC entry 3507 (class 1262 OID 16389)
-- Name: dev_wiki; Type: DATABASE; Schema: -; Owner: devwiki_admin
--

CREATE DATABASE dev_wiki WITH TEMPLATE = template0 ENCODING = 'UTF8' LOCALE_PROVIDER = libc LOCALE = 'en_US.UTF8';


ALTER DATABASE dev_wiki OWNER TO devwiki_admin;

\connect dev_wiki

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- TOC entry 3508 (class 0 OID 0)
-- Name: dev_wiki; Type: DATABASE PROPERTIES; Schema: -; Owner: devwiki_admin
--

ALTER DATABASE dev_wiki SET "TimeZone" TO 'utc';


\connect dev_wiki

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- TOC entry 5 (class 2615 OID 2200)
-- Name: public; Type: SCHEMA; Schema: -; Owner: devwiki_admin
--

CREATE SCHEMA public;


ALTER SCHEMA public OWNER TO devwiki_admin;

--
-- TOC entry 3509 (class 0 OID 0)
-- Dependencies: 5
-- Name: SCHEMA public; Type: COMMENT; Schema: -; Owner: devwiki_admin
--

COMMENT ON SCHEMA public IS 'standard public schema';


--
-- TOC entry 859 (class 1247 OID 16400)
-- Name: account_role_enum; Type: TYPE; Schema: public; Owner: devwiki_admin
--

CREATE TYPE public.account_role_enum AS ENUM (
    'user',
    'admin',
    'mod'
);


ALTER TYPE public.account_role_enum OWNER TO devwiki_admin;

--
-- TOC entry 862 (class 1247 OID 16408)
-- Name: account_status_enum; Type: TYPE; Schema: public; Owner: devwiki_admin
--

CREATE TYPE public.account_status_enum AS ENUM (
    'active',
    'deleted',
    'banned'
);


ALTER TYPE public.account_status_enum OWNER TO devwiki_admin;

--
-- TOC entry 865 (class 1247 OID 16427)
-- Name: accounts_role_enum; Type: TYPE; Schema: public; Owner: devwiki_admin
--

CREATE TYPE public.accounts_role_enum AS ENUM (
    'user',
    'admin',
    'mod'
);


ALTER TYPE public.accounts_role_enum OWNER TO devwiki_admin;

--
-- TOC entry 868 (class 1247 OID 16434)
-- Name: accounts_status_enum; Type: TYPE; Schema: public; Owner: devwiki_admin
--

CREATE TYPE public.accounts_status_enum AS ENUM (
    'active',
    'deleted',
    'banned'
);


ALTER TYPE public.accounts_status_enum OWNER TO devwiki_admin;

--
-- TOC entry 886 (class 1247 OID 16500)
-- Name: comments_entity_type_enum; Type: TYPE; Schema: public; Owner: devwiki_admin
--

CREATE TYPE public.comments_entity_type_enum AS ENUM (
    'tutorial',
    'video',
    'product'
);


ALTER TYPE public.comments_entity_type_enum OWNER TO devwiki_admin;

--
-- TOC entry 892 (class 1247 OID 16521)
-- Name: votes_entity_type_enum; Type: TYPE; Schema: public; Owner: devwiki_admin
--

CREATE TYPE public.votes_entity_type_enum AS ENUM (
    'tutorial',
    'video',
    'product'
);


ALTER TYPE public.votes_entity_type_enum OWNER TO devwiki_admin;

--
-- TOC entry 895 (class 1247 OID 16528)
-- Name: votes_vote_type_enum; Type: TYPE; Schema: public; Owner: devwiki_admin
--

CREATE TYPE public.votes_vote_type_enum AS ENUM (
    'up',
    'down'
);


ALTER TYPE public.votes_vote_type_enum OWNER TO devwiki_admin;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 216 (class 1259 OID 16442)
-- Name: accounts; Type: TABLE; Schema: public; Owner: devwiki_admin
--

CREATE TABLE public.accounts (
    id integer NOT NULL,
    email character varying NOT NULL,
    name character varying NOT NULL,
    password character varying NOT NULL,
    avatar_url character varying,
    role public.accounts_role_enum DEFAULT 'user'::public.accounts_role_enum NOT NULL,
    status public.accounts_status_enum DEFAULT 'active'::public.accounts_status_enum NOT NULL,
    "createdAt" timestamp without time zone DEFAULT now() NOT NULL,
    "updatedAt" timestamp without time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.accounts OWNER TO devwiki_admin;

--
-- TOC entry 215 (class 1259 OID 16441)
-- Name: accounts_id_seq; Type: SEQUENCE; Schema: public; Owner: devwiki_admin
--

CREATE SEQUENCE public.accounts_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.accounts_id_seq OWNER TO devwiki_admin;

--
-- TOC entry 3510 (class 0 OID 0)
-- Dependencies: 215
-- Name: accounts_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: devwiki_admin
--

ALTER SEQUENCE public.accounts_id_seq OWNED BY public.accounts.id;


--
-- TOC entry 224 (class 1259 OID 16488)
-- Name: categories; Type: TABLE; Schema: public; Owner: devwiki_admin
--

CREATE TABLE public.categories (
    id integer NOT NULL,
    name text NOT NULL,
    description text,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    slug text NOT NULL
);


ALTER TABLE public.categories OWNER TO devwiki_admin;

--
-- TOC entry 223 (class 1259 OID 16487)
-- Name: categories_id_seq; Type: SEQUENCE; Schema: public; Owner: devwiki_admin
--

CREATE SEQUENCE public.categories_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.categories_id_seq OWNER TO devwiki_admin;

--
-- TOC entry 3511 (class 0 OID 0)
-- Dependencies: 223
-- Name: categories_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: devwiki_admin
--

ALTER SEQUENCE public.categories_id_seq OWNED BY public.categories.id;


--
-- TOC entry 226 (class 1259 OID 16508)
-- Name: comments; Type: TABLE; Schema: public; Owner: devwiki_admin
--

CREATE TABLE public.comments (
    id integer NOT NULL,
    content text NOT NULL,
    author_id integer NOT NULL,
    parent_id integer,
    entity_type public.comments_entity_type_enum NOT NULL,
    entity_id bigint NOT NULL,
    upvotes bigint DEFAULT '0'::bigint NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.comments OWNER TO devwiki_admin;

--
-- TOC entry 225 (class 1259 OID 16507)
-- Name: comments_id_seq; Type: SEQUENCE; Schema: public; Owner: devwiki_admin
--

CREATE SEQUENCE public.comments_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.comments_id_seq OWNER TO devwiki_admin;

--
-- TOC entry 3512 (class 0 OID 0)
-- Dependencies: 225
-- Name: comments_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: devwiki_admin
--

ALTER SEQUENCE public.comments_id_seq OWNED BY public.comments.id;


--
-- TOC entry 230 (class 1259 OID 16543)
-- Name: product_categories; Type: TABLE; Schema: public; Owner: devwiki_admin
--

CREATE TABLE public.product_categories (
    id integer NOT NULL,
    product_id integer NOT NULL,
    category_id integer NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.product_categories OWNER TO devwiki_admin;

--
-- TOC entry 229 (class 1259 OID 16542)
-- Name: product_categories_id_seq; Type: SEQUENCE; Schema: public; Owner: devwiki_admin
--

CREATE SEQUENCE public.product_categories_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.product_categories_id_seq OWNER TO devwiki_admin;

--
-- TOC entry 3513 (class 0 OID 0)
-- Dependencies: 229
-- Name: product_categories_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: devwiki_admin
--

ALTER SEQUENCE public.product_categories_id_seq OWNED BY public.product_categories.id;


--
-- TOC entry 218 (class 1259 OID 16456)
-- Name: products; Type: TABLE; Schema: public; Owner: devwiki_admin
--

CREATE TABLE public.products (
    id integer NOT NULL,
    name text NOT NULL,
    description text,
    logo_url character varying,
    homepage_url character varying,
    github_url character varying,
    pros text,
    cons text,
    created_by integer NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.products OWNER TO devwiki_admin;

--
-- TOC entry 217 (class 1259 OID 16455)
-- Name: products_id_seq; Type: SEQUENCE; Schema: public; Owner: devwiki_admin
--

CREATE SEQUENCE public.products_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.products_id_seq OWNER TO devwiki_admin;

--
-- TOC entry 3514 (class 0 OID 0)
-- Dependencies: 217
-- Name: products_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: devwiki_admin
--

ALTER SEQUENCE public.products_id_seq OWNED BY public.products.id;


--
-- TOC entry 222 (class 1259 OID 16477)
-- Name: tags; Type: TABLE; Schema: public; Owner: devwiki_admin
--

CREATE TABLE public.tags (
    id integer NOT NULL,
    name text NOT NULL,
    description text
);


ALTER TABLE public.tags OWNER TO devwiki_admin;

--
-- TOC entry 221 (class 1259 OID 16476)
-- Name: tags_id_seq; Type: SEQUENCE; Schema: public; Owner: devwiki_admin
--

CREATE SEQUENCE public.tags_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.tags_id_seq OWNER TO devwiki_admin;

--
-- TOC entry 3515 (class 0 OID 0)
-- Dependencies: 221
-- Name: tags_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: devwiki_admin
--

ALTER SEQUENCE public.tags_id_seq OWNED BY public.tags.id;


--
-- TOC entry 234 (class 1259 OID 16564)
-- Name: tutorial_tags; Type: TABLE; Schema: public; Owner: devwiki_admin
--

CREATE TABLE public.tutorial_tags (
    id integer NOT NULL,
    tutorial_id integer NOT NULL,
    tag_id integer NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.tutorial_tags OWNER TO devwiki_admin;

--
-- TOC entry 233 (class 1259 OID 16563)
-- Name: tutorial_tags_id_seq; Type: SEQUENCE; Schema: public; Owner: devwiki_admin
--

CREATE SEQUENCE public.tutorial_tags_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.tutorial_tags_id_seq OWNER TO devwiki_admin;

--
-- TOC entry 3516 (class 0 OID 0)
-- Dependencies: 233
-- Name: tutorial_tags_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: devwiki_admin
--

ALTER SEQUENCE public.tutorial_tags_id_seq OWNED BY public.tutorial_tags.id;


--
-- TOC entry 232 (class 1259 OID 16552)
-- Name: tutorials; Type: TABLE; Schema: public; Owner: devwiki_admin
--

CREATE TABLE public.tutorials (
    id integer NOT NULL,
    title text NOT NULL,
    content text NOT NULL,
    author_id integer NOT NULL,
    views bigint DEFAULT '0'::bigint NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.tutorials OWNER TO devwiki_admin;

--
-- TOC entry 231 (class 1259 OID 16551)
-- Name: tutorials_id_seq; Type: SEQUENCE; Schema: public; Owner: devwiki_admin
--

CREATE SEQUENCE public.tutorials_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.tutorials_id_seq OWNER TO devwiki_admin;

--
-- TOC entry 3517 (class 0 OID 0)
-- Dependencies: 231
-- Name: tutorials_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: devwiki_admin
--

ALTER SEQUENCE public.tutorials_id_seq OWNED BY public.tutorials.id;


--
-- TOC entry 220 (class 1259 OID 16467)
-- Name: videos; Type: TABLE; Schema: public; Owner: devwiki_admin
--

CREATE TABLE public.videos (
    id integer NOT NULL,
    youtube_id character varying,
    title text NOT NULL,
    description text,
    thumbnail_url character varying,
    duration bigint,
    uploader text,
    metadata jsonb,
    created_at timestamp without time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.videos OWNER TO devwiki_admin;

--
-- TOC entry 3518 (class 0 OID 0)
-- Dependencies: 220
-- Name: COLUMN videos.duration; Type: COMMENT; Schema: public; Owner: devwiki_admin
--

COMMENT ON COLUMN public.videos.duration IS 'duration in seconds';


--
-- TOC entry 219 (class 1259 OID 16466)
-- Name: videos_id_seq; Type: SEQUENCE; Schema: public; Owner: devwiki_admin
--

CREATE SEQUENCE public.videos_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.videos_id_seq OWNER TO devwiki_admin;

--
-- TOC entry 3519 (class 0 OID 0)
-- Dependencies: 219
-- Name: videos_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: devwiki_admin
--

ALTER SEQUENCE public.videos_id_seq OWNED BY public.videos.id;


--
-- TOC entry 228 (class 1259 OID 16534)
-- Name: votes; Type: TABLE; Schema: public; Owner: devwiki_admin
--

CREATE TABLE public.votes (
    id integer NOT NULL,
    user_id integer NOT NULL,
    entity_id bigint NOT NULL,
    entity_type public.votes_entity_type_enum NOT NULL,
    vote_type public.votes_vote_type_enum NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.votes OWNER TO devwiki_admin;

--
-- TOC entry 227 (class 1259 OID 16533)
-- Name: votes_id_seq; Type: SEQUENCE; Schema: public; Owner: devwiki_admin
--

CREATE SEQUENCE public.votes_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.votes_id_seq OWNER TO devwiki_admin;

--
-- TOC entry 3520 (class 0 OID 0)
-- Dependencies: 227
-- Name: votes_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: devwiki_admin
--

ALTER SEQUENCE public.votes_id_seq OWNED BY public.votes.id;


--
-- TOC entry 3273 (class 2604 OID 16445)
-- Name: accounts id; Type: DEFAULT; Schema: public; Owner: devwiki_admin
--

ALTER TABLE ONLY public.accounts ALTER COLUMN id SET DEFAULT nextval('public.accounts_id_seq'::regclass);


--
-- TOC entry 3284 (class 2604 OID 16491)
-- Name: categories id; Type: DEFAULT; Schema: public; Owner: devwiki_admin
--

ALTER TABLE ONLY public.categories ALTER COLUMN id SET DEFAULT nextval('public.categories_id_seq'::regclass);


--
-- TOC entry 3286 (class 2604 OID 16511)
-- Name: comments id; Type: DEFAULT; Schema: public; Owner: devwiki_admin
--

ALTER TABLE ONLY public.comments ALTER COLUMN id SET DEFAULT nextval('public.comments_id_seq'::regclass);


--
-- TOC entry 3292 (class 2604 OID 16546)
-- Name: product_categories id; Type: DEFAULT; Schema: public; Owner: devwiki_admin
--

ALTER TABLE ONLY public.product_categories ALTER COLUMN id SET DEFAULT nextval('public.product_categories_id_seq'::regclass);


--
-- TOC entry 3278 (class 2604 OID 16459)
-- Name: products id; Type: DEFAULT; Schema: public; Owner: devwiki_admin
--

ALTER TABLE ONLY public.products ALTER COLUMN id SET DEFAULT nextval('public.products_id_seq'::regclass);


--
-- TOC entry 3283 (class 2604 OID 16480)
-- Name: tags id; Type: DEFAULT; Schema: public; Owner: devwiki_admin
--

ALTER TABLE ONLY public.tags ALTER COLUMN id SET DEFAULT nextval('public.tags_id_seq'::regclass);


--
-- TOC entry 3298 (class 2604 OID 16567)
-- Name: tutorial_tags id; Type: DEFAULT; Schema: public; Owner: devwiki_admin
--

ALTER TABLE ONLY public.tutorial_tags ALTER COLUMN id SET DEFAULT nextval('public.tutorial_tags_id_seq'::regclass);


--
-- TOC entry 3294 (class 2604 OID 16555)
-- Name: tutorials id; Type: DEFAULT; Schema: public; Owner: devwiki_admin
--

ALTER TABLE ONLY public.tutorials ALTER COLUMN id SET DEFAULT nextval('public.tutorials_id_seq'::regclass);


--
-- TOC entry 3281 (class 2604 OID 16470)
-- Name: videos id; Type: DEFAULT; Schema: public; Owner: devwiki_admin
--

ALTER TABLE ONLY public.videos ALTER COLUMN id SET DEFAULT nextval('public.videos_id_seq'::regclass);


--
-- TOC entry 3290 (class 2604 OID 16537)
-- Name: votes id; Type: DEFAULT; Schema: public; Owner: devwiki_admin
--

ALTER TABLE ONLY public.votes ALTER COLUMN id SET DEFAULT nextval('public.votes_id_seq'::regclass);


--
-- TOC entry 3483 (class 0 OID 16442)
-- Dependencies: 216
-- Data for Name: accounts; Type: TABLE DATA; Schema: public; Owner: devwiki_admin
--

COPY public.accounts (id, email, name, password, avatar_url, role, status, "createdAt", "updatedAt") FROM stdin;
13	alice@gmail.com	Alice Nguyen	$2b$12$djS6A2T/Oak8N10jcajIye.DjkCwoeL.ifUZU5eykikAR04xQT7Qy	\N	user	active	2025-07-11 16:42:58.240879	2025-07-11 16:42:58.240879
14	bob@gmail.com	Bob Tran	$2b$12$jAnHfZh5R/UtwX8S3mMG/uA8stiNzzFw9ic6zFtBHH1z6lSmaiZM6	\N	user	active	2025-07-11 16:43:46.061343	2025-07-11 16:43:46.061343
15	charlie@gmail.com	Charlie Le	$2b$12$IP.M6wLGWtvO7TkY207.qOehqfV2JG8j6Hv7In9ItLeSZglRxsrHG	\N	user	active	2025-07-11 16:44:02.504956	2025-07-11 16:44:02.504956
16	diana@gmail.com	Diana Pham	$2b$12$UubhXFmrj4DykMHdsNOif.tTIXLTWZNv9myrjfwdgxAOYRTz9UtVm	\N	user	active	2025-07-11 16:44:11.900228	2025-07-11 16:44:11.900228
17	eric@gmail.com	Eric Hoang	$2b$12$EDuHhwvR0hB/kqmcZSEKiuS1bmhEa7Nj/YTDngK3xwI6v3fzwJt.m	\N	user	active	2025-07-11 16:44:18.86966	2025-07-11 16:44:18.86966
18	fiona@gmail.com	Fiona Bui	$2b$12$YWVwSUNUvS83GcoVEneHBeY4OH/YvZvugQkLd7gjq/ncIUBQT9MVq	\N	user	active	2025-07-11 16:44:29.488195	2025-07-11 16:44:29.488195
19	george@gmail.com	George Do	$2b$12$JFgVIK6AqvGbdTER2b6GEe3aUK/13nGABKlLd2vQ5.OBg6DhWPmQy	\N	user	active	2025-07-11 16:44:38.080153	2025-07-11 16:44:38.080153
20	hannah@gmail.com	Hannah Duong	$2b$12$c82xpqqbOaCpz4jljRb4JeCYwOzAUUZiMK3svnctxd8akP//BrWIq	\N	user	active	2025-07-11 16:44:45.545489	2025-07-11 16:44:45.545489
21	julia@gmail.com	Julia Mai	$2b$12$g/y6Z126wGVqVLkmLJ53nObceWBDOVIMzfiDIRGTwEb1gcEVTlNfa	\N	user	active	2025-07-11 16:45:10.341879	2025-07-11 16:45:10.341879
24	admin@admin.com	Super Admin	$2b$12$zumQ367uNyljhZtGmcJYx.c6/XlVUbVbivWR/lj2eAfYISGPHnnUe	\N	admin	active	2025-07-11 19:33:29.780182	2025-07-11 19:33:29.780182
25	mod@mod.com	Super Mod	$2b$12$YaZohsxTyOuxtGSfyKhXL.Ts3RuDLt3WBUBSwl6T04ibdnxJdFaSO	\N	mod	active	2025-07-11 19:33:52.070674	2025-07-11 19:33:52.070674
26	phungluuhoanglong@gmail.com	Phùng Lưu Hoàng Long	$2b$12$gzsOZD6kxrFyh/c5sBdRn.oe/IRfJJ8NXtbfQMA0v486bVgsLpPhW	\N	user	active	2025-07-11 20:08:13.028077	2025-07-11 20:08:13.028077
27	mod2@mod.com	Super Mod 2	$2b$12$eHH4PdaPGAlkDc0pO4sK5OqT8NBlla9RPMGo6xwFuwv2oRVrWQT.i	\N	mod	active	2025-07-11 20:11:30.125779	2025-07-11 20:11:30.125779
28	no@example.com	Thi No	$2b$12$tZzShPRdL1WAVUBkWGI.CeYdpccZcnstqF8jdmMjn4xf4yHYRh.wy	\N	user	active	2025-07-12 09:25:12.249319	2025-07-12 09:25:12.249319
\.


--
-- TOC entry 3491 (class 0 OID 16488)
-- Dependencies: 224
-- Data for Name: categories; Type: TABLE DATA; Schema: public; Owner: devwiki_admin
--

COPY public.categories (id, name, description, created_at, slug) FROM stdin;
1	Website builders	The best website builders.	2025-07-15 10:42:46.565963	website-builders
2	Ecommerce platforms	The best ecommerce platforms.	2025-07-15 10:43:24.615986	ecommerce-platforms
3	Blogging platforms	The best blogging platforms.	2025-07-15 10:43:56.26526	blogging-platforms
4	Static site generators	The best static site generators.	2025-07-15 10:47:23.177537	static-site-generators
5	Engineering & Development	The best engineering & development tools to use.	2025-07-15 10:48:18.693092	engineering-development
6	Databases and backend frameworks	The best databases and backend frameworks.	2025-07-15 10:49:21.172227	databases-and-backend
7	Cloud Computing Platforms	The best cloud computing platforms.	2025-07-15 10:50:10.811802	cloud-computing-platforms
\.


--
-- TOC entry 3493 (class 0 OID 16508)
-- Dependencies: 226
-- Data for Name: comments; Type: TABLE DATA; Schema: public; Owner: devwiki_admin
--

COPY public.comments (id, content, author_id, parent_id, entity_type, entity_id, upvotes, created_at, updated_at) FROM stdin;
\.


--
-- TOC entry 3497 (class 0 OID 16543)
-- Dependencies: 230
-- Data for Name: product_categories; Type: TABLE DATA; Schema: public; Owner: devwiki_admin
--

COPY public.product_categories (id, product_id, category_id, created_at) FROM stdin;
\.


--
-- TOC entry 3485 (class 0 OID 16456)
-- Dependencies: 218
-- Data for Name: products; Type: TABLE DATA; Schema: public; Owner: devwiki_admin
--

COPY public.products (id, name, description, logo_url, homepage_url, github_url, pros, cons, created_by, created_at, updated_at) FROM stdin;
1	Vercel	The frontend cloud. Creators of Next.js.	https://ph-files.imgix.net/593ff5e2-9d11-491c-ab63-9e929e894214.jpeg?auto=compress&codec=mozjpeg&cs=strip&auto=format&w=64&h=64&fit=crop&frame=1&dpr=2	https://vercel.com	https://github.com/vercel	Dễ dùng, miễn phí, tài liệu đầy đủ.	Chưa hỗ trợ mobile.	25	2025-07-15 10:15:25.024937	2025-07-15 10:15:25.024937
2	NestJS	Building efficient, reliable and server-side applications.	https://ph-files.imgix.net/37abd321-bdbe-4e17-bb77-e97b9ed20842.png?auto=compress&codec=mozjpeg&cs=strip&auto=format&w=64&h=64&fit=crop&frame=1&dpr=2	https://nestjs.com	https://github.com/nestjs/nest	Dễ dùng, miễn phí, tài liệu đầy đủ.	Chưa hỗ trợ mobile.	25	2025-07-15 10:17:39.38236	2025-07-15 10:17:39.38236
3	Node.js	Node.js® is a JavaScript runtime built on Chrome's V8 JavaScript engine.	https://ph-files.imgix.net/0c739913-6d56-4ce9-9ca7-20368a026ec8.png?auto=compress&codec=mozjpeg&cs=strip&auto=format&w=64&h=64&fit=crop&frame=1&dpr=2	https://nodejs.org	https://github.com/nodejs/node	Dễ dùng, miễn phí, tài liệu đầy đủ.		25	2025-07-15 10:22:01.933926	2025-07-15 10:22:01.933926
4	Render	A unified platform to build and run all your apps and websites with free SSL, a global CDN, private networks and auto deploys from Git.	https://ph-files.imgix.net/c5755a02-777d-4baf-a7d0-c5654511ef36.png?auto=compress&codec=mozjpeg&cs=strip&auto=format&w=64&h=64&fit=crop&frame=1&dpr=2	https://render.com	https://github.com/render-examples	Ez deploy, simple setup.	Not the cheapest option.	25	2025-07-15 10:24:59.71005	2025-07-15 10:24:59.71005
5	ChatGPT by OpenAI	An LLM to get instant answers, find creative inspiration, and learn something new. Free to use. Easy to try. Just ask and ChatGPT can help with writing, learning, brainstorming, and more.	https://ph-files.imgix.net/ab9d1922-1570-42b9-8703-a6176d844a98.png?auto=compress&codec=mozjpeg&cs=strip&auto=format&w=64&h=64&fit=crop&frame=1&dpr=2	https://chatgpt.com		Versatile tool, fast performance.	Inaccurate responses, context aware.	25	2025-07-15 10:28:16.129203	2025-07-15 10:28:16.129203
6	Astro	Build fast content-driven websites, powerful SPA web applications, dynamic server APIs and everything in-between.	https://ph-files.imgix.net/6bad3f69-e994-422a-b532-569cbb4ee076.png?auto=compress&codec=mozjpeg&cs=strip&auto=format&w=64&h=64&fit=crop&frame=1&dpr=2	https://astro.build/	https://github.com/withastro/starlight	Fast performance, excellent developer experience, static site generation.		25	2025-07-15 10:31:55.017387	2025-07-15 10:31:55.017387
7	WordPress	Trusted by the Best. 43% of the web uses WordPress, from hobby blogs to the biggest news sites online.	https://ph-files.imgix.net/b7fbd48f-4819-45da-9e10-69b9f94e695f.png?auto=compress&codec=mozjpeg&cs=strip&auto=format&w=64&h=64&fit=crop&frame=1&dpr=2	https://wordpress.com/		Customization options, content management system.	Not beginner-friendly, learning curve.	25	2025-07-15 10:35:01.823576	2025-07-15 10:35:01.823576
\.


--
-- TOC entry 3489 (class 0 OID 16477)
-- Dependencies: 222
-- Data for Name: tags; Type: TABLE DATA; Schema: public; Owner: devwiki_admin
--

COPY public.tags (id, name, description) FROM stdin;
\.


--
-- TOC entry 3501 (class 0 OID 16564)
-- Dependencies: 234
-- Data for Name: tutorial_tags; Type: TABLE DATA; Schema: public; Owner: devwiki_admin
--

COPY public.tutorial_tags (id, tutorial_id, tag_id, created_at) FROM stdin;
\.


--
-- TOC entry 3499 (class 0 OID 16552)
-- Dependencies: 232
-- Data for Name: tutorials; Type: TABLE DATA; Schema: public; Owner: devwiki_admin
--

COPY public.tutorials (id, title, content, author_id, views, created_at, updated_at) FROM stdin;
\.


--
-- TOC entry 3487 (class 0 OID 16467)
-- Dependencies: 220
-- Data for Name: videos; Type: TABLE DATA; Schema: public; Owner: devwiki_admin
--

COPY public.videos (id, youtube_id, title, description, thumbnail_url, duration, uploader, metadata, created_at) FROM stdin;
\.


--
-- TOC entry 3495 (class 0 OID 16534)
-- Dependencies: 228
-- Data for Name: votes; Type: TABLE DATA; Schema: public; Owner: devwiki_admin
--

COPY public.votes (id, user_id, entity_id, entity_type, vote_type, created_at) FROM stdin;
\.


--
-- TOC entry 3521 (class 0 OID 0)
-- Dependencies: 215
-- Name: accounts_id_seq; Type: SEQUENCE SET; Schema: public; Owner: devwiki_admin
--

SELECT pg_catalog.setval('public.accounts_id_seq', 28, true);


--
-- TOC entry 3522 (class 0 OID 0)
-- Dependencies: 223
-- Name: categories_id_seq; Type: SEQUENCE SET; Schema: public; Owner: devwiki_admin
--

SELECT pg_catalog.setval('public.categories_id_seq', 7, true);


--
-- TOC entry 3523 (class 0 OID 0)
-- Dependencies: 225
-- Name: comments_id_seq; Type: SEQUENCE SET; Schema: public; Owner: devwiki_admin
--

SELECT pg_catalog.setval('public.comments_id_seq', 1, false);


--
-- TOC entry 3524 (class 0 OID 0)
-- Dependencies: 229
-- Name: product_categories_id_seq; Type: SEQUENCE SET; Schema: public; Owner: devwiki_admin
--

SELECT pg_catalog.setval('public.product_categories_id_seq', 1, false);


--
-- TOC entry 3525 (class 0 OID 0)
-- Dependencies: 217
-- Name: products_id_seq; Type: SEQUENCE SET; Schema: public; Owner: devwiki_admin
--

SELECT pg_catalog.setval('public.products_id_seq', 7, true);


--
-- TOC entry 3526 (class 0 OID 0)
-- Dependencies: 221
-- Name: tags_id_seq; Type: SEQUENCE SET; Schema: public; Owner: devwiki_admin
--

SELECT pg_catalog.setval('public.tags_id_seq', 1, false);


--
-- TOC entry 3527 (class 0 OID 0)
-- Dependencies: 233
-- Name: tutorial_tags_id_seq; Type: SEQUENCE SET; Schema: public; Owner: devwiki_admin
--

SELECT pg_catalog.setval('public.tutorial_tags_id_seq', 1, false);


--
-- TOC entry 3528 (class 0 OID 0)
-- Dependencies: 231
-- Name: tutorials_id_seq; Type: SEQUENCE SET; Schema: public; Owner: devwiki_admin
--

SELECT pg_catalog.setval('public.tutorials_id_seq', 1, false);


--
-- TOC entry 3529 (class 0 OID 0)
-- Dependencies: 219
-- Name: videos_id_seq; Type: SEQUENCE SET; Schema: public; Owner: devwiki_admin
--

SELECT pg_catalog.setval('public.videos_id_seq', 1, false);


--
-- TOC entry 3530 (class 0 OID 0)
-- Dependencies: 227
-- Name: votes_id_seq; Type: SEQUENCE SET; Schema: public; Owner: devwiki_admin
--

SELECT pg_catalog.setval('public.votes_id_seq', 1, false);


--
-- TOC entry 3303 (class 2606 OID 16465)
-- Name: products PK_0806c755e0aca124e67c0cf6d7d; Type: CONSTRAINT; Schema: public; Owner: devwiki_admin
--

ALTER TABLE ONLY public.products
    ADD CONSTRAINT "PK_0806c755e0aca124e67c0cf6d7d" PRIMARY KEY (id);


--
-- TOC entry 3311 (class 2606 OID 16496)
-- Name: categories PK_24dbc6126a28ff948da33e97d3b; Type: CONSTRAINT; Schema: public; Owner: devwiki_admin
--

ALTER TABLE ONLY public.categories
    ADD CONSTRAINT "PK_24dbc6126a28ff948da33e97d3b" PRIMARY KEY (id);


--
-- TOC entry 3301 (class 2606 OID 16451)
-- Name: accounts PK_5a7a02c20412299d198e097a8fe; Type: CONSTRAINT; Schema: public; Owner: devwiki_admin
--

ALTER TABLE ONLY public.accounts
    ADD CONSTRAINT "PK_5a7a02c20412299d198e097a8fe" PRIMARY KEY (id);


--
-- TOC entry 3324 (class 2606 OID 16549)
-- Name: product_categories PK_7069dac60d88408eca56fdc9e0c; Type: CONSTRAINT; Schema: public; Owner: devwiki_admin
--

ALTER TABLE ONLY public.product_categories
    ADD CONSTRAINT "PK_7069dac60d88408eca56fdc9e0c" PRIMARY KEY (id);


--
-- TOC entry 3318 (class 2606 OID 16518)
-- Name: comments PK_8bf68bc960f2b69e818bdb90dcb; Type: CONSTRAINT; Schema: public; Owner: devwiki_admin
--

ALTER TABLE ONLY public.comments
    ADD CONSTRAINT "PK_8bf68bc960f2b69e818bdb90dcb" PRIMARY KEY (id);


--
-- TOC entry 3305 (class 2606 OID 16475)
-- Name: videos PK_e4c86c0cf95aff16e9fb8220f6b; Type: CONSTRAINT; Schema: public; Owner: devwiki_admin
--

ALTER TABLE ONLY public.videos
    ADD CONSTRAINT "PK_e4c86c0cf95aff16e9fb8220f6b" PRIMARY KEY (id);


--
-- TOC entry 3307 (class 2606 OID 16484)
-- Name: tags PK_e7dc17249a1148a1970748eda99; Type: CONSTRAINT; Schema: public; Owner: devwiki_admin
--

ALTER TABLE ONLY public.tags
    ADD CONSTRAINT "PK_e7dc17249a1148a1970748eda99" PRIMARY KEY (id);


--
-- TOC entry 3326 (class 2606 OID 16562)
-- Name: tutorials PK_e9152ab79d78c6a5e4c7bd47f61; Type: CONSTRAINT; Schema: public; Owner: devwiki_admin
--

ALTER TABLE ONLY public.tutorials
    ADD CONSTRAINT "PK_e9152ab79d78c6a5e4c7bd47f61" PRIMARY KEY (id);


--
-- TOC entry 3329 (class 2606 OID 16570)
-- Name: tutorial_tags PK_ea37a6b7dfb3ae7432cd3d8cb0e; Type: CONSTRAINT; Schema: public; Owner: devwiki_admin
--

ALTER TABLE ONLY public.tutorial_tags
    ADD CONSTRAINT "PK_ea37a6b7dfb3ae7432cd3d8cb0e" PRIMARY KEY (id);


--
-- TOC entry 3321 (class 2606 OID 16540)
-- Name: votes PK_f3d9fd4a0af865152c3f59db8ff; Type: CONSTRAINT; Schema: public; Owner: devwiki_admin
--

ALTER TABLE ONLY public.votes
    ADD CONSTRAINT "PK_f3d9fd4a0af865152c3f59db8ff" PRIMARY KEY (id);


--
-- TOC entry 3313 (class 2606 OID 16619)
-- Name: categories UQ_420d9f679d41281f282f5bc7d09; Type: CONSTRAINT; Schema: public; Owner: devwiki_admin
--

ALTER TABLE ONLY public.categories
    ADD CONSTRAINT "UQ_420d9f679d41281f282f5bc7d09" UNIQUE (slug);


--
-- TOC entry 3315 (class 2606 OID 16498)
-- Name: categories UQ_8b0be371d28245da6e4f4b61878; Type: CONSTRAINT; Schema: public; Owner: devwiki_admin
--

ALTER TABLE ONLY public.categories
    ADD CONSTRAINT "UQ_8b0be371d28245da6e4f4b61878" UNIQUE (name);


--
-- TOC entry 3309 (class 2606 OID 16486)
-- Name: tags UQ_d90243459a697eadb8ad56e9092; Type: CONSTRAINT; Schema: public; Owner: devwiki_admin
--

ALTER TABLE ONLY public.tags
    ADD CONSTRAINT "UQ_d90243459a697eadb8ad56e9092" UNIQUE (name);


--
-- TOC entry 3322 (class 1259 OID 16550)
-- Name: IDX_54f2e1dbf14cfa770f59f0aac8; Type: INDEX; Schema: public; Owner: devwiki_admin
--

CREATE UNIQUE INDEX "IDX_54f2e1dbf14cfa770f59f0aac8" ON public.product_categories USING btree (product_id, category_id);


--
-- TOC entry 3319 (class 1259 OID 16541)
-- Name: IDX_71a75f30ef941b53c730c096a2; Type: INDEX; Schema: public; Owner: devwiki_admin
--

CREATE UNIQUE INDEX "IDX_71a75f30ef941b53c730c096a2" ON public.votes USING btree (user_id, entity_type, entity_id);


--
-- TOC entry 3327 (class 1259 OID 16571)
-- Name: IDX_85f8571b42c08ce796a752d5cd; Type: INDEX; Schema: public; Owner: devwiki_admin
--

CREATE UNIQUE INDEX "IDX_85f8571b42c08ce796a752d5cd" ON public.tutorial_tags USING btree (tutorial_id, tag_id);


--
-- TOC entry 3316 (class 1259 OID 16519)
-- Name: IDX_a3cf15deec04b032ff6333923b; Type: INDEX; Schema: public; Owner: devwiki_admin
--

CREATE INDEX "IDX_a3cf15deec04b032ff6333923b" ON public.comments USING btree (entity_type, entity_id);


--
-- TOC entry 3333 (class 2606 OID 16587)
-- Name: votes FK_27be2cab62274f6876ad6a31641; Type: FK CONSTRAINT; Schema: public; Owner: devwiki_admin
--

ALTER TABLE ONLY public.votes
    ADD CONSTRAINT "FK_27be2cab62274f6876ad6a31641" FOREIGN KEY (user_id) REFERENCES public.accounts(id);


--
-- TOC entry 3337 (class 2606 OID 16612)
-- Name: tutorial_tags FK_30d4d785d209dc911fa91db246b; Type: FK CONSTRAINT; Schema: public; Owner: devwiki_admin
--

ALTER TABLE ONLY public.tutorial_tags
    ADD CONSTRAINT "FK_30d4d785d209dc911fa91db246b" FOREIGN KEY (tag_id) REFERENCES public.tags(id);


--
-- TOC entry 3334 (class 2606 OID 16592)
-- Name: product_categories FK_8748b4a0e8de6d266f2bbc877f6; Type: FK CONSTRAINT; Schema: public; Owner: devwiki_admin
--

ALTER TABLE ONLY public.product_categories
    ADD CONSTRAINT "FK_8748b4a0e8de6d266f2bbc877f6" FOREIGN KEY (product_id) REFERENCES public.products(id);


--
-- TOC entry 3335 (class 2606 OID 16597)
-- Name: product_categories FK_9148da8f26fc248e77a387e3112; Type: FK CONSTRAINT; Schema: public; Owner: devwiki_admin
--

ALTER TABLE ONLY public.product_categories
    ADD CONSTRAINT "FK_9148da8f26fc248e77a387e3112" FOREIGN KEY (category_id) REFERENCES public.categories(id);


--
-- TOC entry 3338 (class 2606 OID 16607)
-- Name: tutorial_tags FK_a9572cd9598c1710b9fb3ae4427; Type: FK CONSTRAINT; Schema: public; Owner: devwiki_admin
--

ALTER TABLE ONLY public.tutorial_tags
    ADD CONSTRAINT "FK_a9572cd9598c1710b9fb3ae4427" FOREIGN KEY (tutorial_id) REFERENCES public.tutorials(id);


--
-- TOC entry 3330 (class 2606 OID 16572)
-- Name: products FK_c1af9b47239151e255f62e03247; Type: FK CONSTRAINT; Schema: public; Owner: devwiki_admin
--

ALTER TABLE ONLY public.products
    ADD CONSTRAINT "FK_c1af9b47239151e255f62e03247" FOREIGN KEY (created_by) REFERENCES public.accounts(id);


--
-- TOC entry 3336 (class 2606 OID 16602)
-- Name: tutorials FK_d04ffed59cb246029b94a30bf30; Type: FK CONSTRAINT; Schema: public; Owner: devwiki_admin
--

ALTER TABLE ONLY public.tutorials
    ADD CONSTRAINT "FK_d04ffed59cb246029b94a30bf30" FOREIGN KEY (author_id) REFERENCES public.accounts(id);


--
-- TOC entry 3331 (class 2606 OID 16582)
-- Name: comments FK_d6f93329801a93536da4241e386; Type: FK CONSTRAINT; Schema: public; Owner: devwiki_admin
--

ALTER TABLE ONLY public.comments
    ADD CONSTRAINT "FK_d6f93329801a93536da4241e386" FOREIGN KEY (parent_id) REFERENCES public.comments(id);


--
-- TOC entry 3332 (class 2606 OID 16577)
-- Name: comments FK_e6d38899c31997c45d128a8973b; Type: FK CONSTRAINT; Schema: public; Owner: devwiki_admin
--

ALTER TABLE ONLY public.comments
    ADD CONSTRAINT "FK_e6d38899c31997c45d128a8973b" FOREIGN KEY (author_id) REFERENCES public.accounts(id);


-- Completed on 2025-07-25 10:50:39

--
-- PostgreSQL database dump complete
--

