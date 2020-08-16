import Api from '@/services/Api'

export default {
  upload (data) {
    return Api().patch('banners/', data)
  },
  get () {
    return Api().get('banners/')
  }
}
