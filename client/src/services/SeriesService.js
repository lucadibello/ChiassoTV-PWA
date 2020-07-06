import Api from '@/services/Api'

export default {
  get () {
    return Api().get('series')
  },
  create (data) {
    return Api().post('series', data)
  },
  delete (name) {
    return Api().delete('series/' + name)
  },
  edit (data, name) {
    return Api().put('series/' + name, data)
  },
  upload (data) {
    return Api().patch('series/', data)
  },
  getBanners () {
    const options = {
      method: 'REPORT',
      url: 'series/'
    }

    return Api().request(options)
  }
}
