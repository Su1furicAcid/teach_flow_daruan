"use client";

import React, { useEffect, useMemo, useState } from "react";
import dayjs from "dayjs";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
} from "recharts";
import { UploadModal } from "@/components/UploadModal";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/lib/stores/authStore";
import { getStudentsByTeacherId, StudentResponse } from "@/lib/api/student";
import { Exam, getAllExams } from "@/lib/api/exam";
import { getScoresByStudent, getScoresByExam, Score } from "@/lib/api/score";

type UploadType = "student" | "exam" | "score";

interface TrendPoint {
  label: string;
  score: number;
  date: string;
}

interface AveragePoint extends TrendPoint {
  examSubject: string;
}

const MAX_POINTS = 6;

export default function AnalysisPage() {
  const { user } = useAuthStore();

  const [isUploadModalOpen, setUploadModalOpen] = useState(false);
  const [uploadType, setUploadType] = useState<UploadType>("student");

  const [students, setStudents] = useState<StudentResponse[]>([]);
  const [studentsLoading, setStudentsLoading] = useState(false);
  const [studentsError, setStudentsError] = useState("");

  const [exams, setExams] = useState<Exam[]>([]);
  const [examLoading, setExamLoading] = useState(false);

  const [selectedStudentId, setSelectedStudentId] = useState<string>("");
  const [selectedSubject, setSelectedSubject] = useState<string>("");
  const [studentScores, setStudentScores] = useState<Score[]>([]);
  const [studentTrendLoading, setStudentTrendLoading] = useState(false);
  const [studentTrendError, setStudentTrendError] = useState("");
  const [studentTrendFetched, setStudentTrendFetched] = useState(false);

  const [averageTrendData, setAverageTrendData] = useState<AveragePoint[]>([]);
  const [averageLoading, setAverageLoading] = useState(false);
  const [averageError, setAverageError] = useState("");
  const [averageSubject, setAverageSubject] = useState<string>("");
  const [averageTrendFetched, setAverageTrendFetched] = useState(false);

  const examMap = useMemo(() => {
    return new Map(exams.map((exam) => [exam.examId, exam]));
  }, [exams]);

  const subjectOptions = useMemo(() => {
    const subjects = new Set<string>();
    exams.forEach((exam) => subjects.add(exam.examSubject));
    return Array.from(subjects);
  }, [exams]);

  const resolvedStudentId = useMemo(() => {
    return parseNumericId(selectedStudentId);
  }, [selectedStudentId]);

  useEffect(() => {
    if (!user?.id) return;
    setStudentsLoading(true);
    setStudentsError("");
    (async () => {
      try {
        const response = await getStudentsByTeacherId(user.id);
        if (response.data.code === "200") {
          setStudents(response.data.data || []);
        } else {
          setStudentsError("获取学生列表失败");
        }
      } catch (error) {
        console.error("获取学生列表失败", error);
        setStudentsError("获取学生列表失败");
      } finally {
        setStudentsLoading(false);
      }
    })();
  }, [user?.id]);

  useEffect(() => {
    setExamLoading(true);
    (async () => {
      try {
        const response = await getAllExams();
        if (response.data.code === "200") {
          setExams(response.data.data || []);
        }
      } catch (error) {
        console.error("获取考试列表失败", error);
      } finally {
        setExamLoading(false);
      }
    })();
  }, []);

  useEffect(() => {
    setStudentScores([]);
    setStudentTrendError("");
    setStudentTrendFetched(false);
  }, [selectedStudentId, selectedSubject]);

  useEffect(() => {
    if (selectedSubject && !subjectOptions.includes(selectedSubject)) {
      setSelectedSubject("");
    }
  }, [subjectOptions, selectedSubject]);

  const studentTrendData: TrendPoint[] = useMemo(() => {
    if (!selectedSubject) return [];
    const filtered = studentScores
      .map((score) => {
        return {
          label: `${score.examName}`,
          score: Number(score.scoreValue.toFixed(2)),
          date: score.examDate,
        } as TrendPoint;
      })
      .filter(Boolean) as TrendPoint[];

    return filtered
      .sort(
        (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
      )
      .slice(-MAX_POINTS);
  }, [studentScores, examMap, selectedSubject]);

  useEffect(() => {
    if (!exams.length) {
      setSelectedSubject("");
      setAverageSubject("");
    }
  }, [exams]);

  useEffect(() => {
    if (averageSubject && !subjectOptions.includes(averageSubject)) {
      setAverageSubject("");
    }
  }, [averageSubject, subjectOptions]);

  useEffect(() => {
    setAverageTrendData([]);
    setAverageError("");
    setAverageTrendFetched(false);
  }, [averageSubject]);

  const handleLoadStudentTrend = async () => {
    if (!resolvedStudentId || !selectedSubject) {
      setStudentTrendError("请先选择学生和科目");
      return;
    }
    setStudentTrendLoading(true);
    setStudentTrendError("");
    try {
      const response = await getScoresByStudent(resolvedStudentId);
      if (response.data.code === "200") {
        setStudentScores(response.data.data || []);
        setStudentTrendFetched(true);
      } else {
        setStudentTrendError("获取成绩失败");
        setStudentTrendFetched(false);
      }
    } catch (error) {
      console.error("获取学生成绩失败", error);
      setStudentTrendError("获取成绩失败");
      setStudentTrendFetched(false);
    } finally {
      setStudentTrendLoading(false);
    }
  };

  const handleLoadAverageTrend = async () => {
    if (!averageSubject) {
      setAverageError("请先选择科目");
      return;
    }
    const subjectExams = exams
      .filter((exam) => exam.examSubject === averageSubject)
      .sort(
        (a, b) => new Date(a.examDate).getTime() - new Date(b.examDate).getTime()
      )
      .slice(-MAX_POINTS);
    if (!subjectExams.length) {
      setAverageTrendData([]);
      setAverageError("该科目暂无考试数据");
      setAverageTrendFetched(false);
      return;
    }
    setAverageLoading(true);
    setAverageError("");
    try {
      const responses = await Promise.all(
        subjectExams.map((exam) => getScoresByExam(exam.examId))
      );
      const dataset: AveragePoint[] = subjectExams.map((exam, index) => {
        const body = responses[index].data;
        const scores: Score[] = body.code === "200" ? body.data || [] : [];
        const averageScore = scores.length
          ? Number(
              (
                scores.reduce((sum, item) => sum + item.scoreValue, 0) /
                scores.length
              ).toFixed(2)
            )
          : 0;
        return {
          label: exam.examName,
          score: averageScore,
          date: exam.examDate,
          examSubject: exam.examSubject,
        };
      });
      setAverageTrendData(dataset);
      setAverageTrendFetched(true);
    } catch (error) {
      console.error("获取平均分失败", error);
      setAverageError("获取平均成绩失败");
      setAverageTrendFetched(false);
    } finally {
      setAverageLoading(false);
    }
  };

  const handleOpenUploadModal = (type: UploadType) => {
    setUploadType(type);
    setUploadModalOpen(true);
  };

  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-8 p-6">
      <header className="space-y-2">
        <p className="text-sm font-medium text-blue-600">教学洞察仪表盘</p>
        <h1 className="text-3xl font-semibold text-gray-900">学情分析</h1>
        <p className="text-sm text-gray-500">
          聚焦学生个体与群体表现，快速定位薄弱环节，辅助教学策略调整。
        </p>
      </header>

      <section className="grid gap-6 md:grid-cols-2">
        <Card className="border-blue-50 bg-white">
          <CardHeader>
            <CardTitle className="text-xl">学生科目成绩趋势</CardTitle>
            <p className="text-sm text-gray-500">
              选择学生和科目，查看最近考试成绩波动。
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="student-select">学生</Label>
                <select
                  id="student-select"
                  className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none"
                  value={selectedStudentId}
                  onChange={(e) => setSelectedStudentId(e.target.value)}
                  disabled={studentsLoading || !!studentsError}
                >
                  <option value="">请选择学生</option>
                  {students.map((student) => (
                    <option key={student.id} value={student.id}>
                      {student.studentName}
                    </option>
                  ))}
                </select>
                {studentsError && (
                  <p className="text-xs text-red-500">{studentsError}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="subject-select">科目</Label>
                <select
                  id="subject-select"
                  className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none"
                  value={selectedSubject}
                  onChange={(e) => setSelectedSubject(e.target.value)}
                  disabled={!subjectOptions.length}
                >
                  <option value="">请选择科目</option>
                  {subjectOptions.map((subject) => (
                    <option key={subject} value={subject}>
                      {subject}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="flex flex-wrap gap-3">
              <Button
                size="sm"
                onClick={handleLoadStudentTrend}
                disabled={
                  !resolvedStudentId ||
                  !selectedSubject ||
                  studentTrendLoading ||
                  !!studentsError
                }
              >
                {studentTrendLoading ? "加载中..." : "加载趋势"}
              </Button>
              {studentTrendError && (
                <span className="text-sm text-red-500">{studentTrendError}</span>
              )}
            </div>

            <div className="h-72 rounded-lg bg-slate-50 p-4">
              {!resolvedStudentId || !selectedSubject ? (
                <Placeholder text="请选择学生和科目，并点击加载趋势按钮" />
              ) : studentTrendLoading ? (
                <Placeholder text="正在加载学生成绩..." />
              ) : studentTrendError ? (
                <Placeholder text={studentTrendError} variant="error" />
              ) : !studentTrendFetched ? (
                <Placeholder text="点击加载趋势按钮以查看数据" />
              ) : !studentTrendData.length ? (
                <Placeholder text="暂无可展示的数据" />
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={studentTrendData} margin={{ left: 8, right: 8, top: 16 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis
                      dataKey="label"
                      tick={{ fontSize: 12 }}
                      interval={0}
                      angle={-15}
                      textAnchor="end"
                    />
                    <YAxis tick={{ fontSize: 12 }} domain={[0, 100]} />
                    <Tooltip
                      formatter={(value: number) => `${value} 分`}
                      labelFormatter={(label) =>
                        `${label} | ${dayjs(
                          studentTrendData.find((item) => item.label === label)?.date
                        ).format("MM月DD日")}`
                      }
                    />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="score"
                      name={selectedSubject}
                      stroke="#2563eb"
                      strokeWidth={3}
                      dot={{ r: 4 }}
                      activeDot={{ r: 6 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="border-blue-50 bg-white">
          <CardHeader>
            <CardTitle className="text-xl">年级平均成绩趋势</CardTitle>
            <p className="text-sm text-gray-500">
              按考试批次追踪全体学生平均分变化。
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="average-subject">科目筛选</Label>
              <select
                id="average-subject"
                className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none"
                value={averageSubject}
                onChange={(e) => setAverageSubject(e.target.value)}
                disabled={!subjectOptions.length}
              >
                <option value="">请选择科目</option>
                {subjectOptions.map((subject) => (
                  <option key={subject} value={subject}>
                    {subject}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex flex-wrap gap-3">
              <Button
                size="sm"
                variant="secondary"
                onClick={handleLoadAverageTrend}
                disabled={!averageSubject || averageLoading || examLoading}
              >
                {averageLoading ? "汇总中..." : "生成趋势"}
              </Button>
              {averageError && (
                <span className="text-sm text-red-500">{averageError}</span>
              )}
            </div>

            <div className="h-72 rounded-lg bg-slate-50 p-4">
              {!averageSubject ? (
                <Placeholder text="请选择科目，并点击生成趋势按钮" />
              ) : averageLoading || examLoading ? (
                <Placeholder text="正在汇总数据..." />
              ) : averageError ? (
                <Placeholder text={averageError} variant="error" />
              ) : !averageTrendFetched ? (
                <Placeholder text="点击生成趋势按钮以查看数据" />
              ) : !averageTrendData.length ? (
                <Placeholder text="暂无平均成绩数据" />
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={averageTrendData} margin={{ left: 8, right: 8, top: 16 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis
                      dataKey="label"
                      tick={{ fontSize: 12 }}
                      interval={0}
                      angle={-15}
                      textAnchor="end"
                    />
                    <YAxis tick={{ fontSize: 12 }} domain={[0, 100]} />
                    <Tooltip
                      formatter={(value: number) => `${value} 分`}
                      labelFormatter={(label) =>
                        `${label} | ${dayjs(
                          averageTrendData.find((item) => item.label === label)?.date
                        ).format("MM月DD日")}`
                      }
                    />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="score"
                      name={averageSubject === "all" ? "平均分" : averageSubject}
                      stroke="#f97316"
                      strokeWidth={3}
                      dot={{ r: 4 }}
                      activeDot={{ r: 6 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              )}
            </div>
          </CardContent>
        </Card>
      </section>

      <section>
        <Card className="border-dashed border-blue-200 bg-blue-50/60">
          <CardHeader>
            <CardTitle className="text-lg">数据维护</CardTitle>
            <p className="text-sm text-gray-600">
              快速导入学生、考试与成绩，保持数据最新。
            </p>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-3">
              <Button onClick={() => handleOpenUploadModal("student")}>上传学生</Button>
              <Button variant="secondary" onClick={() => handleOpenUploadModal("exam")}>
                上传考试
              </Button>
              <Button variant="outline" onClick={() => handleOpenUploadModal("score")}>
                上传分数
              </Button>
            </div>
          </CardContent>
        </Card>
      </section>

      <UploadModal
        isOpen={isUploadModalOpen}
        onClose={() => setUploadModalOpen(false)}
        uploadType={uploadType}
      />
    </div>
  );
}

function Placeholder({
  text,
  variant = "info",
}: {
  text: string;
  variant?: "info" | "error";
}) {
  return (
    <div
      className={`flex h-full items-center justify-center rounded-md border text-sm ${
        variant === "error"
          ? "border-red-200 bg-red-50 text-red-600"
          : "border-dashed border-slate-200 bg-white text-slate-500"
      }`}
    >
      {text}
    </div>
  );
}

function parseNumericId(raw: string): number | null {
  const trimmed = raw?.trim();
  if (!trimmed) return null;
  const direct = Number(trimmed);
  if (!Number.isNaN(direct)) {
    return direct;
  }
  const matches = trimmed.match(/\d+/g);
  if (!matches || !matches.length) return null;
  const candidate = Number(matches[matches.length - 1]);
  return Number.isNaN(candidate) ? null : candidate;
}