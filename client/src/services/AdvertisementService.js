import Api from '@/services/Api'

export default {
  add (data) {
    return Api().post('ads', data)
  },
}