"use client";

import React, { useState } from 'react';
import * as XLSX from 'xlsx';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/Card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { createStudent, createStudents, StudentRequest } from '@/lib/api/student';
import { uploadExam } from '@/lib/api/exam';
import { uploadScoresForExam } from '@/lib/api/score';
import { useAuthStore } from '@/lib/stores/authStore';

interface UploadModalProps {
    isOpen: boolean;
    onClose: () => void;
    uploadType: 'student' | 'exam' | 'score';
}

export function UploadModal({ isOpen, onClose, uploadType }: UploadModalProps) {
    const [studentName, setStudentName] = useState('');
    const [grade, setGrade] = useState('');
    const [clazz, setClazz] = useState('');
    const [examName, setExamName] = useState('');
    const [examSubject, setExamSubject] = useState('');
    const [examDate, setExamDate] = useState('');
    const [examId, setExamId] = useState('');
    const [scoreFile, setScoreFile] = useState<File | null>(null);
    const [studentFile, setStudentFile] = useState<File | null>(null);
    const [uploadMethod, setUploadMethod] = useState<'single' | 'bulk'>('single');
    const { user } = useAuthStore();

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, setFile: React.Dispatch<React.SetStateAction<File | null>>) => {
        if (e.target.files) {
            setFile(e.target.files[0]);
        }
    };

    const handleStudentUpload = async () => {
        if (!user?.id) {
            alert('用户未登录');
            return;
        }

        if (uploadMethod === 'single') {
            if (!studentName || !grade || !clazz) {
                alert('请填写所有学生信息');
                return;
            }
            try {
                const studentData: StudentRequest = {
                    teacherId: user.id,
                    studentName,
                    grade,
                    clazz,
                };
                await createStudent(studentData);
                alert('学生上传成功');
                onClose();
            } catch (error) {
                console.error('上传学生失败:', error);
                alert('上传学生失败');
            }
        } else {
            if (!studentFile) {
                alert('请选择学生文件');
                return;
            }
            const reader = new FileReader();
            reader.onload = async (e) => {
                try {
                    const data = e.target?.result;
                    const workbook = XLSX.read(data, { type: 'binary' });
                    const sheetName = workbook.SheetNames[0];
                    const worksheet = workbook.Sheets[sheetName];
                    const json: any[] = XLSX.utils.sheet_to_json(worksheet);

                    const students: StudentRequest[] = json.map(row => ({
                        teacherId: user.id,
                        studentName: row['姓名'] || row['studentName'],
                        grade: String(row['年级'] || row['grade']),
                        clazz: String(row['班级'] || row['clazz']),
                    }));

                    if (students.some(s => !s.studentName || !s.grade || !s.clazz)) {
                        alert('Excel文件中包含无效数据，请检查列名是否为 "姓名", "年级", "班级"');
                        return;
                    }

                    await createStudents(students);
                    alert('批量上传学生成功');
                    onClose();
                } catch (error) {
                    console.error('批量上传学生失败:', error);
                    alert('批量上传学生失败');
                }
            };
            reader.readAsBinaryString(studentFile);
        }
    };

    const handleExamUpload = async () => {
        if (!examName || !examSubject || !examDate) {
            alert('请填写所有考试信息并选择文件');
            return;
        }
        try {
            await uploadExam({ examName, examSubject, examDate });
            alert('考试上传成功');
            onClose();
        } catch (error) {
            console.error('上传考试失败:', error);
            alert('上传考试失败');
        }
    };

    const handleScoreUpload = async () => {
        if (!examId || !scoreFile) {
            alert('请输入考试ID并选择分数文件');
            return;
        }
        const reader = new FileReader();
        reader.onload = async (e) => {
            try {
                const content = e.target?.result as string;
                const lines = content.split('\n').filter(line => line.trim() !== '');
                const scores = lines.map(line => {
                    const [studentId, scoreValue] = line.split(',');
                    return { studentId: parseInt(studentId, 10), scoreValue: parseFloat(scoreValue) };
                });
                await uploadScoresForExam(parseInt(examId, 10), scores);
                alert('分数上传成功');
                onClose();
            } catch (error) {
                console.error('上传分数失败:', error);
                alert('上传分数失败');
            }
        };
        reader.readAsText(scoreFile);
    };

    const handleSubmit = () => {
        if (uploadType === 'student') {
            handleStudentUpload();
        } else if (uploadType === 'exam') {
            handleExamUpload();
        } else if (uploadType === 'score') {
            handleScoreUpload();
        }
    };

    if (!isOpen) return null;

    const getTitle = () => {
        switch (uploadType) {
            case 'student':
                return '上传学生';
            case 'exam':
                return '上传考试';
            case 'score':
                return '上传分数';
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/80 backdrop-blur-sm">
            <Card className="w-full max-w-md bg-white border-none">
                <CardHeader>
                    <CardTitle>{getTitle()}</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {uploadType === 'student' && (
                            <>
                                <div className="flex space-x-4">
                                    <div className="flex items-center">
                                        <input
                                            type="radio"
                                            id="single"
                                            name="uploadMethod"
                                            value="single"
                                            checked={uploadMethod === 'single'}
                                            onChange={() => setUploadMethod('single')}
                                            className="mr-2"
                                        />
                                        <Label htmlFor="single">单个添加</Label>
                                    </div>
                                    <div className="flex items-center">
                                        <input
                                            type="radio"
                                            id="bulk"
                                            name="uploadMethod"
                                            value="bulk"
                                            checked={uploadMethod === 'bulk'}
                                            onChange={() => setUploadMethod('bulk')}
                                            className="mr-2"
                                        />
                                        <Label htmlFor="bulk">批量上传</Label>
                                    </div>
                                </div>

                                {uploadMethod === 'single' ? (
                                    <>
                                        <div className="space-y-2">
                                            <Label htmlFor="studentName">学生姓名</Label>
                                            <Input id="studentName" value={studentName} onChange={(e) => setStudentName(e.target.value)} />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="grade">年级</Label>
                                            <Input id="grade" value={grade} onChange={(e) => setGrade(e.target.value)} />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="clazz">班级</Label>
                                            <Input id="clazz" value={clazz} onChange={(e) => setClazz(e.target.value)} />
                                        </div>
                                    </>
                                ) : (
                                    <div className="space-y-2">
                                        <Label htmlFor="studentFile">学生文件 (Excel: 姓名,年级,班级)</Label>
                                        <Input id="studentFile" type="file" accept=".xlsx, .xls" onChange={(e) => handleFileChange(e, setStudentFile)} />
                                    </div>
                                )}
                            </>
                        )}
                        {uploadType === 'exam' && (
                            <>
                                <div className="space-y-2">
                                    <Label htmlFor="examName">考试名称</Label>
                                    <Input id="examName" value={examName} onChange={(e) => setExamName(e.target.value)} />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="examSubject">考试科目</Label>
                                    <Input id="examSubject" value={examSubject} onChange={(e) => setExamSubject(e.target.value)} />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="examDate">考试日期</Label>
                                    <Input id="examDate" type="date" value={examDate} onChange={(e) => setExamDate(e.target.value)} />
                                </div>
                            </>
                        )}
                        {uploadType === 'score' && (
                            <>
                                <div className="space-y-2">
                                    <Label htmlFor="examId">考试ID</Label>
                                    <Input id="examId" value={examId} onChange={(e) => setExamId(e.target.value)} />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="scoreFile">分数文件 (CSV: studentId,score)</Label>
                                    <Input id="scoreFile" type="file" accept=".csv" onChange={(e) => handleFileChange(e, setScoreFile)} />
                                </div>
                            </>
                        )}
                        <div className="flex justify-end space-x-2">
                            <Button variant="outline" onClick={onClose}>取消</Button>
                            <Button onClick={handleSubmit}>上传</Button>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
