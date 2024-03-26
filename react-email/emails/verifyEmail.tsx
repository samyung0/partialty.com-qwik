/** @jsxImportSource react */

import {
  Body,
  Column,
  Container,
  Font,
  Head,
  Heading,
  Html,
  Img,
  Link,
  Preview,
  Row,
  Section,
  Tailwind,
  Text,
} from '@react-email/components';

export const AirbnbReviewEmail = ({ verifyLink }: { verifyLink: string }) => {
  return (
    <Html>
      <Head>
        <Font
          fontFamily="Varela Round"
          fallbackFontFamily="sans-serif"
          webFont={{
            url: 'https://fonts.gstatic.com/s/varelaround/v20/w8gdH283Tvk__Lua32TysjIfpcuPP9g.woff2',
            format: 'woff2',
          }}
          fontWeight={400}
          fontStyle="normal"
        />
      </Head>
      <Preview>
        Verify your Email Address to make your account more secure and link your account with other Google or Github
        accounts.
      </Preview>

      <Tailwind>
        <Body className="m-0 p-0 text-[#1f2937]">
          <Section className="max-h-[100vh] min-h-[100vh] overflow-auto bg-[#6fdcbf] py-[100px]">
            <Container className="rounded-2xl bg-[#1f2937] p-10">
              <Row>
                <Heading className="pb-5 text-3xl font-bold tracking-wide text-[#f7f7f7]">Partialty.com</Heading>
              </Row>
              <Row>
                <Container className="rounded-2xl bg-[#f7f7f7] p-8">
                  <Row className="py-12">
                    <Column align="center">
                      <Link href={verifyLink}>
                        <Img
                          src="https://res.cloudinary.com/dhthx6tn6/image/upload/v1705394184/emailTemplates/mail-outline_sqmt9c.png"
                          alt="Mail"
                          width="100"
                          height="100"
                        ></Img>
                        <Text className="mt-2 inline-block rounded-xl bg-[#fcd34d] px-8 py-2 text-lg font-bold tracking-wide text-[#1f2937]">
                          Verify Email Address
                        </Text>
                      </Link>
                    </Column>
                  </Row>
                  <Row>
                    <Column>
                      <Text className="text-xl font-bold tracking-wide">Congratulations!</Text>
                      <Text className="inline tracking-wide">
                        Looks like you have successfully created a new account. To secure your account and
                      </Text>
                      <Text className="inline border-b-4 border-l-0 border-r-0 border-t-0 border-solid border-[#ae8fdb] tracking-wide">
                        {' '}
                        connect your other google or github accounts
                      </Text>
                      <Text className="inline tracking-wide">
                        , please verify your account by clicking on the link above.
                      </Text>
                    </Column>
                  </Row>
                </Container>
                <Row className="pt-12">
                  <Column className="text-[#f7f7f7]">
                    <Text className="text-xs">This is an automatically generated email. Please do not reply.</Text>
                    <Text className="text-xs">Copyright © 2024 Partialty</Text>
                  </Column>
                </Row>
              </Row>
            </Container>
          </Section>
        </Body>
      </Tailwind>
    </Html>
  );
};

export default AirbnbReviewEmail;

// const main = {
//   backgroundColor: "#ffffff",
//   fontFamily:
//     '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif',
//   background: "#6fdcbf",
//   minHeight: "100vh",
// };

const titleText = {
  color: '#f7f7f7',
  fontSize: '36px',
  fontWeight: 'bold',
  padding: '12px',
};

const outerContainer = {
  background: '#1f2937',
  padding: '24px',
  borderRadius: '24px',
  width: '50%',
  paddingBottom: '36px',
};

const container = {
  background: '#f7f7f7',
  borderRadius: '24px',
  padding: '24px',
};

const verifyButton = {
  background: '#1f2937',
  padding: '12px 24px',
  borderRadius: '12px',
  color: '#f7f7f7',
  letterSpacing: '2px',
};
