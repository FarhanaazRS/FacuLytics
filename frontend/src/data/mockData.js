// mockData.js
// Initial mock faculties and reviews used to populate the UI.
// Each faculty has id, name, subject, and reviews array. Each review tracks teaching, marks, quiz, comment, and date.

const mockFaculties = [
  {
    id: "f1",
    name: "Dr. Aisha Khan",
    subject: "Machine Learning",
    reviews: [
      { teaching: 4.5, marks: 4.0, quiz: 4.0, comment: "Clear lectures, very helpful.", date: "2025-09-10" },
      { teaching: 5.0, marks: 4.5, quiz: 4.2, comment: "Great examples and assignments.", date: "2025-10-01" },
    ],
  },
  {
    id: "f2",
    name: "Prof. Rohit Verma",
    subject: "Data Structures",
    reviews: [
      { teaching: 4.0, marks: 3.8, quiz: 3.9, comment: "Challenging quizzes but fair.", date: "2025-08-21" },
      { teaching: 3.8, marks: 3.5, quiz: 4.0, comment: "Needs more office hours.", date: "2025-09-15" },
    ],
  },
  {
    id: "f3",
    name: "Ms. Sonia Patel",
    subject: "Database Systems",
    reviews: [
      { teaching: 4.6, marks: 4.7, quiz: 4.5, comment: "Very organised and supportive.", date: "2025-09-30" },
    ],
  },
  {
    id: "f4",
    name: "Dr. Karthik Rao",
    subject: "Operating Systems",
    reviews: [
      { teaching: 4.2, marks: 4.0, quiz: 4.1, comment: "Good practical sessions.", date: "2025-07-10" },
      { teaching: 4.0, marks: 3.9, quiz: 3.8, comment: "Lectures can be fast.", date: "2025-09-02" },
    ],
  },
];

export default mockFaculties;
