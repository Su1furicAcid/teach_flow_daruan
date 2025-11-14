import { ResponseBody, instance } from "./instance"

export interface ScoreUploadRequest {
    studentNumber: number;
    scoreValue: number;
}

export interface Score {
    scoreId: number;
    studentNumber: string;
    studentName: string;
    examName: string;
    examSubject: string;
    examDate: string;
    scoreValue: number;
}

export const uploadScoresForExam = (examId: number, data: ScoreUploadRequest[]) => 
    instance.post<ResponseBody<null>>(
        `/scores/score/exam/${examId}`, 
        data
    );

export const getScoresByExam = (examId: number) =>
    instance.get<ResponseBody<Score[]>>(`/scores/score/exam/${examId}`);

export const getScoresByStudent = (studentId: number) =>
    instance.get<ResponseBody<Score[]>>(`/scores/score/student/${studentId}`);