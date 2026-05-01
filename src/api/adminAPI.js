import API from './axiosConfig';

// Admin login
export const adminLogin = (credentials) => API.post('/admin/login', credentials);

// Services management
export const getAdminServices = () => API.get('/admin/services');
export const createService = (data) => API.post('/admin/services', data);
export const updateService = (id, data) => API.put(`/admin/services/${id}`, data);
export const deleteService = (id) => API.delete(`/admin/services/${id}`);

// Obituaries management
export const getAdminObituaries = () => API.get('/admin/obituaries');
export const createObituary = (data) => API.post('/admin/obituaries', data);
export const updateObituary = (id, data) => API.put(`/admin/obituaries/${id}`, data);
export const deleteObituary = (id) => API.delete(`/admin/obituaries/${id}`);

// Testimonials management
export const getAdminTestimonials = () => API.get('/admin/testimonials');
export const createTestimonial = (data) => API.post('/admin/testimonials', data);
export const updateTestimonial = (id, data) => API.put(`/admin/testimonials/${id}`, data);
export const deleteTestimonial = (id) => API.delete(`/admin/testimonials/${id}`);

// Contact messages
export const getMessages = () => API.get('/admin/messages');
export const deleteMessage = (id) => API.delete(`/admin/messages/${id}`);

// Settings
export const getAdminSettings = () => API.get('/admin/settings');
export const updateSettings = (data) => API.put('/admin/settings', data);

// ===== NEW: User Auth & Chat =====
// User registration/login
export const registerUser = (data) => API.post('/auth/register', data);
export const loginUser = (credentials) => API.post('/auth/login', credentials);
export const getCurrentUser = () => API.get('/auth/me');

// Conversations
export const getConversations = () => API.get('/chat/conversations');
export const startConversation = (subject) => API.post('/chat/conversations', { subject });
export const getConversationMessages = (conversationId) => API.get(`/chat/conversations/${conversationId}/messages`);
export const sendMessage = (conversationId, message) => API.post(`/chat/conversations/${conversationId}/messages`, { message });
export const updateConversationStatus = (conversationId, status) => API.put(`/chat/conversations/${conversationId}/status`, { status });

// ===== NEW: Admin FAQ Management =====
export const getAdminFaqCategories = () => API.get('/admin/faq/categories');
export const createFaqCategory = (data) => API.post('/admin/faq/categories', data);
export const updateFaqCategory = (id, data) => API.put(`/admin/faq/categories/${id}`, data);
export const deleteFaqCategory = (id) => API.delete(`/admin/faq/categories/${id}`);

export const getAdminFaqQuestions = () => API.get('/admin/faq/questions');
export const createFaqQuestion = (data) => API.post('/admin/faq/questions', data);
export const updateFaqQuestion = (id, data) => API.put(`/admin/faq/questions/${id}`, data);
export const deleteFaqQuestion = (id) => API.delete(`/admin/faq/questions/${id}`);
