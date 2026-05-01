import API from './axiosConfig';

// Public endpoints
export const getServices = () => API.get('/services');
export const getServiceById = (id) => API.get(`/services/${id}`);
export const getObituaries = () => API.get('/obituaries');
export const getObituaryById = (id) => API.get(`/obituaries/${id}`);
export const getTestimonials = () => API.get('/testimonials');
export const submitContact = (data) => API.post('/contact', data);
export const getSettings = () => API.get('/settings');

// FAQ (public)
export const getFaqCategories = () => API.get('/faq/categories');
export const getQuestionsByCategory = (categoryId) => API.get(`/faq/categories/${categoryId}/questions`);
export const getFaqQuestion = (id) => API.get(`/faq/questions/${id}`);