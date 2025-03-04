import { useRef, useState } from "react";
import { useLiveMeetStore } from "../service/meetStore";
import { useUserStore } from "../service/userStore";
import { useWS } from "../service/api/WSProvider";
import { mediaDevices, MediaStream, RTCPeerConnection } from 'react-native-webrtc'
import { peerConstraints } from "../utils/Helpers";
import { G } from "react-native-svg";

export const useWebRTC = () => {
    const { participants, setStreamURL, removeParticipant, updateParticipant, addParticipant, sessionId, addSessionId, toggle, clear, micOn, videoOn } = useLiveMeetStore();
    const { user } = useUserStore();

    const [localStream, setLocalStream] = useState(null);
    const { emit, no, off } = useWS();
    const peerConnections = useRef(new Map());
    const pendingCandidates = useRef(new Map());

    const startLocalStream = async () => {
        try {
            const mediaStreams = await mediaDevices.getUserMedia({
                audio: true,
                video: true,
            })
        } catch (error) {
            console.log("Error starting local stream", error)
        }
    }

    const establishPeerConnection = async () => {
        participants?.forEach(async streamUser => {
            if (!peerConnections.current.has(streamUser?.userId)) {
                const peerConnection = new RTCPeerConnection(peerConstraints);
                peerConnections.current.set(streamUser?.userId, peerConnection)

                peerConnection.onTrack = event => {
                    const remoteStream = new MediaStream();
                    event.streams[0].getTracks().forEach(track => {
                        remoteStream.addTrack(track)
                    })
                    console.log("RECEIVING REMOTE STREAM", remoteStream.toURL());
                    setStreamURL(streamUser?.userId, remoteStream)
                }

                peerConnection.onicecandidate = ({ candidate }) => {
                    if (candidate) {
                        emit('send-ice-candidate', {
                            sessionId,
                            sender: user?.id,
                            receiver: streamUser?.userId,
                            candidate,
                        })
                    }
                };

                localStream?.getTracks().forEach(track => {
                    peerConnection.addTrack(track, localStream);
                });

                try {
                    const offerDescription = await peerConnection.createOffer();
                    await peerConnection.setLocalDescription(offerDescription);
                    emit('send-offer', {
                        sessionId,
                        sender: user?.id,
                        receiver: streamUser?.userId,
                        offer: offerDescription
                    })
                } catch (error) {
                    console.log("Error creating or sending offer", error)
                }
            }
        });
    }

    const joingStream = async () => {
        await establishPeerConnection();
    }

    return {
        localStream,
        participants,
        toggleMic,
        toggleVideo,
        switchCamera,
    }
}