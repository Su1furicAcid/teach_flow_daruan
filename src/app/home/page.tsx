// "use client";
// // import { MagicWandIcon } from "@/components/icons/MagicWandIcon";
// import { useState } from 'react';
// import { useForm } from 'react-hook-form';
// import { useRouter } from "next/navigation";
// import { Button } from '@/components/ui/button';
// // import { VerticalTimeline } from '@/components/VerticalTimeline';
// // import { useSyllabusStore } from '@/lib/stores/syllabusStore';
// // import Loading from '@/components/Loading';
// type featureForm = {
//   content: string;
//   style: string;
//   chapters: number;
//   duration: number;
// }

// type Step = 'inputSub' | 'selectFeature' | 'showTimeLine' | 'showResult' | 'loading';
// export default function DashboardApp() {
//   const [inputValue, setInputValue] = useState('');
//   const [step, setStep] = useState<Step>('inputSub');
//   const router = useRouter();
//   const { register, handleSubmit, formState: { errors } } = useForm<featureForm>({
//     defaultValues: {
//       content: '',
//       style: '',
//       chapters: 5,
//       duration: 40,
//     },
//     mode: 'onChange' // 添加实时校验模式
//   });
//   const { generatedCards, loadMock } = useSyllabusStore();


//   const onFeatureSubmit = (params: featureForm) => {
//     setStep('loading');
//     const timer = setTimeout(() => {
//       setStep('showTimeLine');
//       clearTimeout(timer);
//     }, 1000);
//     console.log(params);
//     loadMock();
//   }

//   const onSyllabusSubmit = () => {
//     setStep('loading');
//     const timer = setTimeout(() => {
//       setStep('showResult');
//       clearTimeout(timer);
//     }, 1000);
//     router.push('/home/plan');
//   }

//   return (
//     <div className="min-h-screen grid grid-cols-1 items-start justify-items-center px-4 ">
//       {step == 'loading' &&  (
//         <div className="fixed inset-0 flex items-center justify-center z-50">
//           <Loading />
//         </div>
//       )}
//       {step == 'inputSub' && (
//         <div className="px-4 pt-36 w-full max-w-2xl">
//           <div className="w-full space-y-10">
//             <div >
//               <div className="text-center mb-4">
//                 <p className="text-3xl font-bold text-slate-800">
//                   随时输入您的教学主题
//                 </p>
//               </div>

//               <div className="relative group">
//                 <div className="absolute -inset-1 bg-purple-100 rounded-full blur opacity-20 group-hover:opacity-30 transition-opacity"></div>
//                 <div className="relative flex group items-center gap-3 border-2 border-purple-200 rounded-full px-6 py-4 bg-white hover:border-purple-300 transition-colors shadow-md">
//                   <MagicWandIcon />
//                   <input
//                     type="text"
//                     value={inputValue}
//                     onChange={(e) => setInputValue(e.target.value)}
//                     onKeyDown={(e) => e.key === 'Enter' && setStep('selectFeature')}
//                     placeholder="为我生成一份关于《二次函数》的课程大纲"
//                     className="w-full bg-transparent outline-none placeholder-purple-300 text-lg text-slate-800"
//                   />
//                 </div>
//               </div>
//               <div className="text-sm text-purple-400 leading-relaxed bg-purple-50 rounded-lg p-4 shadow-sm mt-12">
//                 🚀 支持输入：
//                 <ul className="list-disc pl-5 mt-2 space-y-1">
//                   <li>课程主题</li>
//                   <li>知识点</li>
//                   <li>教学目标</li>
//                 </ul>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}
//       {step == 'selectFeature' && (
//         <div className="px-4 pt-36 w-full max-w-2xl">
//           <div className="w-full space-y-10">
//             <div className="bg-white rounded-2xl p-8 shadow-lg border border-purple-100 space-y-6">
//               <h3 className="text-xl font-semibold text-purple-800">请完善教学参数</h3>
//               <div className="space-y-4">
//                 <div className="space-y-2">
//                   <label className="text-sm font-medium text-purple-700">教学风格</label>
//                   <select
//                     id="types"
//                     className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
//                     aria-invalid={errors.style ? "true" : "false"}
//                     {...register('style', {
//                       required: '请选择教学风格',
//                       validate: value => value !== '选择教学风格' || '请选择有效选项'
//                     })}
//                   >
//                     <option value="">选择教学风格</option>
//                     <option value="生动风趣">生动风趣</option>
//                     <option value="严谨细致">严谨细致</option>
//                     <option value="深入浅出">深入浅出</option>
//                   </select>
//                   {errors.style && (
//                     <p className="text-red-500 text-sm mt-1">{errors.style.message}</p>
//                   )}
//                 </div>
//                 <div className="space-y-2">
//                   <label className="text-sm font-medium text-purple-700">预计章节数</label>
//                   <div className="flex space-x-2 items-center">
//                     <input
//                       type="number"
//                       {...register('chapters', { required: true, valueAsNumber: true })}
//                       className="w-1/4 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
//                     />
//                     <span className="text-sm text-gray-500">章</span>
//                   </div>
//                 </div>
//                 <div className="space-y-2">
//                   <label className="text-sm font-medium text-purple-700">预计时长</label>
//                   <div className='flex space-x-2 items-center'>
//                     <input
//                       type="number"
//                       {...register('duration', { required: true, valueAsNumber: true })}
//                       className="w-1/4 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
//                     />
//                     <span className="text-sm text-gray-500">分钟</span>
//                   </div>
//                 </div>
//               </div>
//               <Button
//                 className="w-full bg-purple-600 hover:bg-purple-700 text-white"
//                 onClick={handleSubmit(onFeatureSubmit)}
//               >
//                 生成课程方案
//               </Button>
//             </div>
//           </div>
//         </div>
//       )}


//       {step == 'showTimeLine' && (
//         <div className="bg-white rounded-2xl p-8 shadow-lg border border-purple-100">
//           <h3 className="text-2xl font-bold text-purple-800 mb-6">课程时间轴</h3>
//           <div className="mx-4">
//             <VerticalTimeline
//               cards={generatedCards}
//             />
//           </div>
//           <div className="flex flex-row-reverse justify-between items-center gap-4 mt-6">
//             <button
//               className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition-colors"
//               onClick={onSyllabusSubmit}
//             >
//               提交方案
//             </button>
//             <div className="text-sm text-gray-500 font-medium">
//               总时长：{generatedCards.reduce((acc, card) => acc + (parseInt(card.data.duration) || 0), 0)} 分钟
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

import React from 'react';

const HomePage = () => {
  return (
    <div>
      {/** 页面内容将在这里添加 */}
    </div>
  );
};

export default HomePage;