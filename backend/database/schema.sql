-- Create database
CREATE DATABASE IF NOT EXISTS ethiopian_orthodox_church CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

USE ethiopian_orthodox_church;

-- Drop existing table to recreate with new schema
DROP TABLE IF EXISTS students;

-- Students table
CREATE TABLE IF NOT EXISTS students (
    id INT AUTO_INCREMENT PRIMARY KEY,
    student_id VARCHAR(20) UNIQUE NOT NULL,
    
    -- Student Information (Bilingual) - Allow empty for one language
    student_name_am VARCHAR(255) DEFAULT '',
    student_name_en VARCHAR(255) DEFAULT '',
    father_name_am VARCHAR(255) DEFAULT '',
    father_name_en VARCHAR(255) DEFAULT '',
    grandfather_name_am VARCHAR(255) DEFAULT '',
    grandfather_name_en VARCHAR(255) DEFAULT '',
    birth_date DATE NOT NULL,
    age INT NOT NULL,
    christian_name_am VARCHAR(255) DEFAULT '',
    christian_name_en VARCHAR(255) DEFAULT '',
    confession_father_am VARCHAR(255) DEFAULT '',
    confession_father_en VARCHAR(255) DEFAULT '',
    phone VARCHAR(20) DEFAULT '',
    
    -- Address Information (Bilingual)
    address_am TEXT,
    address_en TEXT,
    subcity_am VARCHAR(255) DEFAULT '',
    subcity_en VARCHAR(255) DEFAULT '',
    district_am VARCHAR(255) DEFAULT '',
    district_en VARCHAR(255) DEFAULT '',
    house_number VARCHAR(50) DEFAULT '',
    school_level_am VARCHAR(255) DEFAULT '',
    school_level_en VARCHAR(255) DEFAULT '',
    student_phone VARCHAR(20) DEFAULT '',
    
    -- Guardian Information (Bilingual)
    guardian_name_am VARCHAR(255) DEFAULT '',
    guardian_name_en VARCHAR(255) DEFAULT '',
    relationship_am VARCHAR(255) DEFAULT '',
    relationship_en VARCHAR(255) DEFAULT '',
    guardian_district_am VARCHAR(255) DEFAULT '',
    guardian_district_en VARCHAR(255) DEFAULT '',
    guardian_house_number VARCHAR(50) DEFAULT '',
    guardian_phone VARCHAR(20) DEFAULT '',
    
    -- Additional Information
    class_level INT NOT NULL,
    student_photo VARCHAR(500) DEFAULT '',
    guardian_photo VARCHAR(500) DEFAULT '',
    form_filler_name_am VARCHAR(255) DEFAULT '',
    form_filler_name_en VARCHAR(255) DEFAULT '',
    responsible_person_am VARCHAR(255) DEFAULT '',
    responsible_person_en VARCHAR(255) DEFAULT '',
    
    -- System fields
    registration_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_student_id (student_id),
    INDEX idx_student_name_am (student_name_am),
    INDEX idx_student_name_en (student_name_en),
    INDEX idx_class_level (class_level),
    INDEX idx_registration_date (registration_date)
);

-- Users table (for registration/login)
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    full_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(20) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    is_verified BOOLEAN DEFAULT FALSE,
    verification_code VARCHAR(6),
    verification_expires TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_email (email),
    INDEX idx_phone (phone)
);

-- Admin users table
CREATE TABLE IF NOT EXISTS admin_users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    email VARCHAR(255),
    full_name VARCHAR(255),
    role ENUM('admin', 'super_admin') DEFAULT 'admin',
    is_active BOOLEAN DEFAULT TRUE,
    last_login TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Insert default admin user (password: admin123)
INSERT INTO admin_users (username, password_hash, email, full_name, role) 
VALUES ('admin', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'admin@church.com', 'Church Administrator', 'super_admin')
ON DUPLICATE KEY UPDATE username = username;

-- System settings table
CREATE TABLE IF NOT EXISTS system_settings (
    id INT AUTO_INCREMENT PRIMARY KEY,
    setting_key VARCHAR(100) UNIQUE NOT NULL,
    setting_value TEXT,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Insert default settings
INSERT INTO system_settings (setting_key, setting_value, description) VALUES
('church_name_am', 'ኢትዮጵያ ኦርቶዶክስ ተዋሕዶ ቤተ ክርስቲያን', 'Church name in Amharic'),
('church_name_en', 'Ethiopian Orthodox Tewahedo Church', 'Church name in English'),
('registration_enabled', 'true', 'Enable/disable student registration'),
('max_students_per_class', '30', 'Maximum students per class'),
('current_academic_year', '2024', 'Current academic year')
ON DUPLICATE KEY UPDATE setting_key = setting_key;
