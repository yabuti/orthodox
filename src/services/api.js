const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

class ApiService {
  // Helper method for making requests
  async request(endpoint, options = {}) {
    const url = `${API_BASE_URL}${endpoint}`;
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    // Don't set Content-Type for FormData
    if (options.body instanceof FormData) {
      delete config.headers['Content-Type'];
    }

    try {
      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || `HTTP error! status: ${response.status}`);
      }

      return data;
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  // Student API methods
  async createStudent(studentData, studentPhoto, guardianPhoto) {
    const formData = new FormData();
    
    // Add all student data to FormData
    Object.keys(studentData).forEach(key => {
      if (studentData[key] !== null && studentData[key] !== undefined) {
        formData.append(key, studentData[key]);
      }
    });

    // Add photos
    if (studentPhoto) {
      formData.append('studentPhoto', studentPhoto);
    }
    if (guardianPhoto) {
      formData.append('guardianPhoto', guardianPhoto);
    }

    return this.request('/students', {
      method: 'POST',
      body: formData,
    });
  }

  async getStudents(page = 1, limit = 50, search = '') {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
    });

    if (search) {
      params.append('search', search);
    }

    return this.request(`/students?${params}`);
  }

  async getStudent(id) {
    return this.request(`/students/${id}`);
  }

  async updateStudent(id, studentData, studentPhoto, guardianPhoto) {
    const formData = new FormData();
    
    Object.keys(studentData).forEach(key => {
      if (studentData[key] !== null && studentData[key] !== undefined) {
        formData.append(key, studentData[key]);
      }
    });

    if (studentPhoto) {
      formData.append('studentPhoto', studentPhoto);
    }
    if (guardianPhoto) {
      formData.append('guardianPhoto', guardianPhoto);
    }

    return this.request(`/students/${id}`, {
      method: 'PUT',
      body: formData,
    });
  }

  async deleteStudent(id) {
    return this.request(`/students/${id}`, {
      method: 'DELETE',
    });
  }

  async getStudentStats() {
    return this.request('/students/stats');
  }

  // Health check
  async healthCheck() {
    return this.request('/health');
  }
}

export default new ApiService();