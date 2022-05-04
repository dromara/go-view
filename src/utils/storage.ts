
/**
 * * 存储本地会话数据
 * @param k 键名
 * @param v 键值（无需stringiiy）
 * @returns RemovableRef
 */
 export const setLocalStorage = <T>(k: string, v: T) => {
  try {
    window.localStorage.setItem(k, JSON.stringify(v))
  } catch (error) {
    return false
  }
}

/**
 * * 获取本地会话数据
 * @param k 键名
 * @returns any
 */
 export const getLocalStorage = (k: string) => {
  const item = window.localStorage.getItem(k)
  try {
    return item ? JSON.parse(item) : item
  } catch (err) {
    return item
  }
}

/**
 * * 清除本地会话数据
 * @param name 
 */
 export const clearLocalStorage = (name: string) => {
  window.localStorage.removeItem(name)
}

/**
 * * 存储临时会话数据
 * @param k 键名
 * @param v 键值
 * @returns RemovableRef
 */
export const setSessionStorage = <T>(k: string, v: T) => {
  try {
    window.sessionStorage.setItem(k, JSON.stringify(v))
  } catch (error) {
    return false
  }
}

/**
 * * 获取临时会话数据
 * @returns any
 */
export const getSessionStorage: (k: string) => any = (k: string) => {
  const item = window.sessionStorage.getItem(k)
  try {
    return item ? JSON.parse(item) : item
  } catch (err) {
    return item
  }
}

/**
 * * 清除本地会话数据
 * @param name 
 */
export const clearSessioStorage = (name: string) => {
  window.sessionStorage.removeItem(name)
}