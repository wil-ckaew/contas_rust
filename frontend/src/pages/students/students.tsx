import React, { useState, useEffect } from 'react';
import axios from 'axios';
import StudentCardComponent from '../../components/StudentCardComponent';
import Header from '../../components/Header';
import { useRouter } from 'next/router';

interface Student {
  id: string;
  name: string;
  age: number;
  email?: string;
  parent_id?: string | null;
  parent_name?: string;  // Novo campo para exibição
  students_date?: string;
}

const StudentsPage: React.FC = () => {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';
  const router = useRouter();

  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // useEffect para buscar os estudantes
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${apiUrl}/api/students`);
        const studentsData: Student[] = response.data.students;

        // Associar o nome do responsável localmente
        const formattedStudents = studentsData.map((student) => {
          const parent = studentsData.find((s) => s.id === student.parent_id);
          return {
            ...student,
            parent_name: parent ? parent.name : 'N/A',
            email: student.email || 'N/A',
            students_date: student.students_date || 'N/A',
          };
        });

        setStudents(formattedStudents);
        setError(null);
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : 'Unknown error occurred';
        setError(`Error fetching students: ${errorMessage}`);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [apiUrl]);

  return (
    <div className="flex flex-col h-screen">
      <Header />
      <main className="flex flex-1 overflow-hidden">
        <section className="flex-1 overflow-y-auto bg-gray-100 p-4">
          <div className="flex items-center justify-between mb-4">
            <p className="text-gray-800 font-semibold">Students</p>
            <button
              onClick={() => router.push('/students/add-student')}
              className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
            >
              Add Student
            </button>
          </div>
          {loading ? (
            <p className="text-center text-gray-600">Loading...</p>
          ) : error ? (
            <p className="text-center text-red-600">{error}</p>
          ) : (
            <div className="space-y-4">
              {students.map((student) => (
                <StudentCardComponent
                  key={student.id}
                  student={student}
                  onEdit={(id) => router.push(`/students/edit-student?id=${id}`)}
                  onDelete={async (id) => {
                    if (confirm('Are you sure you want to delete this student?')) {
                      try {
                        await axios.delete(`${apiUrl}/api/students/${id}`);
                        setStudents(students.filter((s) => s.id !== id));
                        alert('Student deleted successfully');
                      } catch {
                        alert('Error deleting student');
                      }
                    }
                  }}
                />
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
};

export default StudentsPage;
