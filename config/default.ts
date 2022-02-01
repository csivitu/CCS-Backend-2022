import "dotenv/config";

export default {
  port: Number(process.env.PORT),
  dbUri: process.env.DB_CONNECTION,
  enviornment: process.env.ENVIORNMENT,
  saltWorkFactor: Number(process.env.SALT_FACTOR),
  accessTokenPrivateKey: process.env.AT_PRIVATE_KEY,
  accessTokenPublicKey: `-----BEGIN PUBLIC KEY-----
MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQCB264Zo58vK/YZd4gmtn+GmpQm
jLlrdQVTW3pO9T6Mlgrk4iKTLXQenlwdGhEcyxKjTpOL44I7QjlM/eeDGHNmni4x
dZc1CC/EWEcH6QtBlhDZXdjl3NSgf5AR+F+RHY2CcgcltHgtbk3LRWD1L+44z+6V
8lORtYMpemFaySG5bQIDAQAB
-----END PUBLIC KEY-----`,
  accessTokenTtl: process.env.AT_TTL,
  refreshTokenPrivateKey: process.env.RT_PRIVATE_KEY,
  refreshTokenPublicKey: `-----BEGIN PUBLIC KEY-----
MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQCeriRdqc0lw2avlRD6EfqZCYGz
NIfvF8ZjK7vRyUeoNdxtgTRTgehrZxmF24A6yoibdLhyPp42kVR8Rwm7Nb6V2A4Z
RKFTmnwHce1nU4vIGwLXrFuXdoT6kKY89lSaUUVgtSAhtLD74FNo210f3EINk/zO
f7nAWWlOhIzawxMKZwIDAQAB
-----END PUBLIC KEY-----`,
  refreshTokenTtl: process.env.RT_TTL,
  emailer_api_key: process.env.EMAILER_API_KEY,
  verify_link: process.env.VERIFY_LINK,
  reset_link: process.env.RESET_LINK,
  number_of_questions: 10,
  test_duration: 60,
  mailgun_api_key: process.env.MAILGUN_API_KEY,
  email_domain: process.env.EMAIL_DOMAIN,
  mailgun_host: process.env.MAILGUN_HOST,
  sender_email: process.env.SENDER_EMAIL,
  taskSubmissionDate: process.env.TASK_SUBMISSION_DATE,
  email_verified_redirect: "http://localhost:3000/login",
};
