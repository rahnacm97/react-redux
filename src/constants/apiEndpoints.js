export const API_ENDPOINTS = {
  ADMIN_LOGIN: '/admin/login',
  ADMIN_USERS: '/admin/users',
  ADMIN_USER_BY_ID: (id) => `/admin/users/${id}`,
  USER_SIGNUP: '/auth/signup',
  USER_LOGIN: '/auth/login',
  USER_PROFILE: (id) => `/auth/profile/${id}`,
  USER_PROFILE_UPDATE: (id) => `/auth/profile/update/${id}`,
  USER_DATA: (id) => `/auth/userdata/${id}`,
  USER_BY_ID: (id) => `/auth/users/${id}`,
}