const DB_PREFIX = 'attendance_app_';

export const storageService = {
  // User Management
  getUser: (username) => {
    const users = JSON.parse(localStorage.getItem(`${DB_PREFIX}users`) || '[]');
    return users.find(u => u.username === username);
  },

  createUser: (username, password) => {
    const users = JSON.parse(localStorage.getItem(`${DB_PREFIX}users`) || '[]');
    if (users.find(u => u.username === username)) {
      throw new Error('User already exists');
    }
    const newUser = { id: crypto.randomUUID(), username, password, createdAt: new Date() };
    users.push(newUser);
    localStorage.setItem(`${DB_PREFIX}users`, JSON.stringify(users));
    
    // Initialize empty data for new user
    const initialData = {
      settings: {
        courseName: '',
        semesterStart: null,
        lastWorkingDate: null,
        subjects: []
      },
      holidays: [], // List of date strings 'YYYY-MM-DD'
      attendance: {} // { 'YYYY-MM-DD': { 0: { status: 'Present', subject: 'Math' } } }
    };
    localStorage.setItem(`${DB_PREFIX}data_${newUser.id}`, JSON.stringify(initialData));
    
    return newUser;
  },

  // Data Management
  getData: (userId) => {
    return JSON.parse(localStorage.getItem(`${DB_PREFIX}data_${userId}`) || 'null');
  },

  saveData: (userId, data) => {
    localStorage.setItem(`${DB_PREFIX}data_${userId}`, JSON.stringify(data));
  }
};
