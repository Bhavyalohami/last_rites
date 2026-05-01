// import React, { useState, useEffect } from 'react';
// import { getFaqCategories, getQuestionsByCategory, getFaqQuestion } from '../../api/publicAPI';
// import CategoryList from './CategoryList';
// import QuestionList from './QuestionList';
// import AnswerView from './AnswerView';
// import useAuth from '../../hooks/useAuth';

// const ChatbotWidget = () => {
//   const { isAuthenticated, user } = useAuth();
//   const [isOpen, setIsOpen] = useState(false);
//   const [categories, setCategories] = useState([]);
//   const [selectedCategory, setSelectedCategory] = useState(null);
//   const [questions, setQuestions] = useState([]);
//   const [selectedQuestion, setSelectedQuestion] = useState(null);
//   const [loading, setLoading] = useState(false); 

//   // Don't show for admin users
//   if (isAuthenticated && user?.role === 'admin') return null;

//   useEffect(() => {
//     if (isOpen) {
//       loadCategories();
//     }
//   }, [isOpen]);

//   const loadCategories = async () => {
//     setLoading(true);
//     try {
//       const res = await getFaqCategories();
//       setCategories(res.data);
//     } catch (err) {
//       console.error('Failed to load FAQ categories');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleSelectCategory = async (categoryId) => {
//     setLoading(true);
//     try {
//       const res = await getQuestionsByCategory(categoryId);
//       setQuestions(res.data.questions);
//       setSelectedCategory(res.data.category);
//       setSelectedQuestion(null);
//     } catch (err) {
//       console.error('Failed to load questions');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleSelectQuestion = async (questionId) => {
//     setLoading(true);
//     try {
//       const res = await getFaqQuestion(questionId);
//       setSelectedQuestion(res.data);
//     } catch (err) {
//       console.error('Failed to load answer');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleBack = () => {
//     if (selectedQuestion) {
//       setSelectedQuestion(null);
//     } else if (selectedCategory) {
//       setSelectedCategory(null);
//       setQuestions([]);
//     }
//   };

//   const handleClose = () => {
//     setIsOpen(false);
//     setSelectedCategory(null);
//     setSelectedQuestion(null);
//     setQuestions([]);
//   };

//   return (
//     <>
//       {/* Chatbot button */}
//       <button
//         onClick={() => setIsOpen(true)}
//         className="fixed bottom-4 right-4 bg-primary text-white rounded-full p-4 shadow-lg hover:bg-opacity-90 transition z-50 animate-bounce"
//       >
//         💬
//       </button>

//       {/* Chatbot modal */}
//       {isOpen && (
//         <div className="fixed bottom-20 right-4 w-80 bg-white rounded-lg shadow-xl z-50 overflow-hidden border animate-slideIn">
//           <div className="bg-primary text-white px-4 py-3 flex justify-between items-center">
//             <h3 className="font-serif">FAQ Assistant</h3>
//             <button onClick={handleClose} className="text-white hover:text-gray-200">✕</button>
//           </div>
//           <div className="h-96 overflow-y-auto p-4">
//             {loading ? (
//               <div className="flex justify-center items-center h-full">
//                 <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
//               </div>
//             ) : selectedQuestion ? (
//               <AnswerView question={selectedQuestion} onBack={handleBack} />
//             ) : selectedCategory ? (
//               <QuestionList
//                 category={selectedCategory}
//                 questions={questions}
//                 onSelectQuestion={handleSelectQuestion}
//                 onBack={handleBack}
//               />
//             ) : (
//               <CategoryList categories={categories} onSelectCategory={handleSelectCategory} />
//             )}
//           </div>
//         </div>
//       )}
//     </>
//   );
// };

// export default ChatbotWidget;

import React, { useState, useEffect } from 'react';
import { getFaqCategories, getQuestionsByCategory, getFaqQuestion } from '../../api/publicAPI';
import CategoryList from './CategoryList';
import QuestionList from './QuestionList';
import AnswerView from './AnswerView';
import useAuth from '../../hooks/useAuth';
import { MessageCircle, X } from 'lucide-react';

const ChatbotWidget = () => {
  const { isAuthenticated, user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [selectedQuestion, setSelectedQuestion] = useState(null);
  const [loading, setLoading] = useState(false);

  // Always call hooks unconditionally
  useEffect(() => {
    if (isOpen) {
      loadCategories();
    }
  }, [isOpen]);

  const loadCategories = async () => {
    setLoading(true);
    try {
      const res = await getFaqCategories();
      setCategories(res.data);
    } catch (err) {
      console.error('Failed to load FAQ categories');
    } finally {
      setLoading(false);
    }
  };

  const handleSelectCategory = async (categoryId) => {
    setLoading(true);
    try {
      const res = await getQuestionsByCategory(categoryId);
      setQuestions(res.data.questions);
      setSelectedCategory(res.data.category);
      setSelectedQuestion(null);
    } catch (err) {
      console.error('Failed to load questions');
    } finally {
      setLoading(false);
    }
  };

  const handleSelectQuestion = async (questionId) => {
    setLoading(true);
    try {
      const res = await getFaqQuestion(questionId);
      setSelectedQuestion(res.data);
    } catch (err) {
      console.error('Failed to load answer');
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    if (selectedQuestion) {
      setSelectedQuestion(null);
    } else if (selectedCategory) {
      setSelectedCategory(null);
      setQuestions([]);
    }
  };

  const handleClose = () => {
    setIsOpen(false);
    setSelectedCategory(null);
    setSelectedQuestion(null);
    setQuestions([]);
  };

  // Now conditionally render after all hooks
  if (isAuthenticated && user?.role === 'admin') return null;

  return (
    <>
      {/* Chatbot button */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-4 right-4 z-50 rounded-full bg-stone-950 p-4 text-white shadow-xl transition hover:bg-stone-800"
        aria-label="Open FAQ assistant"
      >
        <MessageCircle className="h-6 w-6" />
      </button>

      {/* Chatbot modal */}
      {isOpen && (
        <div className="fixed bottom-20 right-4 z-50 w-[calc(100vw-2rem)] max-w-sm overflow-hidden rounded-lg border border-stone-200 bg-white shadow-2xl">
          <div className="flex items-center justify-between bg-[#182522] px-4 py-3 text-white">
            <h3 className="font-semibold">FAQ Assistant</h3>
            <button onClick={handleClose} className="rounded-full p-1 text-white hover:bg-white/10" aria-label="Close FAQ assistant">
              <X className="h-5 w-5" />
            </button>
          </div>
          <div className="h-96 overflow-y-auto p-4">
            {loading ? (
              <div className="flex justify-center items-center h-full">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              </div>
            ) : selectedQuestion ? (
              <AnswerView question={selectedQuestion} onBack={handleBack} />
            ) : selectedCategory ? (
              <QuestionList
                category={selectedCategory}
                questions={questions}
                onSelectQuestion={handleSelectQuestion}
                onBack={handleBack}
              />
            ) : (
              <CategoryList categories={categories} onSelectCategory={handleSelectCategory} />
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default ChatbotWidget;
