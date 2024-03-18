import Expo from './ExpoClient'
import { ExpoPushMessage } from './ExpoClient'

async function sendPushNotifications(pushTokens: string[], title: string, body: string, data?: any): Promise<void> {
  let expo = new Expo({ useFCM: true })

  let messages: ExpoPushMessage[] = []
  for (let pushToken of pushTokens) {
    if (!Expo.isExpoPushToken(pushToken)) continue

    messages.push({
      to: pushToken,
      sound: 'default',
      title,
      body,
      data,
    })
  }

  let chunks = expo.chunkPushNotifications(messages)
  let tickets = []

  for (let chunk of chunks) {
    try {
      let ticketChunk = await expo.sendPushNotificationsAsync(chunk)
      tickets.push(...ticketChunk)
    } catch (error: any) {
      console.error(`[ERROR] [Send Push Notifications] Unexpected Send Push Notifications: ${error.message}`)
    }
  }
}

export default sendPushNotifications
