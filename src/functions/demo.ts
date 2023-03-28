import router from "next/router";

export const demodetails = {email: "demoemail@test.com", email_verified: true, given_name: "Demo", locale: "en", name: "DemoUser", nickname: "Demo",
picture: "https://lh3.googleusercontent.com/a/AGNmyxZAXDpNfoCMYVUV5bPaH43P1c4s3fAgKes1Xhg_ZA=s96-c", updated_at: "2023-03-17T23:18:13.828Z", sub: "google-oauth2|143087949221293105235", 
sid: "bE2PcyB07BnDBzrOPmoFwIN-ZznZcZn8"};


export function demologin () {
    void router.push( router.asPath + "?demo=true" );
}