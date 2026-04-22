const express = require('express');
const multer = require('multer');
const path = require('path');
const Student = require('../models/Student');
const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = file.fieldname === 'studentPhoto' ? 'uploads/students/' : 'uploads/guardians/';
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'), false);
    }
  }
});

// GET /api/students - Get all students
router.get('/', async (req, res) => {
  try {
    const { page = 1, limit = 50, search } = req.query;
    const offset = (page - 1) * limit;

    let students;
    if (search) {
      students = await Student.search(search, parseInt(limit));
    } else {
      students = await Student.findAll(parseInt(limit), offset);
    }

    res.json({
      success: true,
      data: students,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: students.length
      }
    });
  } catch (error) {
    console.error('Error fetching students:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch students',
      error: error.message
    });
  }
});

// GET /api/students/stats - Get statistics
router.get('/stats', async (req, res) => {
  try {
    const stats = await Student.getStats();
    res.json({
      success: true,
      data: stats
    });
  } catch (error) {
    console.error('Error fetching stats:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch statistics',
      error: error.message
    });
  }
});

// GET /api/students/:id - Get student by ID
router.get('/:id', async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);
    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Student not found'
      });
    }

    res.json({
      success: true,
      data: student
    });
  } catch (error) {
    console.error('Error fetching student:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch student',
      error: error.message
    });
  }
});

// POST /api/students - Create new student
router.post('/', upload.fields([
  { name: 'studentPhoto', maxCount: 1 },
  { name: 'guardianPhoto', maxCount: 1 }
]), async (req, res) => {
  try {
    const studentData = req.body;

    // Add photo paths if uploaded
    if (req.files) {
      if (req.files.studentPhoto) {
        studentData.studentPhoto = req.files.studentPhoto[0].path;
      }
      if (req.files.guardianPhoto) {
        studentData.guardianPhoto = req.files.guardianPhoto[0].path;
      }
    }

    const result = await Student.create(studentData);

    res.status(201).json({
      success: true,
      message: 'Student registered successfully',
      data: {
        id: result.id,
        studentId: result.studentId
      }
    });
  } catch (error) {
    console.error('Error creating student:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to register student',
      error: error.message
    });
  }
});

// PUT /api/students/:id - Update student
router.put('/:id', upload.fields([
  { name: 'studentPhoto', maxCount: 1 },
  { name: 'guardianPhoto', maxCount: 1 }
]), async (req, res) => {
  try {
    const studentData = req.body;

    // Add photo paths if uploaded
    if (req.files) {
      if (req.files.studentPhoto) {
        studentData.studentPhoto = req.files.studentPhoto[0].path;
      }
      if (req.files.guardianPhoto) {
        studentData.guardianPhoto = req.files.guardianPhoto[0].path;
      }
    }

    const updated = await Student.update(req.params.id, studentData);
    
    if (!updated) {
      return res.status(404).json({
        success: false,
        message: 'Student not found'
      });
    }

    res.json({
      success: true,
      message: 'Student updated successfully'
    });
  } catch (error) {
    console.error('Error updating student:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update student',
      error: error.message
    });
  }
});

// DELETE /api/students/:id - Delete student
router.delete('/:id', async (req, res) => {
  try {
    const deleted = await Student.delete(req.params.id);
    
    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: 'Student not found'
      });
    }

    res.json({
      success: true,
      message: 'Student deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting student:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete student',
      error: error.message
    });
  }
});

module.exports = router;