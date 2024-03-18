import { Expo, ExpoPushMessage } from 'expo-server-sdk'

async function sendPushNotifications(pushTokens: string[], title: string, body: string, data?: any): Promise<void> {
  let expo = new Expo()

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

  console.log(chunks)

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
