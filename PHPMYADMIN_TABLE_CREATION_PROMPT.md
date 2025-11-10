# 🗄️ phpMyAdmin Table Creation Template & Prompt

## 📋 **Universal Prompt for Creating Database Tables**

Use this prompt template to create any database table in phpMyAdmin.

---

## 🎯 **Template Prompt**

```
Create a MySQL table in phpMyAdmin with the following specifications:

**Table Name:** [table_name]

**Columns:**
- id: INT, PRIMARY KEY, AUTO_INCREMENT, NOT NULL
- [field1]: [TYPE], [CONSTRAINTS]
- [field2]: [TYPE], [CONSTRAINTS]
- created_at: TIMESTAMP, DEFAULT CURRENT_TIMESTAMP
- updated_at: TIMESTAMP, DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP

**Additional Requirements:**
- Engine: InnoDB
- Charset: utf8mb4
- Collation: utf8mb4_unicode_ci
- Foreign Keys: [if any]
- Indexes: [if any]
```

---

## 📝 **Standard Table Template**

### **Basic CRUD Table**

```sql
CREATE TABLE IF NOT EXISTS `[table_name]` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `title` VARCHAR(255) NOT NULL,
  `description` TEXT,
  `status` ENUM('active', 'inactive', 'pending') DEFAULT 'pending',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  INDEX `idx_status` (`status`),
  INDEX `idx_created_at` (`created_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

---

## 🎨 **Common Field Types**

### **Text Fields**

```sql
-- Short text
`name` VARCHAR(255) NOT NULL,

-- Long text
`description` TEXT,

-- Medium text
`content` MEDIUMTEXT,

-- Email
`email` VARCHAR(255) NOT NULL,

-- URL
`url` VARCHAR(500),
```

### **Number Fields**

```sql
-- Integer
`quantity` INT(11) DEFAULT 0,

-- Decimal (price)
`price` DECIMAL(10,2) DEFAULT 0.00,

-- Boolean
`is_active` TINYINT(1) DEFAULT 1,

-- Foreign key
`user_id` INT(11) NOT NULL,
```

### **Date/Time Fields**

```sql
-- Date
`published_date` DATE,

-- DateTime
`published_at` DATETIME,

-- Timestamp (auto)
`created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
`updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
```

### **Enum Fields**

```sql
-- Status
`status` ENUM('active', 'inactive', 'pending') DEFAULT 'pending',

-- Category
`category` ENUM('news', 'event', 'announcement') DEFAULT 'news',

-- Type
`type` ENUM('type1', 'type2', 'type3') DEFAULT 'type1',
```

---

## 📋 **Complete Table Examples**

### **Example 1: News Table**

```sql
CREATE TABLE IF NOT EXISTS `news` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `title` VARCHAR(255) NOT NULL,
  `content` TEXT NOT NULL,
  `excerpt` VARCHAR(500),
  `image_url` VARCHAR(500),
  `category` ENUM('news', 'event', 'announcement', 'update') DEFAULT 'news',
  `status` ENUM('draft', 'published', 'archived') DEFAULT 'draft',
  `author_id` INT(11) NOT NULL,
  `published_at` DATETIME,
  `views` INT(11) DEFAULT 0,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  INDEX `idx_status` (`status`),
  INDEX `idx_category` (`category`),
  INDEX `idx_author_id` (`author_id`),
  INDEX `idx_published_at` (`published_at`),
  FOREIGN KEY (`author_id`) REFERENCES `users`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

### **Example 2: Producers Table**

```sql
CREATE TABLE IF NOT EXISTS `producers` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `user_id` INT(11) NOT NULL,
  `business_name` VARCHAR(255) NOT NULL,
  `business_type` ENUM('agriculture', 'livestock', 'fisheries', 'mixed') NOT NULL,
  `description` TEXT,
  `location` VARCHAR(255) NOT NULL,
  `latitude` DECIMAL(10, 8),
  `longitude` DECIMAL(11, 8),
  `region` VARCHAR(100) NOT NULL,
  `products` JSON,
  `certifications` JSON,
  `contact_email` VARCHAR(255),
  `contact_phone` VARCHAR(20),
  `website` VARCHAR(500),
  `social_media` JSON,
  `images` JSON,
  `image` VARCHAR(500),
  `status` ENUM('pending', 'approved', 'rejected') DEFAULT 'pending',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  INDEX `idx_user_id` (`user_id`),
  INDEX `idx_status` (`status`),
  INDEX `idx_region` (`region`),
  INDEX `idx_business_type` (`business_type`),
  FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

### **Example 3: Resources Table**

```sql
CREATE TABLE IF NOT EXISTS `resources` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `title` VARCHAR(255) NOT NULL,
  `description` TEXT,
  `file_url` VARCHAR(500) NOT NULL,
  `file_type` VARCHAR(50) NOT NULL,
  `file_size` INT(11),
  `category` ENUM('document', 'form', 'report', 'law', 'statistics', 'guide') DEFAULT 'document',
  `tags` JSON,
  `creator_id` INT(11) NOT NULL,
  `download_count` INT(11) DEFAULT 0,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  INDEX `idx_category` (`category`),
  INDEX `idx_creator_id` (`creator_id`),
  FOREIGN KEY (`creator_id`) REFERENCES `users`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

### **Example 4: Services Table**

```sql
CREATE TABLE IF NOT EXISTS `services` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `title` VARCHAR(255) NOT NULL,
  `description` TEXT NOT NULL,
  `image_url` VARCHAR(500),
  `category` ENUM('consultation', 'training', 'support', 'other') DEFAULT 'other',
  `price` DECIMAL(10,2),
  `duration` VARCHAR(50),
  `status` ENUM('active', 'inactive', 'pending') DEFAULT 'pending',
  `created_by` INT(11) NOT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  INDEX `idx_status` (`status`),
  INDEX `idx_category` (`category`),
  INDEX `idx_created_by` (`created_by`),
  FOREIGN KEY (`created_by`) REFERENCES `users`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

### **Example 5: Events Table**

```sql
CREATE TABLE IF NOT EXISTS `events` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `title` VARCHAR(255) NOT NULL,
  `description` TEXT NOT NULL,
  `image_url` VARCHAR(500),
  `event_date` DATETIME NOT NULL,
  `location` VARCHAR(255) NOT NULL,
  `latitude` DECIMAL(10, 8),
  `longitude` DECIMAL(11, 8),
  `category` ENUM('workshop', 'seminar', 'conference', 'exhibition', 'other') DEFAULT 'other',
  `status` ENUM('upcoming', 'ongoing', 'completed', 'cancelled') DEFAULT 'upcoming',
  `max_attendees` INT(11),
  `current_attendees` INT(11) DEFAULT 0,
  `organizer_id` INT(11) NOT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  INDEX `idx_status` (`status`),
  INDEX `idx_category` (`category`),
  INDEX `idx_event_date` (`event_date`),
  INDEX `idx_organizer_id` (`organizer_id`),
  FOREIGN KEY (`organizer_id`) REFERENCES `users`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

---

## 🔧 **Common Patterns**

### **Pattern 1: With User Relationship**

```sql
CREATE TABLE IF NOT EXISTS `[table_name]` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `user_id` INT(11) NOT NULL,
  -- other fields --
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  INDEX `idx_user_id` (`user_id`),
  FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

### **Pattern 2: With Image/File URL**

```sql
CREATE TABLE IF NOT EXISTS `[table_name]` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `title` VARCHAR(255) NOT NULL,
  `image_url` VARCHAR(500),
  `file_url` VARCHAR(500),
  -- other fields --
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

### **Pattern 3: With Status Enum**

```sql
CREATE TABLE IF NOT EXISTS `[table_name]` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `title` VARCHAR(255) NOT NULL,
  `status` ENUM('pending', 'active', 'inactive', 'archived') DEFAULT 'pending',
  -- other fields --
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  INDEX `idx_status` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

### **Pattern 4: With JSON Fields**

```sql
CREATE TABLE IF NOT EXISTS `[table_name]` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `title` VARCHAR(255) NOT NULL,
  `metadata` JSON,
  `tags` JSON,
  `settings` JSON,
  -- other fields --
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

---

## 📋 **Quick Checklist**

Before creating table, ensure:

- [ ] Table name is lowercase with underscores (snake_case)
- [ ] All tables have `id` as PRIMARY KEY
- [ ] All tables have `created_at` and `updated_at` timestamps
- [ ] Foreign keys reference existing tables
- [ ] Indexes added for frequently queried columns
- [ ] ENUM values are appropriate
- [ ] Default values are set where needed
- [ ] NOT NULL constraints are correct
- [ ] Charset is utf8mb4
- [ ] Collation is utf8mb4_unicode_ci
- [ ] Engine is InnoDB

---

## 🎯 **Step-by-Step: Creating Table in phpMyAdmin**

1. **Open phpMyAdmin**
   - Go to `http://localhost/phpmyadmin`
   - Select database: `ucaep_db`

2. **Click "SQL" Tab**
   - Click "SQL" tab at top

3. **Paste SQL Query**
   - Copy one of the templates above
   - Replace `[table_name]` with your actual table name
   - Replace `[field1]`, `[field2]`, etc. with your fields
   - Paste into SQL textarea

4. **Click "Go"**
   - Click "Go" button
   - Table will be created

5. **Verify**
   - Check left sidebar for new table
   - Click table to view structure
   - Verify all columns are correct

---

## 🔍 **Useful SQL Commands**

### **Check Table Structure**

```sql
DESCRIBE [table_name];
```

### **Show All Tables**

```sql
SHOW TABLES;
```

### **Drop Table (if needed)**

```sql
DROP TABLE IF EXISTS `[table_name]`;
```

### **Add Column**

```sql
ALTER TABLE `[table_name]` ADD COLUMN `[column_name]` VARCHAR(255) AFTER `[after_column]`;
```

### **Add Index**

```sql
ALTER TABLE `[table_name]` ADD INDEX `idx_[column_name]` (`[column_name]`);
```

### **Add Foreign Key**

```sql
ALTER TABLE `[table_name]` 
ADD CONSTRAINT `fk_[table_name]_[foreign_table]` 
FOREIGN KEY (`[foreign_key_column]`) 
REFERENCES `[foreign_table]`(`id`) 
ON DELETE CASCADE;
```

---

## ✅ **Best Practices**

1. **Naming Convention:**
   - Table names: lowercase, plural, snake_case (e.g., `news`, `producers`)
   - Column names: lowercase, snake_case (e.g., `created_at`, `user_id`)

2. **Always Include:**
   - `id` (PRIMARY KEY, AUTO_INCREMENT)
   - `created_at` (TIMESTAMP)
   - `updated_at` (TIMESTAMP)

3. **Indexes:**
   - Add indexes for foreign keys
   - Add indexes for frequently queried columns
   - Add indexes for status/category fields

4. **Foreign Keys:**
   - Always use `ON DELETE CASCADE` for related data
   - Reference `users` table for user relationships

5. **Data Types:**
   - Use appropriate data types (VARCHAR, INT, TEXT, etc.)
   - Use ENUM for fixed set of values
   - Use JSON for flexible data structures

---

Use these templates to create any table you need! 🚀

