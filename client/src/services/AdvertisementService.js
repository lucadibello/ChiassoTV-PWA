import Api from '@/services/Api'

export default {
  add (data) {
    return Api().post('F3334AC9EF26166DEDEBD319A18F9CC7', data)
  },
  getAvailable () {
    return Api().get('F3334AC9EF26166DEDEBD319A18F9CC7/available')
  },
  getInbound () {
    return Api().get('F3334AC9EF26166DEDEBD319A18F9CC7/inbound')
  },
  getExpired () {
    return Api().get('F3334AC9EF26166DEDEBD319A18F9CC7/expired')
  },
  getBanner (id) {
    return Api().fetch(`F3334AC9EF26166DEDEBD319A18F9CC7/${id}`)
  },
  delete (id) {
    return Api().delete(`F3334AC9EF26166DEDEBD319A18F9CC7/${id}`);
  }
}