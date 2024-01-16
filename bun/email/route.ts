import { Elysia, t } from "elysia";

import SibApiV3Sdk from "@getbrevo/brevo";
import { Eta } from "eta";
import path from "node:path";

if (!Bun.env.BREVO_API_KEY) throw new Error("Server Error!");
let apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();
let apiKey = (apiInstance as any).authentications["apiKey"];
apiKey.apiKey = Bun.env.BREVO_API_KEY;
const eta = new Eta({ views: path.resolve(import.meta.dir, "./templates") });

const senderMail = "automatic@partialty.com";
const senderName = "Partialty";

const app = new Elysia().group("/mail", (app) => {
  return app
    .post("/test", ({ headers }) => {
      console.log(headers);
    })
    .post(
      "/sendMail/verifyMail",
      async ({ body }) => {
        const res = eta.render("verifyEmail.eta", {
          verifyLink: body.verifyLink,
        });
        let sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail();
        sendSmtpEmail.subject = "Verify Your Partialty Account";
        sendSmtpEmail.htmlContent = res;
        sendSmtpEmail.sender = { email: senderMail, name: senderName };
        sendSmtpEmail.to = [{ email: body.receiverEmail }];
        await apiInstance.sendTransacEmail(sendSmtpEmail).then(
          (data) => {
            console.log("API called successfully. Returned data: " + data.body.messageId);
          },
          (error) => {
            throw new Error("Server Error! ", error);
          }
        );
        return { message: "OK" };
      },
      {
        body: t.Object({
          verifyLink: t.String(),
          receiverEmail: t.String(),
        }),
      }
    );
});

export default app;
