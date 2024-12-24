import { ON_TRANSCRIPT } from "@/contstant/transcribeEventConstant";
import { io } from "socket.io-client";

export class TranscribedService {
    io = null;
    audioStream = null;
    socket = null;

    constructor(query) {
        this.io = io(`${process.env.NEXT_PUBLIC_API_URL}/transcribe`, {
            query: query
        });



        this.onConnect = this.onConnect.bind(this);

        this.io.on('connect', this.onConnect);
        this.io.on('close', this.onClose);
        this.io.on('message', this.onMessage);
    }


    onConnect() {
        this.sendAudioStream();
        console.log('connected to transcribe service.');
    }

    onClose() {
        console.log('transcribe service closed.');
    }

    onMessage(data) {
        console.log(`Recieved message from transcribe service: ${data}`);
    }

    close() {
        this.io.disconnect();
    }

    async getAudioStream() {
        if (this.audioStream) {

            return this.audioStream;
        }

        if (typeof window !== 'undefined') {
            try {
                this.audioStream = await navigator.mediaDevices.getUserMedia({
                    audio: true
                });
                return this.audioStream;
            } catch (error) {
                throw new Error("Permission Denied");
            }

        }

    }

    sendAudioStream() {
        this.getAudioStream().then(stream => {
            const mediaRecorder = new MediaRecorder(stream, {
                mimeType: 'audio/webm',
            })
            this.socket = new WebSocket(`wss://api.deepgram.com/v1/listen?model=nova-2-phonecall&language=en`, [
                'token',
                process.env.NEXT_PUBLIC_DEEPGRAM_API_KEY,
            ])
            this.socket.onopen = () => {
                console.log({ event: 'onopen' })
                mediaRecorder.addEventListener('dataavailable', async (event) => {
                    if (event.data.size > 0 && this.socket.readyState == 1) {
                        this.socket.send(event.data)
                    }
                });
                mediaRecorder.start(1000);
            }

            this.socket.onmessage = (message) => {
                const received = JSON.parse(message.data)
                const transcript = received.channel.alternatives[0].transcript
                if (transcript && received.is_final) {
                    const data = {
                        text: transcript
                    }
                    this.io.emit(ON_TRANSCRIPT,data);
                }
            }

            this.socket.onclose = () => {
                console.log({ event: 'onclose' })
            }

            this.socket.onerror = (error) => {
                console.log({ event: 'onerror', error })
            }
        }).catch(err => console.log(err.message));
    }



    handlemute(value){
        this.audioStream.getAudioTracks().forEach(track => {
            track.enabled = !value;
        });
    }


    disconnect(){
        this.socket.close();
        this.io.disconnect();
    }
}