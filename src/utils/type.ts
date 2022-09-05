import isObject from 'lodash/isObject'

export function isString(p: any): p is string {
  return typeof p === 'string'
}

export function isNumber(p: any): p is number {
  return typeof p === 'number'
}

export function isBoolean(p: any): p is boolean {
  return typeof p === 'boolean'
}

export function isUndefined(p: any): p is undefined {
  return typeof p === 'undefined'
}

export function isNull(p: any): p is null {
  return p === null
}

export function isArray(p: any): p is [] {
  return Array.isArray(p)
}

export const toNumber = (number: number | string, toFixedNumber = 2) => {
  return isString(number) ? parseFloat(parseFloat(number).toFixed(2)) : number
}

export const toString = (str: any) => {
  return isNumber(str) ? `${str}` : (isObject(str) ? JSON.stringify(str) : str)
}