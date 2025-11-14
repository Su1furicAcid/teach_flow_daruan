import { ResponseBody, instance } from "./instance"

export interface Exam {
    examId: number;
    examName: string;
    examSubject: string;
    examDate: string;
}

export const uploadExam = (data: { examName: string, examSubject: string, examDate: string }) => 
    instance.post<
        ResponseBody<{
            examId: number;
        }>
    >('/exams', data);

export const getAllExams = () =>
    instance.get<
        ResponseBody<Exam[]>
    >('/exams');