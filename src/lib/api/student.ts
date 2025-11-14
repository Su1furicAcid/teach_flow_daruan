import { ResponseBody, instance } from "./instance";

export interface StudentRequest {
    studentNumber: string;
    studentName: string;
    grade: string;
    clazz: string;
}

export interface StudentResponse {
    id: number;
    teacherId: number;
    studentName: string;
    grade: string;
    clazz: string;
    studentNumber: string;
}

export const getStudentsByTeacherId = (teacherId: number) =>
    instance.get<ResponseBody<StudentResponse[]>>('/students', {
        params: { teacherId }
    });

export const getStudentByStudentId = (id: number, teacherId: number) =>
    instance.get<ResponseBody<StudentResponse>>(`/students/${id}`, {
        params: { teacherId }
    });

export const createStudent = (data: StudentRequest) =>
    instance.post<ResponseBody<StudentResponse>>('/students', [data]);

export const createStudents = (data: StudentRequest[]) =>
    instance.post<ResponseBody<StudentResponse[]>>('/students', data);

export const updateStudent = (id: number, data: StudentRequest) =>
    instance.put<ResponseBody<StudentResponse>>(`/students/${id}`, data);

export const deleteStudent = (id: number, teacherId: number) =>
    instance.delete<ResponseBody<void>>(`/students/${id}`, {
        params: { teacherId }
    });
