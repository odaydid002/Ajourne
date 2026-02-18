-- 1. Devices
CREATE TABLE devices (
    id TEXT PRIMARY KEY,
    name TEXT,
    age INTEGER,
    speciality TEXT,
    level TEXT,
    university TEXT,
    created_at TEXT
);

-- 2. Publishers
CREATE TABLE publishers (
    id TEXT PRIMARY KEY,
    device_id TEXT,
    name TEXT,
    email TEXT UNIQUE,
    email_verified INTEGER DEFAULT 0,
    created_at TEXT,
    verified_at TEXT
);

-- 3. Calculators
CREATE TABLE calculators (
    id TEXT PRIMARY KEY,
    publisher_id TEXT,    -- null for private calculators
    device_id TEXT,       -- owner for private calculators
    type TEXT CHECK (type IN ('simple','advanced')),
    title TEXT,
    description TEXT,
    published INTEGER DEFAULT 0,  -- 0=private, 1=published
    ratings_count INTEGER DEFAULT 0,
    ratings_avg REAL DEFAULT 0,
    usage_count INTEGER DEFAULT 0,
    created_at TEXT,
    updated_at TEXT,
    deleted_at TEXT,
    synced INTEGER DEFAULT 0
);

-- 4. Semesters
CREATE TABLE semesters (
    id TEXT PRIMARY KEY,
    calculator_id TEXT,
    name TEXT CHECK (name IN ('s1','s2')),
    created_at TEXT,
    updated_at TEXT,
    deleted_at TEXT,
    synced INTEGER DEFAULT 0,
    UNIQUE(calculator_id, name)
);

-- 5. Units
CREATE TABLE units (
    id TEXT PRIMARY KEY,
    semester_id TEXT,
    title TEXT,
    created_at TEXT,
    updated_at TEXT,
    deleted_at TEXT,
    synced INTEGER DEFAULT 0
);

-- 6. Modules (Simple & Advanced)
CREATE TABLE modules (
    id TEXT PRIMARY KEY,
    semester_id TEXT,
    unit_id TEXT,
    name TEXT,
    coeff INTEGER DEFAULT 1,
    has_td INTEGER DEFAULT 0,
    has_tp INTEGER DEFAULT 0,
    credit INTEGER,
    weight_exam REAL,
    weight_td REAL,
    weight_tp REAL,
    created_at TEXT,
    updated_at TEXT,
    deleted_at TEXT,
    synced INTEGER DEFAULT 0
);

-- 7. Calculator ratings
CREATE TABLE calculator_ratings (
    id TEXT PRIMARY KEY,
    calculator_id TEXT,
    device_id TEXT,
    rating INTEGER CHECK (rating BETWEEN 1 AND 5),
    created_at TEXT,
    updated_at TEXT,
    synced INTEGER DEFAULT 0,
    UNIQUE(calculator_id, device_id)
);

-- 8. Calculator usage
CREATE TABLE calculator_usage (
    calculator_id TEXT,
    device_id TEXT,
    first_used_at TEXT,
    PRIMARY KEY (calculator_id, device_id)
);
