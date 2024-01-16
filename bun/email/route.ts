import { Elysia, t } from "elysia";

import SibApiV3Sdk from "@getbrevo/brevo";
import { Receiver } from "@upstash/qstash";
import { Eta } from "eta";
import path from "node:path";

if (
  !Bun.env.BREVO_API_KEY ||
  !Bun.env.QSTASH_CURRENT_SIGNING_KEY ||
  !Bun.env.QSTASH_NEXT_SIGNING_KEY
)
  throw new Error("Server env var Error!");
let apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();
let apiKey = (apiInstance as any).authentications["apiKey"];
apiKey.apiKey = Bun.env.BREVO_API_KEY;
const eta = new Eta({ views: path.resolve(import.meta.dir, "./templates") });

const senderMail = "automatic@partialty.com";
const senderName = "Partialty";

const app = new Elysia().group("/mail", (app) => {
  return app.post(
    "/sendMail/verifyMail",
    async ({ body, headers }) => {
      if (!headers["upstash-signature"]) throw Error("Server Error!");

      const r = new Receiver({
        currentSigningKey: Bun.env.QSTASH_CURRENT_SIGNING_KEY!,
        nextSigningKey: Bun.env.QSTASH_NEXT_SIGNING_KEY!,
      });

      const isValid = await r.verify({
        signature: headers["upstash-signature"],
        body: JSON.stringify(body),
        clockTolerance: 1,
      });

      if (!isValid) throw new Error("Server Error!");

      console.log("OK");

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

      return {
        statusCode: 200,
        body: "OK",
      };
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
