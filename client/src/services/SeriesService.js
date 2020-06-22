import Api from '@/services/Api'

export default {
  get () {
    return Api().get('series')
  },
  create (user) {
    return Api().post('series', user)
  },
  delete (name) {
    return Api().delete('series/' + name)
  },
  edit (data, name) {
    return Api().put('series/' + name, data)
  }
}
