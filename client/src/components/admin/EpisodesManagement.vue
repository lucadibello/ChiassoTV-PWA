<script>
import Breadcumb from '@/components/global/Breadcumb'
import moment from 'moment'
import SeriesService from '@/services/SeriesService'
import BannerService from '@/services/BannerService'

export default {
  components: {
    Breadcumb
  },
  data () {
    return {
      items: [],
      fields: [
        {
          key: 'name',
          label: 'Nome',
          sortable: true
        },
        {
          key: 'createdAt',
          label: 'Creato il',
          sortable: true
        },
        {
          key: 'actions',
          label: '',
          sortable: false
        }
      ],
      notification: 'success',
      message: '',
      dismissSecs: 5,
      dismissCountDown: 0,
      showDismissibleAlert: false,
    }
  },
  methods: {

  }
}
</script>