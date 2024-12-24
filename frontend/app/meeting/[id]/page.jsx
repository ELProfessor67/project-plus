'use client'
import { useUser } from '@/providers/UserProvider'
import Loader from '@/components/Loader';
import { useRouter } from 'next/navigation';
import React, { use, useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'
import { JitsiMeeting } from "@jitsi/react-sdk"
import { getMeetingByIdRequest } from '@/lib/http/meeting';
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';
import { TranscribedService } from '@/services/transcribeService';



const YOUR_DOMAIN = "meet.hgsingalong.com"
const page = ({ params }) => {
  const { user, isAuth, isLoading } = useUser();
  const meetingDetailsRef = useRef(null);
  const [muted, setMuted] = useState();
  const router = useRouter();
  const transcribeService = useRef(null);
  const [isJoined, setIsJoined] = useState(false);




  useLayoutEffect(() => {
    if (isAuth == false) {
      const url = window.location.href;
      router.push(`/sign-in?next_to=${url}`);
    }
  }, [user, isAuth]);


  const getMeeting = useCallback(async () => {
    try {
      const res = await getMeetingByIdRequest(params.id);
      meetingDetailsRef.current = res.data.meeting;
    } catch (error) {
      router.push(`/`);
      console.log(error.message);
    }
  }, [params.id]);

  useEffect(() => {
    getMeeting();
  }, []);


  const confirmAdmit = useCallback((username, handleReject) => {
    confirmAlert({
      title: `${username} Join`,
      message: `${username} want to join this meet.`,
      buttons: [
        {
          label: 'Admit',
        },
        {
          label: 'Reject',
          onClick: () => handleReject()
        }
      ]
    });
  }, []);



  //when user joined meet then we start the transcibtion
  useEffect(() => {
    if (!isJoined) {
      return;
    }
    transcribeService.current = new TranscribedService({ meeting_id: params.id, user_id: user?.user_id });
    return () => {
      transcribeService.current.close();
    }
  }, [isJoined]);


  useEffect(() => {
    if (isJoined && transcribeService.current) {
      transcribeService.current.handlemute(muted);
    }
  }, [muted]);




  if (isLoading) {
    return <>
      <Loader />
    </>
  }

  return (
    <div style={{ height: "100vh", display: 'grid', flexDirection: "column" }}>
      <JitsiMeeting
        domain={YOUR_DOMAIN}
        roomName={params.id}
        userInfo={{
          displayName: user?.name,
          email: user?.email
        }}

        interfaceConfigOverwrite={{
          SHOW_JITSI_WATERMARK: false,
          SHOW_WATERMARK_FOR_GUESTS: false,
        }}

        onApiReady={(externalApi) => {

          externalApi.addListener('participantJoined', (ParticipantDetails) => {
            console.log("Participant Joined Event Fired:", ParticipantDetails);
            if (meetingDetailsRef.current?.user_id == user?.user_id) {
              const handleReject = () => {
                externalApi.executeCommand('kickParticipant', ParticipantDetails.id)
              }
              confirmAdmit(ParticipantDetails?.formattedDisplayName?.split(' ')[0], handleReject);
            }
          });


          externalApi.addListener('videoConferenceJoined', (event) => {
            setIsJoined(true);
          });



          externalApi.addListener("videoConferenceLeft", () => {
            transcribeService.current.disconnect();
            router.push("/dashboard");
          });


          externalApi.addListener('audioMuteStatusChanged', (p) => {
            setMuted(p.muted);
          });
        }}

        configOverwrite={{
          inviteUrl: `${process.env.NEXT_PUBLIC_BASE_URL}/meeting/${params.id}`,
        }}
      />
    </div>
  )
}

export default page