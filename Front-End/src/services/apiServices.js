import api from '../api/api'
import { API_ENDPOINTS } from '../constants/apiEndpoints'

export const adminLogin = async (credentials) => {
  return api.post(API_ENDPOINTS.ADMIN_LOGIN, credentials)
}

export const fetchUsers = async (token) => {
  return api.get(API_ENDPOINTS.ADMIN_USERS, {
    headers: { Authorization: `Bearer ${token}` },
  })
}

export const deleteUser = async (userId, token) => {
  return api.delete(API_ENDPOINTS.ADMIN_USER_BY_ID(userId), {
    headers: { Authorization: `Bearer ${token}` },
  })
}

export const updateUser = async (userId, data, token) => {
  return api.put(API_ENDPOINTS.ADMIN_USER_BY_ID(userId), data, {
    headers: { Authorization: `Bearer ${token}` },
  })
}

export const addUser = async (data, token) => {
  return api.post(API_ENDPOINTS.ADMIN_USERS, data, {
    headers: { Authorization: `Bearer ${token}` },
  })
}

export const userSignup = async (data) => {
  return api.post(API_ENDPOINTS.USER_SIGNUP, data)
}

export const userLogin = async (credentials) => {
  return api.post(API_ENDPOINTS.USER_LOGIN, credentials)
}

export const getUserProfile = async (userId) => {
  return api.get(API_ENDPOINTS.USER_PROFILE(userId))
}

export const updateUserProfile = async (userId, data) => {
  return api.post(API_ENDPOINTS.USER_PROFILE_UPDATE(userId), data, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })
}

export const getUserData = async (userId, token) => {
  return api.get(API_ENDPOINTS.USER_DATA(userId), {
    headers: { Authorization: `Bearer ${token}` },
  })
}

export const getUserById = async (userId, token) => {
  return api.get(API_ENDPOINTS.USER_BY_ID(userId), {
    headers: { Authorization: `Bearer ${token}` },
  })
}