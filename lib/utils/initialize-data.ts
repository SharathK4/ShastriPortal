import ConnectorService from "@/lib/services/connector-service";

// Function to load mock data from pages into ConnectorService
export function initializeData() {
  // Initialize the connector service data stores
  ConnectorService.initializeIfEmpty();
  
  // Add mock departments from the departments page if none exist
  if (ConnectorService.departments.getAll().length === 0) {
    const mockDepartments = [
      {
        id: "DEPT001",
        code: "CSE",
        name: "Computer Science Engineering",
        description: "Department of Computer Science and Engineering focuses on the study of algorithms, programming languages, and computing systems.",
        headName: "Dr. Rajesh Sharma",
        headId: "FAC1001",
        establishedYear: 1995,
        facultyCount: 25,
        studentCount: 450,
        courses: 35,
        batches: 4
      },
      {
        id: "DEPT002",
        code: "EEE",
        name: "Electrical Engineering",
        description: "Department of Electrical Engineering covers the study of electricity, electronics, and electromagnetism for power systems and more.",
        headName: "Dr. Suresh Patel",
        headId: "FAC1004",
        establishedYear: 1990,
        facultyCount: 20,
        studentCount: 380,
        courses: 30,
        batches: 4
      },
      {
        id: "DEPT003",
        code: "ME",
        name: "Mechanical Engineering",
        description: "Department of Mechanical Engineering focuses on design, production, and operation of machinery and tools.",
        headName: "Dr. Ramesh Reddy",
        headId: "FAC1006",
        establishedYear: 1985,
        facultyCount: 22,
        studentCount: 420,
        courses: 32,
        batches: 4
      },
      {
        id: "DEPT004",
        code: "CE",
        name: "Civil Engineering",
        description: "Department of Civil Engineering deals with design, construction, and maintenance of physical and naturally built environment.",
        headName: "Dr. Mahesh Mishra",
        headId: "FAC1007",
        establishedYear: 1985,
        facultyCount: 18,
        studentCount: 350,
        courses: 28,
        batches: 4
      },
      {
        id: "DEPT005",
        code: "ECE",
        name: "Electronics & Communication",
        description: "Department of Electronics and Communication Engineering focuses on electronic devices, circuits, communication equipment and systems.",
        headName: "Dr. Dinesh Joshi",
        headId: "FAC1008",
        establishedYear: 1992,
        facultyCount: 21,
        studentCount: 400,
        courses: 30,
        batches: 4
      }
    ];
    
    // Add departments to connector service
    mockDepartments.forEach(department => {
      ConnectorService.departments.create(department);
    });
  }
  
  // Add faculty mock data
  if (ConnectorService.faculty.getAll().length === 0) {
    generateMockFaculty(30).forEach(faculty => {
      ConnectorService.faculty.create(faculty);
    });
  }
  
  // Add student mock data
  if (ConnectorService.students.getAll().length === 0) {
    generateMockStudents(50).forEach(student => {
      ConnectorService.students.create(student);
    });
  }
  
  // Add course mock data
  if (ConnectorService.courses.getAll().length === 0) {
    const mockCourses = [
      { 
        id: "CRS1001", 
        code: "CS101",
        name: "Introduction to Computer Science", 
        description: "Basic introduction to computer science principles and programming",
        credits: 4,
        department: "Computer Science Engineering", 
        semester: 1,
        facultyId: "FAC1001",
        facultyName: "Dr. Rajesh Sharma",
        status: "active" as const,
        syllabus: [
          "Introduction to Computing",
          "Algorithms and Flowcharts",
          "Programming Basics",
          "Data Types and Variables",
          "Control Structures"
        ]
      },
      { 
        id: "CRS1002", 
        code: "CS201",
        name: "Data Structures", 
        description: "Advanced data structures and their implementations",
        credits: 4,
        department: "Computer Science Engineering", 
        semester: 3,
        facultyId: "FAC1002",
        facultyName: "Dr. Suresh Patel",
        status: "active" as const,
        syllabus: [
          "Arrays and Linked Lists",
          "Stacks and Queues",
          "Trees and Graphs",
          "Hashing",
          "Advanced Data Structures"
        ]
      },
      { 
        id: "CRS1003", 
        code: "CS301",
        name: "Algorithms", 
        description: "Design and analysis of algorithms",
        credits: 4,
        department: "Computer Science Engineering", 
        semester: 4,
        facultyId: "FAC1003",
        facultyName: "Dr. Mahesh Gupta",
        status: "active" as const,
        syllabus: [
          "Algorithm Analysis",
          "Divide and Conquer",
          "Greedy Algorithms",
          "Dynamic Programming",
          "NP-Completeness"
        ]
      },
      { 
        id: "CRS1004", 
        code: "EE101",
        name: "Basic Electrical Engineering", 
        description: "Fundamentals of electrical engineering",
        credits: 3,
        department: "Electrical Engineering", 
        semester: 1,
        facultyId: "FAC1004",
        facultyName: "Dr. Anil Kumar",
        status: "active" as const,
        syllabus: [
          "Circuit Theory",
          "Network Analysis",
          "AC Fundamentals",
          "Transformers",
          "Electrical Machines"
        ]
      },
      { 
        id: "CRS1005", 
        code: "EE201",
        name: "Analog Electronics", 
        description: "Study of analog electronic circuits and devices",
        credits: 4,
        department: "Electrical Engineering", 
        semester: 3,
        facultyId: "FAC1005",
        facultyName: "Dr. Harish Singh",
        status: "active" as const,
        syllabus: [
          "Semiconductor Devices",
          "Diodes and Applications",
          "BJT and FET",
          "Amplifiers",
          "Operational Amplifiers"
        ]
      },
      { 
        id: "CRS1006", 
        code: "ME101",
        name: "Engineering Mechanics", 
        description: "Fundamentals of mechanics for engineering applications",
        credits: 3,
        department: "Mechanical Engineering", 
        semester: 1,
        facultyId: "FAC1006",
        facultyName: "Dr. Ramesh Reddy",
        status: "active" as const,
        syllabus: [
          "Force Systems",
          "Equilibrium",
          "Kinematics",
          "Dynamics",
          "Friction"
        ]
      },
      { 
        id: "CRS1007", 
        code: "CE101",
        name: "Engineering Drawing", 
        description: "Fundamentals of engineering graphics and drawing",
        credits: 3,
        department: "Civil Engineering", 
        semester: 1,
        facultyId: "FAC1007",
        facultyName: "Dr. Satish Mishra",
        status: "active" as const,
        syllabus: [
          "Orthographic Projection",
          "Isometric Views",
          "Sectional Views",
          "Dimensioning",
          "Computer Aided Drawing"
        ]
      },
      { 
        id: "CRS1008", 
        code: "EC101",
        name: "Digital Electronics", 
        description: "Fundamentals of digital circuits and systems",
        credits: 4,
        department: "Electronics & Communication", 
        semester: 2,
        facultyId: "FAC1008",
        facultyName: "Dr. Dinesh Joshi",
        status: "active" as const,
        syllabus: [
          "Number Systems",
          "Boolean Algebra",
          "Logic Gates",
          "Combinational Circuits",
          "Sequential Circuits"
        ]
      }
    ];
    
    // Add courses to connector service
    mockCourses.forEach(course => {
      ConnectorService.courses.create(course);
    });
  }
  
  // Add batch mock data
  if (ConnectorService.batches.getAll().length === 0) {
    const mockBatches = [
      {
        id: "BATCH001",
        name: "CS 2020-24",
        startYear: 2020,
        endYear: 2024,
        department: "Computer Science Engineering",
        sections: ["1", "2", "3", "4"],
        courseIds: ["CRS1001", "CRS1002", "CRS1003"],
        studentCount: 120,
        status: "active" as const
      },
      {
        id: "BATCH002",
        name: "CS 2021-25",
        startYear: 2021,
        endYear: 2025,
        department: "Computer Science Engineering",
        sections: ["1", "2", "3"],
        courseIds: ["CRS1001", "CRS1002"],
        studentCount: 90,
        status: "active" as const
      },
      {
        id: "BATCH003",
        name: "CS 2022-26",
        startYear: 2022,
        endYear: 2026,
        department: "Computer Science Engineering",
        sections: ["1", "2", "3", "4"],
        courseIds: ["CRS1001"],
        studentCount: 120,
        status: "active" as const
      },
      {
        id: "BATCH004",
        name: "CS 2023-27",
        startYear: 2023,
        endYear: 2027,
        department: "Computer Science Engineering",
        sections: ["1", "2", "3"],
        courseIds: ["CRS1001"],
        studentCount: 90,
        status: "active" as const
      },
      {
        id: "BATCH005",
        name: "EE 2020-24",
        startYear: 2020,
        endYear: 2024,
        department: "Electrical Engineering",
        sections: ["1", "2"],
        courseIds: ["CRS1004", "CRS1005"],
        studentCount: 60,
        status: "active" as const
      },
      {
        id: "BATCH006",
        name: "EE 2021-25",
        startYear: 2021,
        endYear: 2025,
        department: "Electrical Engineering",
        sections: ["1", "2"],
        courseIds: ["CRS1004"],
        studentCount: 60,
        status: "active" as const
      }
    ];
    
    // Add batches to connector service
    mockBatches.forEach(batch => {
      ConnectorService.batches.create(batch);
    });
  }
  
  // Add faculty schedule mock data
  if (ConnectorService.schedules.getAll().length === 0) {
    generateMockSchedules(50).forEach(schedule => {
      ConnectorService.schedules.create(schedule);
    });
  }
}

// Generate random faculty data
function generateMockFaculty(count: number) {
  const departments = [
    "Computer Science Engineering", 
    "Electrical Engineering", 
    "Mechanical Engineering", 
    "Civil Engineering", 
    "Electronics & Communication"
  ];
  
  const designations = [
    "Professor",
    "Associate Professor",
    "Assistant Professor",
    "Lecturer",
    "Visiting Faculty",
    "Professor Emeritus",
    "Department Head"
  ];
  
  const randomFirstNames = [
    "Anil", "Rajesh", "Suresh", "Mahesh", "Ramesh", "Harish", 
    "Prakash", "Dinesh", "Satish", "Ravi", "Ajay", "Vijay"
  ];
  
  const randomLastNames = [
    "Sharma", "Gupta", "Patel", "Singh", "Kumar", "Verma", 
    "Mishra", "Joshi", "Yadav", "Reddy", "Agarwal", "Iyer"
  ];
  
  const randomCities = [
    "Delhi", "Mumbai", "Bangalore", "Chennai", 
    "Kolkata", "Hyderabad", "Pune"
  ];
  
  const randomStates = [
    "Maharashtra", "Karnataka", "Tamil Nadu", "Delhi", 
    "West Bengal", "Telangana", "Gujarat"
  ];
  
  const specializations = [
    "Artificial Intelligence", "Machine Learning", "Database Systems", "Computer Networks",
    "Power Systems", "Electronics", "Structural Engineering", "Thermal Engineering",
    "Communication Systems", "VLSI Design", "Software Engineering", "Cybersecurity"
  ];
  
  const qualifications = [
    "Ph.D.", "M.Tech.", "M.E.", "M.S.", "MBA", "B.Tech."
  ];
  
  const batches = [
    "CS 2020-24", "CS 2021-25", "CS 2022-26", "CS 2023-27", 
    "EE 2020-24", "EE 2021-25"
  ];
  
  const sections = ["1", "2", "3", "4", "5", "6", "7"];
  
  return Array.from({ length: count }).map((_, index) => {
    const id = `FAC${1000 + index}`;
    const departmentIndex = Math.floor(Math.random() * departments.length);
    const designationIndex = Math.floor(Math.random() * designations.length);
    
    const firstName = randomFirstNames[Math.floor(Math.random() * randomFirstNames.length)];
    const lastName = randomLastNames[Math.floor(Math.random() * randomLastNames.length)];
    const name = `Dr. ${firstName} ${lastName}`;
    
    const randomQualifications = Array.from(
      { length: Math.floor(Math.random() * 2) + 1 }, 
      () => qualifications[Math.floor(Math.random() * qualifications.length)]
    );
    randomQualifications.unshift("Ph.D."); // All faculty have Ph.D.
    
    // Generate a random join date between 2005 and 2022
    const joinYear = 2005 + Math.floor(Math.random() * 18);
    const joinMonth = Math.floor(Math.random() * 12) + 1;
    const joinDay = Math.floor(Math.random() * 28) + 1;
    const joinDate = `${joinYear}-${joinMonth.toString().padStart(2, '0')}-${joinDay.toString().padStart(2, '0')}`;
    
    // Generate random assigned batches (1-3)
    const numBatches = Math.floor(Math.random() * 3) + 1;
    const assignedBatches = Array.from({ length: numBatches }, () => {
      const batchIndex = Math.floor(Math.random() * batches.length);
      const sectionIndex = Math.floor(Math.random() * sections.length);
      return {
        batchId: `BATCH${1000 + batchIndex}`,
        batchName: batches[batchIndex],
        section: sections[sectionIndex]
      }
    });
    
    // Generate random assigned courses (1-4)
    const numCourses = Math.floor(Math.random() * 4) + 1;
    const assignedCourses = Array.from({ length: numCourses }, () => {
      const courseNames = [
        "Data Structures", "Algorithms", "Database Management", "Computer Networks",
        "Operating Systems", "Software Engineering", "Machine Learning", "Artificial Intelligence",
        "Digital Electronics", "Power Systems", "Control Systems", "Structural Analysis"
      ];
      
      return {
        courseId: `CRS${1000 + Math.floor(Math.random() * 100)}`,
        courseName: courseNames[Math.floor(Math.random() * courseNames.length)],
        semester: Math.floor(Math.random() * 8) + 1
      }
    });
    
    const statusOptions = ["active", "on leave", "sabbatical", "retired"] as const;
    const statusWeights = [0.8, 0.1, 0.05, 0.05]; // 80% active, 10% on leave, 5% sabbatical, 5% retired
    const statusRandom = Math.random();
    let statusIndex = 0;
    let weightSum = 0;
    
    for (let i = 0; i < statusWeights.length; i++) {
      weightSum += statusWeights[i];
      if (statusRandom <= weightSum) {
        statusIndex = i;
        break;
      }
    }
    
    return {
      id,
      employeeId: `EMP${2000 + index}`,
      name,
      email: `${name.toLowerCase().replace(/dr\.\s/g, '').replace(/\s/g, '.')}@faculty.edu`,
      phone: `+91 ${Math.floor(7000000000 + Math.random() * 2999999999)}`,
      address: {
        street: `${Math.floor(1 + Math.random() * 999)}, ${Math.random() > 0.5 ? 'Main' : 'Park'} Street`,
        city: randomCities[Math.floor(Math.random() * randomCities.length)],
        state: randomStates[Math.floor(Math.random() * randomStates.length)],
        pincode: `${Math.floor(100000 + Math.random() * 899999)}`
      },
      department: departments[departmentIndex],
      designation: designations[designationIndex],
      specialization: specializations[Math.floor(Math.random() * specializations.length)],
      qualifications: randomQualifications,
      joinDate,
      assignedBatches,
      assignedCourses,
      status: statusOptions[statusIndex]
    };
  });
}

// Generate random student data
function generateMockStudents(count: number) {
  const departments = [
    "Computer Science Engineering", 
    "Electrical Engineering", 
    "Mechanical Engineering", 
    "Civil Engineering", 
    "Electronics & Communication"
  ];
  
  const batches = ["2020-24", "2021-25", "2022-26", "2023-27"];
  const sections = ["1", "2", "3", "4", "5", "6", "7"];
  
  const randomFirstNames = [
    "Virat", "Rohit", "Hardik", "Rishabh", "Suryakumar", 
    "Ravindra", "Jasprit", "Shreyas", "Shubman", 
    "Arshdeep", "Yuzvendra", "Mohammed"
  ];
  
  const randomLastNames = [
    "Sharma", "Kohli", "Pandya", "Pant", "Yadav", "Jadeja", 
    "Bumrah", "Iyer", "Gill", "Singh", "Chahal", "Shami", 
    "Rahul", "Agarwal"
  ];
  
  const randomCities = [
    "Delhi", "Mumbai", "Bangalore", "Chennai", 
    "Kolkata", "Hyderabad", "Pune"
  ];
  
  const randomStates = [
    "Maharashtra", "Karnataka", "Tamil Nadu", "Delhi", 
    "West Bengal", "Telangana", "Gujarat"
  ];
  
  return Array.from({ length: count }).map((_, index) => {
    const id = `STU${1000 + index}`;
    const batchIndex = Math.floor(Math.random() * batches.length);
    const departmentIndex = Math.floor(Math.random() * departments.length);
    const sectionIndex = Math.floor(Math.random() * sections.length);
    
    const firstName = randomFirstNames[Math.floor(Math.random() * randomFirstNames.length)];
    const lastName = randomLastNames[Math.floor(Math.random() * randomLastNames.length)];
    const name = `${firstName} ${lastName}`;
    
    const currentSemester = Math.floor(Math.random() * 8) + 1;
    const cgpa = (6 + Math.random() * 4).toFixed(2);
    const attendance = Math.floor(70 + Math.random() * 30);
    
    const statusOptions = ["active", "inactive", "alumni"] as const;
    const status = statusOptions[Math.floor(Math.random() * (currentSemester > 7 ? 3 : 2))];
  
    return {
      id,
      enrollmentNo: `EN${2020 + batchIndex}${100 + index}`,
      name,
      email: `${name.toLowerCase().replace(/\s/g, '.')}@student.edu`,
      phone: `+91 ${Math.floor(6000000000 + Math.random() * 3999999999)}`,
      address: {
        street: `${Math.floor(1 + Math.random() * 999)}, ${Math.random() > 0.5 ? 'Main' : 'Park'} Street`,
        city: randomCities[Math.floor(Math.random() * randomCities.length)],
        state: randomStates[Math.floor(Math.random() * randomStates.length)],
        pincode: `${Math.floor(100000 + Math.random() * 899999)}`
      },
      section: sections[sectionIndex],
      batch: batches[batchIndex],
      department: departments[departmentIndex],
      academicDetails: {
        currentSemester,
        cgpa: parseFloat(cgpa),
        attendance
      },
      status
    };
  });
}

// Generate random schedule data
function generateMockSchedules(count: number) {
  const facultyIds = Array.from({ length: 8 }, (_, i) => `FAC${1001 + i}`);
  const facultyNames = [
    "Dr. Rajesh Sharma", 
    "Dr. Suresh Patel", 
    "Dr. Mahesh Gupta", 
    "Dr. Anil Kumar", 
    "Dr. Harish Singh", 
    "Dr. Ramesh Reddy", 
    "Dr. Satish Mishra", 
    "Dr. Dinesh Joshi"
  ];
  
  const courseIds = Array.from({ length: 8 }, (_, i) => `CRS${1001 + i}`);
  const courseNames = [
    "Introduction to Computer Science",
    "Data Structures",
    "Algorithms",
    "Basic Electrical Engineering",
    "Analog Electronics",
    "Engineering Mechanics",
    "Engineering Drawing",
    "Digital Electronics"
  ];
  
  const batches = [
    "CS 2020-24", "CS 2021-25", "CS 2022-26", 
    "CS 2023-27", "EE 2020-24", "EE 2021-25"
  ];
  
  const sections = ["1", "2", "3", "4", "5", "6", "7"];
  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  const types = ["Lecture", "Lab", "Tutorial"];
  
  return Array.from({ length: count }).map((_, index) => {
    const facultyIndex = Math.floor(Math.random() * facultyIds.length);
    const courseIndex = Math.floor(Math.random() * courseIds.length);
    const batchIndex = Math.floor(Math.random() * batches.length);
    const sectionIndex = Math.floor(Math.random() * sections.length);
    const dayIndex = Math.floor(Math.random() * days.length);
    const typeIndex = Math.floor(Math.random() * types.length);
    
    // Generate random start time between 9 AM and 5 PM
    const hour = Math.floor(Math.random() * (17 - 9 + 1)) + 9;
    const minute = Math.random() > 0.5 ? 0 : 30;
    const startTime = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
    
    // Generate end time 1-2 hours after start time
    const duration = Math.random() > 0.5 ? 1 : 2;
    let endHour = hour + duration;
    const endMinute = minute;
    
    // Make sure end time doesn't exceed 6 PM
    if (endHour > 18) {
      endHour = 18;
    }
    
    const endTime = `${endHour.toString().padStart(2, '0')}:${endMinute.toString().padStart(2, '0')}`;
    
    // Generate random room number
    const roomNumber = `${Math.floor(Math.random() * 5) + 1}${Math.floor(Math.random() * 100) + 1}`;
    
    return {
      id: `SCH${1000 + index}`,
      facultyId: facultyIds[facultyIndex],
      facultyName: facultyNames[facultyIndex],
      day: days[dayIndex],
      startTime,
      endTime,
      courseId: courseIds[courseIndex],
      courseName: courseNames[courseIndex],
      batchName: batches[batchIndex],
      section: sections[sectionIndex],
      roomNumber,
      type: types[typeIndex]
    };
  });
}

export default initializeData; 