import twilio from "twilio"
import "dotenv/config"


export const generateToken = async (twilioFromNumber) => {
    try {
        const AccessToken = twilio.jwt.AccessToken;
        const VoiceGrant = AccessToken.VoiceGrant;

        const twilioAccountSid = process.env.TWILIO_ACCOUNT_SID;
        const twilioApiKey = process.env.TWILIO_API_KEY;
        const twilioApiSecret = process.env.TWILIO_API_SECRET;

        const outgoingApplicationSid = process.env.TWILIO_TWIML_APP_SID;
        const identity = 'user';


        const voiceGrant = new VoiceGrant({
            outgoingApplicationSid: outgoingApplicationSid,
            incomingAllow: true,
        });


        const token = new AccessToken(
            twilioAccountSid,
            twilioApiKey,
            twilioApiSecret,
            { identity: identity }
        );
        token.addGrant(voiceGrant);

        return {token: token.toJwt(), from: twilioFromNumber};

    } catch (error) {
        console.log(error)
        return null;
    }
}