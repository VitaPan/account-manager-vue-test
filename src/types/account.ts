export interface IAccount {
  id: string
  label: string
  type: string
  login: string
  password: string | null
  errors: IAccountErrors
  isNew: boolean
}

export interface IAccountErrors {
  label?: string
  type?: string
  login?: string
  password?: string
}

export interface IAccountFormData {
  type: string
  login: string
  password: string | null
  label: string
  labels: { text: string }[] 
}

export interface ILabelObject {
  text: string
}