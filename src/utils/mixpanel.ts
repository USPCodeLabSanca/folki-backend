const Mixpanel = require('mixpanel')
const mixpanel = Mixpanel.init(process.env.MIXPANEL_TOKEN)
export default mixpanel
