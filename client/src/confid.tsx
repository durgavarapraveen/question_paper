export interface Papers {
  id: number;
  examName: string;
  examDescription: string;
  examDate: string;
  examTerm: string;
  examSemester: string;
  examProfessor: string;
  examPdf: string;
  examSolution: string;
  createdBy: number;
  department: string;
  createdAt: string;
  updatedAt: string;
}

export const btechDepartments = [
  { key: "CSE", value: "Computer Science Engineering" },
  { key: "AIDS", value: "Artificial Intelligence and Data Science" },
  { key: "EE", value: "Electrical Engineering" },
  { key: "ME", value: "Mechanical Engineering" },
  { key: "CE", value: "Civil Engineering" },
  { key: "BT", value: "Biotechnology" },
  { key: "CHE", value: "Chemical Engineering" },
  { key: "MT", value: "Metallurgical Engineering" },
];

export const Semester = [
  { key: "sem1", value: "1 Semester" },
  { key: "sem2", value: "2 Semester" },
  { key: "sem3", value: "3 Semester" },
  { key: "sem4", value: "4 Semester" },
  { key: "sem5", value: "5 Semester" },
  { key: "sem6", value: "6 Semester" },
  { key: "sem7", value: "7 Semester" },
  { key: "sem8", value: "8 Semester" },
];

export const Major = [
  { key: "major", value: "Major" },
  { key: "minor", value: "Minor" },
];
