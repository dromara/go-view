import login from './login'
import project from './project'

const global = {
  doc_addr: 'Document',
  code_addr: 'Code',
  form_account: 'Please enter your account or email',
  form_password: 'Please enter your password',
  // header
  doc: 'Document',
  help: 'Help',
  contact: 'About Software',
  logout: 'Logout',
  logout_success: 'Logout success！',
  logout_failure: 'Logout Failed！',
  // system setting
  sys_set: 'System Setting',
  lang_set: 'Language Setting',
  // right key
  r_edit: 'Edit',
  r_preview: 'Preview',
  r_copy: 'Clone',
  r_rename: 'Rename',
  r_publish: 'Publish',
  r_unpublish: 'Unpublish',
  r_download: 'Download',
  r_delete: 'Delete',
  r_more: 'More',
}

const http = {
  error_message: 'The interface is abnormal, please check the interface!',
  token_overdue_message: 'Login expired, please log in again!'
}

export default {
  global,
  http,
  login,
  project
}
