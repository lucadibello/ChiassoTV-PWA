import Api from '@/services/Api'

export default {
  add (seriesName, episodeName) {
    return Api().post('homepage/' + seriesName + '/' + episodeName)
  },
  delete (seriesName, episodeName) {
    return Api().delete('homepage/' + seriesName + '/' + episodeName)
  },
  get () {
    return Api().get('homepage/')
  }
}
