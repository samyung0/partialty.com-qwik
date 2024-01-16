import { Elysia, t } from "elysia";

// import SibApiV3Sdk from "@getbrevo/brevo";
import { Receiver } from "@upstash/qstash";
import { Eta } from "eta";
import path from "node:path";
import { Resend } from "resend";

if (
  !Bun.env.RESEND_API_KEY ||
  !Bun.env.QSTASH_CURRENT_SIGNING_KEY ||
  !Bun.env.QSTASH_NEXT_SIGNING_KEY
)
  throw new Error("Server env var Error!");
// let apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();
// let apiKey = (apiInstance as any).authentications["apiKey"];
// apiKey.apiKey = Bun.env.BREVO_API_KEY;
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
      const content = JSON.parse(body as any);
      if (!content.verifyLink || !content.receiverEmail) throw new Error("server Error");

      const isValid = await r
        .verify({
          signature: headers["upstash-signature"],
          body: body as string,
          clockTolerance: 1,
        })
        .catch((e) => {
          console.log(e);
          throw new Error("Server Error!");
        });

      if (!isValid) throw new Error("Server Error!");

      const res = eta.render("verifyEmail.eta", {
        verifyLink: content.verifyLink,
      });
      const resend = new Resend(Bun.env.RESEND_API_KEY!);

      resend.emails.send({
        from: "automatic@partialty.com",
        to: content.receiverEmail,
        subject: "Verify Your Partialty Account",
        html: res,
      });

      // let sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail();
      // sendSmtpEmail.subject = "Verify Your Partialty Account";
      // sendSmtpEmail.htmlContent = res;
      // sendSmtpEmail.sender = { email: senderMail, name: senderName };
      // sendSmtpEmail.to = [{ email: content.receiverEmail }];
      // await apiInstance.sendTransacEmail(sendSmtpEmail).then(
      //   (data) => {
      //     console.log("Verification Email Sent Successfully. Returned data: " + data.body.messageId);
      //   },
      //   (error) => {
      //     throw new Error("Server Error! ", error);
      //   }
      // );

      return {
        statusCode: 200,
        body: "OK",
      };
    },
    {
      async parse(ctx) {
        return await ctx.request.text();
      },
      body: t.Not(t.Undefined()),
    }
  );
});

export default app;
