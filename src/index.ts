import express, { Request, Response } from "express";
import bodyParser from "body-parser";
import * as admin from "firebase-admin";

require("dotenv").config();

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

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

// this function is LEGACY Cloud Messaging API
const sendNotificationToClientV1 = async () => {
  const topic = "test-fcm-topic";
  const dummyNoti1 = {
    message: {
      topic: "matchday",
      notification: {
        title: "Background Message Title",
        body: "Background message body",
      },
      webpush: {
        fcm_options: {
          link: "https://dummypage.com",
        },
      },
    },
  };
  const dummyNoti2 = {
    message: "matchday",
  };

  messaging
    .sendToTopic(topic, { data: dummyNoti2 })
    .then((response) => {
      console.log(`Notifications sent:${response}successful `);
    })
    .catch((error) => {
      console.log("Error sending message:", error);
    });
};

// this is Cloud Messaging API v1
const sendNotificationToClientV2 = async () => {
  const topic = "test-fcm-topic";

  // maybe setup all the scheduling, time to live of the message, etc in here. need to do POC
  const message = {
    data: {
      score: "850",
      time: "2:45",
    },
    topic: topic,
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

// ------------------------------------------------------------------------------------------------------------------------------------------------- FIREBASE ADMIN

app.get("/send", async (_req: Request, res: Response) => {
  // await sendNotificationToClientV1();

  await sendNotificationToClientV2();
  return res.send("Message sent");
});

app.get("/", async (_req: Request, res: Response) => {
  return res.send("Express Typescript on Vercel");
});

const port = process.env.PORT || 8080;
app.listen(port, () => {
  return console.log(`Server is listening on ${port}`);
});
