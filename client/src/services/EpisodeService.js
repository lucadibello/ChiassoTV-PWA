import Api from '@/services/Api'

export default {
  get (seriesName) {
    return Api().get('episodes/' + seriesName)
  },
  add (data, seriesName, isLocalVideo = true) {
    return Api().post('episodes/' + seriesName + '/' + (isLocalVideo ? 'local' : 'youtube'), data)
  },
  delete (seriesName, episodeName) {
    return Api().delete(`episodes/${seriesName}/${episodeName}`)
  }
}
