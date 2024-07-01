import express, { Request, Response } from "express";
import bodyParser from "body-parser";
import * as admin from "firebase-admin";

require("dotenv").config();

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

export enum notificationTypeEnum {
  inApp = "inApp",
  pushNotification = "pushNotification",
}

// -------------------------------------------------------------------------------------------------------------------- FIREBASE ADMIN
const projectId = "";
const clientEmail = "";
const privateKey = "";
admin.initializeApp({
  credential: admin.credential.cert({
    projectId: projectId,
    privateKey: privateKey.replace(/\\n/g, "\n"),
    clientEmail: clientEmail,
  }),
});

const messaging = admin.messaging();

// rss: https://stackoverflow.com/questions/57767439/an-error-occurred-when-trying-to-authenticate-to-the-fcm-servers

// firebase rss:
// - https://firebase.google.com/docs/cloud-messaging/android/topic-messaging#build_send_requests

const androidConfig: admin.messaging.AndroidConfig = {
  priority: "high",
};

// this is Cloud Messaging API v1
const sendNotificationToTopic = async () => {
  const topic = "takeConsentTopic";

  const message = {
    notification: {
      title: "Greetings MyBid user - Zahir testing",
      body: "this is a notification - Zahir",
    },
    data: {
      purpose: "take consent",
      campaignId: "100",
      occurrenceId: "12",
      trigger: "Homepage",
    },
    topic,
    android: androidConfig,
    apns: {
      payload: {
        aps: {
          sound: "default",
          "content-available": 1,
        },
      },
      headers: {
        "apns-priority": "5",
      },
    },
  };

  const shannonmessage = {
    notification: {
      title: "Shannon is testing v1",
      body: "Shannon's right time campaign v1",
    },
    data: {
      title: "Shannon is testing v1",
      body: "Shannon's Settings campaign v1",
      purpose: "campaign message",
      trigger: "Settings",
      campaignExpirationTime: "1819575049914",
      notificationType: "inApp",
    },
    topic: topic,
    android: androidConfig,
    apns: {
      payload: {
        aps: {
          sound: "default",
          "content-available": "1",
        },
      },
      headers: {
        "apns-priority": "5",
      },
    },
  };

  const asd = new Date();
  const hour = asd.getHours();
  const minutes = asd.getMinutes();
  const secs = asd.getSeconds();
  const timing = `${hour}:${minutes}:${secs}`;

  // TopicMessage, inApp message
  let messageV1 = {
    notification: {
      title: "Greetings MyBid user - Zahir testing",
      body: timing,
    },
    data: {
      title: "Greetings MyBid user - Zahir testing",
      body: timing,
      purpose: "take consent",
      // purpose: "campaign message",
      campaignId: "100",
      occurrenceId: "12",
      notificationType: "inApp",
      campaignExpirationTime: "1819575049914",
      // trigger: "Settings",
      trigger: "Homepage",
    },
    topic: topic,
    android: androidConfig,
    apns: {
      payload: {
        aps: {
          sound: "default",
          "content-available": 1,
        },
      },
      headers: {
        "apns-priority": "5",
      },
    },
  };

  // TopicMessage, pushNotification message
  let Newmessage = {
    notification: {
      title: "Greetings MyBid user - Zahir testing",
      body: "this is a notification - Zahir",
    },
    data: {
      // purpose: "take consent",
      purpose: "campaign message",
      campaignId: "100",
      occurrenceId: "12",
      // trigger: "Homepage",
      trigger: "Settings",
      notificationType: "inApp",
      campaignExpirationTime: "1751082024",
    },
    topic: topic,
    android: androidConfig,
    apns: {
      payload: {
        aps: {
          sound: "default",
          "content-available": 1,
        },
      },
      headers: {
        "apns-priority": "5",
      },
    },
  };

  messaging
    .send(messageV1)
    .then((response) => {
      // Response is a message ID string.
      console.log("Successfully sent message:", response);
    })
    .catch((error) => {
      console.log("Error sending message:", error);
    });
};

const sendNotificationToDeviceToken = async () => {
  const message = {
    notification: {
      title: "Zahir is testing",
      body: "Zahir's 2nd campaign",
    },
    // token:
    //   "f59UQNcrReCykAcF2dOcnI:APA91bHkHIASIGNMvNFlceonHBiSPAAtRy9t-4hPLbNG9gSXxoEDw8CsCmapc7On2Qe539X5vSH5QByrBXfFJY3l09EULP-oQETLuLZtep5jbvIZsq60X-tpvgILBOGtTP_zLQDU1N-4",
    token:
      "cMes8799dUwPiYJEEjZIbE:APA91bGDXypqUt2z35BmQ3wBJrQCgs-py7gNNnx308OOpQP_T_Q2Td4cjnE8piT7ZcznwrceTF7P3VBmpjVZyb2yxzQmUMNoYq97PbyQYi1G6OzVGgRyjbg77nvE7B7OpZlsY1mqzCFG",
    data: {
      purpose: "campaign message",
    },
    android: androidConfig,
    apns: {
      payload: {
        aps: {
          sound: "default",
          "content-available": 1,
        },
      },
      headers: {
        "apns-priority": "5",
      },
    },
  };

  messaging
    .send(message)
    .then((response) => {
      // Response is a message ID string.
      console.log("Successfully sent message:", response);
    })
    .catch((error) => {
      console.log("Error sending message:", error);
    });
};

app.get("/send-topic", async (_req: Request, res: Response) => {
  const asd = new Date();
  const hour = asd.getHours();
  const minutes = asd.getMinutes();
  const secs = asd.getSeconds();
  const timing = `${hour}:${minutes}:${secs}`;

  // await sendNotificationToClientV1();
  try {
    await sendNotificationToTopic();
    return res.send(`Topic Message sent ${timing}`);
  } catch (error) {
    console.log(error);
  }
});

app.get("/send-deviceToken", async (_req: Request, res: Response) => {
  try {
    await sendNotificationToDeviceToken();
    return res.send("Campaign Message sent");
  } catch (error) {
    console.log(error);
  }
});

const port = process.env.PORT || 8080;
app.listen(port, () => {
  return console.log(`Server is listening on ${port}`);
});
