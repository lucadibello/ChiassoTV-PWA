import Api from '@/services/Api'

export default {
  add (data) {
    return Api().post('ads', data)
  },
  getAvailable () {
    return Api().get('ads/available')
  },
  getInbound () {
    return Api().get('ads/inbound')
  },
  getExpired () {
    return Api().get('ads/expired')
  },
  getBanner (id) {
    return Api().fetch(`ads/${id}`)
  },
  delete (id) {
    return Api().delete(`ads/${id}`);
  }
}