const { pool } = require('../database/connection');

class Student {
  // Generate unique student ID
  static async generateStudentId() {
    const year = new Date().getFullYear();
    const [rows] = await pool.execute(
      'SELECT COUNT(*) as count FROM students WHERE YEAR(registration_date) = ?',
      [year]
    );
    const count = rows[0].count + 1;
    return `EOC-${year}-${String(count).padStart(4, '0')}`;
  }

  // Create new student
  static async create(studentData) {
    const studentId = await this.generateStudentId();
    
    const query = `
      INSERT INTO students (
        student_id, student_name_am, student_name_en, father_name_am, father_name_en,
        grandfather_name_am, grandfather_name_en, birth_date, age, christian_name_am,
        christian_name_en, confession_father_am, confession_father_en, phone,
        address_am, address_en, subcity_am, subcity_en, district_am, district_en,
        house_number, school_level_am, school_level_en, student_phone,
        guardian_name_am, guardian_name_en, relationship_am, relationship_en,
        guardian_district_am, guardian_district_en, guardian_house_number, guardian_phone,
        class_level, student_photo, guardian_photo, form_filler_name_am, form_filler_name_en,
        responsible_person_am, responsible_person_en
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const values = [
      studentId,
      studentData.studentNameAm,
      studentData.studentNameEn,
      studentData.fatherNameAm,
      studentData.fatherNameEn,
      studentData.grandfatherNameAm,
      studentData.grandfatherNameEn,
      studentData.birthDate,
      studentData.age,
      studentData.christianNameAm || null,
      studentData.christianNameEn || null,
      studentData.confessionFatherAm || null,
      studentData.confessionFatherEn || null,
      studentData.phone || null,
      studentData.addressAm,
      studentData.addressEn,
      studentData.subcityAm,
      studentData.subcityEn,
      studentData.districtAm,
      studentData.districtEn,
      studentData.houseNumber,
      studentData.schoolLevelAm || null,
      studentData.schoolLevelEn || null,
      studentData.studentPhone || null,
      studentData.guardianNameAm,
      studentData.guardianNameEn,
      studentData.relationshipAm,
      studentData.relationshipEn,
      studentData.guardianDistrictAm,
      studentData.guardianDistrictEn,
      studentData.guardianHouseNumber,
      studentData.guardianPhone || null,
      studentData.classLevel,
      studentData.studentPhoto || null,
      studentData.guardianPhoto || null,
      studentData.formFillerNameAm,
      studentData.formFillerNameEn,
      studentData.responsiblePersonAm,
      studentData.responsiblePersonEn
    ];

    const [result] = await pool.execute(query, values);
    return { id: result.insertId, studentId };
  }

  // Get all students
  static async findAll(limit = 100, offset = 0) {
    const query = `
      SELECT * FROM students 
      ORDER BY registration_date DESC 
      LIMIT ? OFFSET ?
    `;
    const [rows] = await pool.execute(query, [limit, offset]);
    return rows;
  }

  // Find student by ID
  static async findById(id) {
    const query = 'SELECT * FROM students WHERE id = ?';
    const [rows] = await pool.execute(query, [id]);
    return rows[0];
  }

  // Find student by student ID
  static async findByStudentId(studentId) {
    const query = 'SELECT * FROM students WHERE student_id = ?';
    const [rows] = await pool.execute(query, [studentId]);
    return rows[0];
  }

  // Search students
  static async search(searchTerm, limit = 50) {
    const query = `
      SELECT * FROM students 
      WHERE student_name_am LIKE ? 
         OR student_name_en LIKE ? 
         OR student_id LIKE ?
         OR father_name_am LIKE ?
         OR father_name_en LIKE ?
      ORDER BY registration_date DESC 
      LIMIT ?
    `;
    const searchPattern = `%${searchTerm}%`;
    const [rows] = await pool.execute(query, [
      searchPattern, searchPattern, searchPattern, 
      searchPattern, searchPattern, limit
    ]);
    return rows;
  }

  // Update student
  static async update(id, studentData) {
    const fields = [];
    const values = [];

    Object.keys(studentData).forEach(key => {
      if (studentData[key] !== undefined) {
        fields.push(`${key} = ?`);
        values.push(studentData[key]);
      }
    });

    if (fields.length === 0) return false;

    values.push(id);
    const query = `UPDATE students SET ${fields.join(', ')} WHERE id = ?`;
    const [result] = await pool.execute(query, values);
    return result.affectedRows > 0;
  }

  // Delete student
  static async delete(id) {
    const query = 'DELETE FROM students WHERE id = ?';
    const [result] = await pool.execute(query, [id]);
    return result.affectedRows > 0;
  }

  // Get statistics
  static async getStats() {
    const queries = [
      'SELECT COUNT(*) as total FROM students',
      'SELECT COUNT(*) as today FROM students WHERE DATE(registration_date) = CURDATE()',
      'SELECT COUNT(DISTINCT class_level) as grades FROM students',
      'SELECT class_level, COUNT(*) as count FROM students GROUP BY class_level ORDER BY class_level'
    ];

    const [totalResult] = await pool.execute(queries[0]);
    const [todayResult] = await pool.execute(queries[1]);
    const [gradesResult] = await pool.execute(queries[2]);
    const [classDistribution] = await pool.execute(queries[3]);

    return {
      total: totalResult[0].total,
      today: todayResult[0].today,
      grades: gradesResult[0].grades,
      classDistribution
    };
  }
}

module.exports = Student;