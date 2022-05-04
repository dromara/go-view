export enum TypeEnum {
  BUTTON = 'button',
  IMPORTUPLOAD = 'importUpload'
}

export type BtnListType = {
  key: string
  type: TypeEnum
  name: string
  icon: any
  handle?: () => void
}
