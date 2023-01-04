export enum SystemStoreUserInfoEnum {
  USER_TOKEN = 'userToken',
  TOKEN_NAME = 'tokenName',
  USER_ID = 'userId',
  USER_NAME = 'userName',
  NICK_NAME = 'nickName',
}

export interface UserInfoType {
  [SystemStoreUserInfoEnum.USER_TOKEN]?: string,
  [SystemStoreUserInfoEnum.TOKEN_NAME]?: string,
  [SystemStoreUserInfoEnum.USER_ID]?: string,
  [SystemStoreUserInfoEnum.USER_NAME]?: string,
  [SystemStoreUserInfoEnum.NICK_NAME]?: string,
}

export interface FetchInfoType {
  OSSUrl?: string,
}

export enum SystemStoreEnum {
  // 用户
  USER_INFO = 'userInfo',
  // 请求
  FETCH_INFO = 'fetchInfo'
}

export interface SystemStoreType {
  [SystemStoreEnum.USER_INFO]: UserInfoType
  [SystemStoreEnum.FETCH_INFO]: FetchInfoType
}