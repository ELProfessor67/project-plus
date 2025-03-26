"use client"
import { useState, useEffect, useCallback, useRef } from "react";
import { Device } from "@twilio/voice-sdk";
import { createTwilioToken } from "@/lib/http/twilio";
import TwilioCallComponent from "@/components/TwilioCallComponent";
import { DialerPad } from "@/components/DialerPad";
import { BadgeHelp, Clock, CodeXml, FileJson, FileText, Import, Mail, MessageSquare, MoreVertical, PlusCircle, Rows4, Save, Table, UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuSubContent,
    DropdownMenuTrigger,
    DropdownMenuPortal,
    DropdownMenuSubTrigger,
    DropdownMenuSub
} from "@/components/ui/dropdown-menu";
import Papa from "papaparse";
import ContactList from "@/components/ContactList";
import { Input } from "@/components/ui/input";
import CallHistoryComponent from "@/components/CallHistoryComponent";

export default function Phone() {
    const [device, setDevice] = useState(null);
    const [toNumber, setToNumber] = useState("+918279741233");
    const [fromNumber, setFromNumber] = useState("");
    const [status, setStatus] = useState("");
    const [connection, setConnection] = useState(null);
    const [accepted, setAccepted] = useState(false);
    const [isReady, setIsReady] = useState(false);
    const [callInfo, setCallInfo] = useState({});
    const [callOpen, setCallOpen] = useState(false);
    const [isMuted, setIsMuted] = useState(false);
    const [isInComingCall, setIsInComingCall] = useState(false);
    const [callTimer, setCallTimer] = useState(0);
    const [activeTab, setActiveTab] = useState("dialer")
    const [contact, setContact] = useState([]);
    const [history, setCallHistory] = useState([]);

    //incoming,processing,ringing
    const [controllView, setControllView] = useState(null);

    const timerRef = useRef(null);


    const startTimer = () => {
        setCallTimer(0);
        if (timerRef.current) clearInterval(timerRef.current);
        timerRef.current = setInterval(() => {
            setCallTimer((prevTime) => prevTime + 1);
        }, 1000);
    };

    const formatTime = (seconds) => {
        const minutes = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${minutes}:${secs.toString().padStart(2, "0")}`;
    };


    const stopTimer = () => {
        clearInterval(timerRef.current);
    };


    const getToken = async () => {
        try {
            const res = await createTwilioToken({});
            const { token, from } = res.data;
            const twilioDevice = new Device(token, { debug: true, region: "us1", closeProtection: true });


            twilioDevice.on("ready", () => {
                console.log("Twilio Device Ready");
                setIsReady(true);
            });

            // Handle incoming calls
            twilioDevice.on("incoming", (connection) => {
                console.log("Incoming call detected", connection);
                setConnection(connection);
                const number = connection.parameters.From;
                //check name - pending
                setCallInfo({ number });
                setCallOpen(true);
                setIsInComingCall(true);
                setControllView('incoming')
            });

            // Handle call connection
            twilioDevice.on("connect", (conn) => {
                console.log("Call Connected:", conn);
            });

            // Handle call disconnection
            twilioDevice.on("disconnect", () => {
                console.log("Call Disconnected");
                setConnection(null);
                setControllView(null);
                stopTimer();
            });

            setDevice(twilioDevice);
            setFromNumber(from);

        } catch (error) {
            console.log(error.message);
        }
    }
    useEffect(() => {
        getToken()
    }, []);

    const makeCall = async (name,number) => {
        if (!device || !number) return alert("Device not ready or number missing");


        const connection = await device.connect({
            params: { To: number, From: fromNumber }
        });

        setStatus("Ringing...");
        setConnection(connection);
        setCallInfo({ number,name });
        setCallOpen(true);
        setControllView('ringing');

        setCallHistory(prev => [...prev, { type: "outgoing", number,name, date: Date.now() }]);


        connection.on("accept", () => {
            setControllView('processing');
            setStatus("Accepted");
            startTimer();
        });

        connection.on("disconnect", () => {
            setStatus("Hanp Up");
            setTimeout(() => {
                setIsInComingCall(false);
                setCallOpen(false)
                setConnection(null);
                setCallInfo({});
                setControllView(null);
            }, 600);
            stopTimer()
        });
        connection.on("error", (err) => setStatus(`Error: ${err.message}`));
    };



    const answerCall = useCallback(() => {
        if (connection) {
            connection.accept();
            setIsInComingCall(false);
            setControllView('processing')
            console.log("Call Answered");
            startTimer();
        }
    }, [connection]);

    const rejectCall = useCallback(() => {
        if (connection) {
            connection.reject();
            setAccepted(false);
            setConnection(null);
            setIsInComingCall(false);
            setCallInfo({});
            setControllView(null)
            console.log("Call Rejected");
            stopTimer()
        }
    }, [connection]);


    const toggleMute = useCallback(() => {
        if (connection) {
            const newMuteState = !isMuted;
            connection.mute(newMuteState);
            setIsMuted(newMuteState);
            console.log(newMuteState ? "Muted" : "Unmuted");
        }
    }, [connection, isMuted]);

    // 🔴 Hangup Call
    const hangupCall = useCallback(() => {
        if (connection) {
            connection.disconnect();
            setIsInComingCall(false);
            setCallOpen(false)
            setConnection(null);
            setCallInfo({});
            setControllView(null);
            stopTimer();
        }
    }, [connection]);



    //upload contact
    const handleFileUpload = (event) => {
        const file = event.target.files[0];

        if (!file) return;

        const reader = new FileReader();

        reader.onload = ({ target }) => {
            Papa.parse(target.result, {
                header: true, // Convert CSV to JSON
                skipEmptyLines: true,
                complete: (result) => {
                    setContact(result.data);
                    setActiveTab("contact")
                    console.log("Parsed Data: ", result.data);
                },
            });
        };

        reader.readAsText(file);
    }

    const MoreOption = () => (
        <DropdownMenu>
            <DropdownMenuTrigger asChild className='hover:bg-transparent'>

                <MoreVertical size={20} />

            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56 mr-2 mt-2">
                <DropdownMenuGroup>
                    <DropdownMenuItem className="cursor-pointer">
                        <Save />
                        <span className='text-black/70'>New Contact</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem className="cursor-pointer">
                        <Clock />
                        <span className='text-black/70'>Call History</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem className="cursor-pointer">
                        <BadgeHelp />
                        <span className='text-black/70'>Help And Feedback</span>
                    </DropdownMenuItem>
                    <DropdownMenuSub>
                        <DropdownMenuSubTrigger>
                            <Import />
                            <span>Import Contact</span>
                        </DropdownMenuSubTrigger>
                        <DropdownMenuPortal>
                            <DropdownMenuSubContent>
                                <label htmlFor="contactFile">

                                    <DropdownMenuItem>

                                        <Table />
                                        <span>Import As CSV</span>
                                    </DropdownMenuItem>
                                </label>
                                <DropdownMenuItem >
                                    <Rows4 />
                                    <span>Import As Excel</span>
                                </DropdownMenuItem>
                                <DropdownMenuItem >
                                    <FileJson />
                                    <span>Import As JSON</span>
                                </DropdownMenuItem>
                                <DropdownMenuItem >
                                    <CodeXml />
                                    <span>Import As XML</span>
                                </DropdownMenuItem>
                            </DropdownMenuSubContent>
                        </DropdownMenuPortal>
                    </DropdownMenuSub>
                </DropdownMenuGroup>
            </DropdownMenuContent>
        </DropdownMenu>
    )
    return (
        <>

            <input type="file" id="contactFile" hidden onChange={handleFileUpload} accept=".csv" />
            <div className="flex h-screen flex-col bg-white m-2 rounded-md overflow-y-auto relative">
                <div className="bg-gray-200 rounded-md shadow-inner  m-2 flex items-center p-[1px]">
                    <Button variant="ghost" className={`flex-1 ${activeTab == "dialer" ? "bg-white" : ""}`} onClick={() => setActiveTab("dialer")}>
                        Dialer
                    </Button>
                    <Button variant="ghost" className={`flex-1  ${activeTab == "contact" ? "bg-white" : ""}`} onClick={() => setActiveTab("contact")}>
                        Contact
                    </Button>
                </div>


                {
                    activeTab == "dialer" &&
                    <div className="flex flex-col gap-4 p-6 h-full relative">
                        <div className="flex items-center justify-end">
                            <MoreOption />
                        </div>
                        <div className="flex flex-col h-full">
                            {
                                history.length == 0 &&
                                <div className="flex-1 flex items-center justify-center">
                                    <h1 className="text-2xl">No Call History</h1>
                                </div>
                            }

                            {
                                history.length != 0 &&
                                <div className="flex-1 overflow-y-auto">
                                    <CallHistoryComponent history={history}/>
                                </div>
                            }
                            <DialerPad phoneNumber={toNumber} setPhoneNumber={setToNumber} handleCall={() => makeCall(undefined,toNumber)} />
                        </div>
                    </div>
                }



                {
                    activeTab == "contact" &&
                    <div className='mx-2 my-4 px-5'>
                        <div className="flex items-center gap-8">
                            <Input className='py-2 w-full px-2 ring-0 outline-none bg-gray-50 shadow-sm rounded-3xl focus:ring-0 flex-1' placeholder='Search Contact' />
                            <MoreOption />
                        </div>

                        <ContactList contact={contact} makeCall={makeCall} setToNumber={setToNumber} setCallInfo={setCallInfo} />
                    </div>
                }
            </div>
            {
                callOpen &&
                <TwilioCallComponent accepted={accepted} timer={formatTime(callTimer)} controllView={controllView} status={status} callInfo={callInfo} isIncoming={isInComingCall} hangupCall={hangupCall} toggleMute={toggleMute} isMuted={isMuted} rejectCall={rejectCall} answerCall={answerCall} />
            }
        </>

    );
}
