-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- 1. Devices (anonymous users)
CREATE TABLE devices (
    id UUID PRIMARY KEY,
    created_at TIMESTAMP DEFAULT NOW()
);

-- 2. Publishers / Verified Users
CREATE TABLE publishers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    device_id UUID REFERENCES devices(id) ON DELETE SET NULL,
    name TEXT,
    email TEXT UNIQUE NOT NULL,
    email_verified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT NOW(),
    verified_at TIMESTAMP
);

-- 3. Calculator types
CREATE TYPE calculator_type AS ENUM ('simple','advanced');

-- 4. Calculators
CREATE TABLE calculators (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    publisher_id UUID REFERENCES publishers(id) ON DELETE CASCADE, -- null for device-only private
    device_id UUID REFERENCES devices(id) ON DELETE SET NULL,      -- owner for private calculators
    type calculator_type NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    published BOOLEAN DEFAULT FALSE,   -- true = server-public, false = private
    ratings_count INTEGER DEFAULT 0,
    ratings_avg NUMERIC(3,2) DEFAULT 0,
    usage_count INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    deleted_at TIMESTAMP
);

-- 5. Semesters (1 or 2 per calculator)
CREATE TABLE semesters (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    calculator_id UUID NOT NULL REFERENCES calculators(id) ON DELETE CASCADE,
    name TEXT NOT NULL CHECK (name IN ('s1','s2')),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    deleted_at TIMESTAMP,
    UNIQUE(calculator_id, name)
);

-- 6. Units (Advanced calculators only)
CREATE TABLE units (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    semester_id UUID NOT NULL REFERENCES semesters(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    deleted_at TIMESTAMP
);

-- 7. Modules (Simple & Advanced with weights)
CREATE TABLE modules (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    semester_id UUID NOT NULL REFERENCES semesters(id) ON DELETE CASCADE,
    unit_id UUID REFERENCES units(id) ON DELETE CASCADE,   -- null for simple calculators
    name TEXT NOT NULL,
    coeff INTEGER NOT NULL DEFAULT 1 CHECK (coeff >= 0),
    has_td BOOLEAN DEFAULT FALSE,
    has_tp BOOLEAN DEFAULT FALSE,
    -- Advanced-specific fields
    credit INTEGER,
    weight_exam NUMERIC(5,2), -- 0-100%
    weight_td NUMERIC(5,2),
    weight_tp NUMERIC(5,2),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    deleted_at TIMESTAMP
);

-- 8. Calculator ratings
CREATE TABLE calculator_ratings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    calculator_id UUID NOT NULL REFERENCES calculators(id) ON DELETE CASCADE,
    device_id UUID NOT NULL REFERENCES devices(id) ON DELETE CASCADE,
    rating INTEGER NOT NULL CHECK (rating BETWEEN 1 AND 5),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(calculator_id, device_id)
);

-- 9. Calculator usage
CREATE TABLE calculator_usage (
    calculator_id UUID NOT NULL REFERENCES calculators(id) ON DELETE CASCADE,
    device_id UUID NOT NULL REFERENCES devices(id) ON DELETE CASCADE,
    first_used_at TIMESTAMP DEFAULT NOW(),
    PRIMARY KEY (calculator_id, device_id)
);

-- 10. Indexes for performance
CREATE INDEX idx_calculators_device ON calculators(device_id);
CREATE INDEX idx_semesters_calculator ON semesters(calculator_id);
CREATE INDEX idx_units_semester ON units(semester_id);
CREATE INDEX idx_modules_semester ON modules(semester_id);
CREATE INDEX idx_modules_unit ON modules(unit_id);
CREATE INDEX idx_ratings_calculator ON calculator_ratings(calculator_id);
CREATE INDEX idx_usage_calculator ON calculator_usage(calculator_id);

-- 11. Auto-update trigger for updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
   NEW.updated_at = NOW();
   RETURN NEW;
END;
$$ LANGUAGE 'plpgsql';

-- Attach triggers
CREATE TRIGGER trig_update_calculators BEFORE UPDATE ON calculators
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER trig_update_semesters BEFORE UPDATE ON semesters
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER trig_update_units BEFORE UPDATE ON units
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER trig_update_modules BEFORE UPDATE ON modules
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER trig_update_ratings BEFORE UPDATE ON calculator_ratings
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
