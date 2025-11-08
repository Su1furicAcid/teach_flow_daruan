import { ResponseBody, instance } from "./instance"

export interface ScoreUploadRequest {
    studentId: number;
    scoreValue: number;
}

export interface Score {
    id: number;
    studentId: number;
    examId: number;
    scoreValue: number;
    studentName?: string;
    examName?: string;
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