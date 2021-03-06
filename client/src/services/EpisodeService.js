import Api from '@/services/Api'

export default {
  get (seriesName) {
    return Api().get('episodes/' + seriesName)
  },
  getEpisode (seriesName, episodeName) {
    return Api().get('episodes/' + seriesName + '/' + episodeName)
  },
  add (data, seriesName, isLocalVideo = true) {
    return Api().post('episodes/' + seriesName + '/' + (isLocalVideo ? 'local' : 'youtube'), data)
  },
  delete (seriesName, episodeName) {
    return Api().delete(`episodes/${seriesName}/${episodeName}`)
  },
  swapOrder (seriesName, context) {
    return Api().patch(`episodes/${seriesName}/move`, context)
  }
}
