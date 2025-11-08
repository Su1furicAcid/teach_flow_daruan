import { ResponseBody, instance } from "./instance"

export const uploadExam = (data: { examName: string, examSubject: string, examDate: string }) => 
    instance.post<
        ResponseBody<{
            examId: number;
        }>
    >('/exams', data);