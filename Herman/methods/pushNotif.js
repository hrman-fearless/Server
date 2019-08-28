const { Expo } = require('expo-server-sdk');


module.exports.pushNotif = async (user) => {
  const expo = new Expo()
  const postNotifications = (data, tokens) => {
    var plus7time = new Date().toLocaleString("en-US", {timeZone: "Asia/Jakarta"});
    plus7time = new Date(plus7time);
    const messages = {
      to: tokens,
      sound: 'default',
      title: 'You Have Arrived at the Office',
      body: `You Arrive at: ${plus7time.getHours()}:${(plus7time.getMinutes() < 10) ? '0' + plus7time.getMinutes() : plus7time.getMinutes()}`,
      data,
    }
    console.log("masuk");
    return Promise.all(
      expo.chunkPushNotifications([messages]).map(expo.sendPushNotificationsAsync, expo)
    )
  }
  try {
    await postNotifications({ some: 'data' }, [
      user.deviceID,
    ])
  } catch (error) {
    console.log(error, 'Error');
  }

}