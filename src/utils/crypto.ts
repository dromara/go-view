import CryptoJS from 'crypto-js'
import { isString } from './type'

const KEY = 'mt'

/**
 * * 加密
 * @param data { string }
 * @returns 
 */
export const cryptoEncode = (data: string): string => {
  if (!isString(data)) return ''
  // 加密
  const encryptedData = CryptoJS.AES.encrypt(data, KEY, {
    mode: CryptoJS.mode.ECB,
    padding: CryptoJS.pad.Pkcs7
  }).toString()
  return encryptedData
}

/**
 * * 解密
 * @param data { string }
 * @returns 
 */
export const cryptoDecode = (data: string): string => {
  if (!isString(data)) return ''
  // 解密
  const decryptedData = CryptoJS.AES.decrypt(data, KEY, {
    mode: CryptoJS.mode.ECB,
    padding: CryptoJS.pad.Pkcs7
  })
  return decryptedData.toString(CryptoJS.enc.Utf8)
}
