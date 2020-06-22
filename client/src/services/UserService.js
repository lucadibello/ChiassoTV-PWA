import Api from '@/services/Api'

export default {
  get () {
    return Api().get('user')
  },
  create (user) {
    return Api().post('user', user)
  },
  delete (username) {
    return Api().delete('user/' + username)
  },
  edit (data, username) {
    return Api().put('user/' + username, data)
  }
}
