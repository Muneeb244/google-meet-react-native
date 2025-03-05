import { useEffect, useRef, useState } from "react";
import { useLiveMeetStore } from "../service/meetStore";
import { useUserStore } from "../service/userStore";
import { useWS } from "../service/api/WSProvider";
import { mediaDevices, MediaStream, RTCIceCandidate, RTCPeerConnection, RTCSessionDescription } from 'react-native-webrtc'
import { peerConstraints } from "../utils/Helpers";

export const useWebRTC = () => {
    const { participants, setStreamURL, removeParticipant, updateParticipant, addParticipant, sessionId, addSessionId, toggle, clear, micOn, videoOn } = useLiveMeetStore();
    const { user } = useUserStore();

    const [localStream, setLocalStream] = useState(null);
    const { emit, on, off } = useWS();
    const peerConnections = useRef(new Map());
    const pendingCandidates = useRef(new Map());

    const startLocalStream = async () => {
        try {
            const mediaStreams = await mediaDevices.getUserMedia({
                audio: true,
                video: true,
            });
            setLocalStream(mediaStreams);
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

    useEffect(() => {
        if (localStream) {
            joingStream();
        }
    }, [localStream])

    useEffect(() => {
        startLocalStream();
        if (localStream) {
            return () => localStream?.getTracks()?.forEach(track => track.stop())
        }
    }, [])

    useEffect(() => {
        if (localStream) {
            on('receive-ice-candidate', handleReceiveCandidate);
            on('receive-offer', handleReceiveOffer);
            on('receive-answer', handleReceiveAnswer);
            on('new-participant', handleNewParticipant);
            on('participant-left', handleParticipantLeft);
            on('participant-update', handleParticipantUpdate);

            return () => {
                localStream?.getTracks?.forEach(tracks => tracks.stop());
                peerConnections.current.forEach(pc => pc.close());
                peerConnections.current.clear();
                addSessionId(null);
                clear();
                emit('hang-up');
                off('receive-ice-candidate');
                off('receive-offer');
                off('receive-answer');
                off('new-participant');
                off('participant-left');
                off('participant-update');

            }
        }
    }, [localStream])

    const handleNewParticipant = participant => {
        if (participant?.userId === user?.id) {
            addParticipant(participant);
        }
    }

    const handleReceiveOffer = async ({ sender, receiver, offer }) => {
        if (receiver !== user?.id) return;

        try {
            let peerConnection = peerConnections.current.get(sender);
            if (!peerConnection) {
                peerConnection = new RTCPeerConnection(peerConstraints);
                peerConnection.current.set(sender, peerConnection);

                peerConnection.ontrack = event => {
                    const remoteStream = new MediaStream();
                    event.streams[0].getTracks()?.forEach(track => {
                        remoteStream.addTrack(track);
                        console.log("Receiving remote STREAM", remoteStream.toURL());
                    });

                    setStreamURL(sender, remoteStream)
                };

                peerConnection.onicecandidate = ({ candidate }) => {
                    if (candidate) {
                        emit('emit-ice-candidate', {
                            sessionId,
                            sender: receiver,
                            receiver: sender,
                            candidate
                        })
                    }
                };

                if (peerConnections.current.has(sender)) {
                    pendingCandidates.current.get(sender).forEach(candidate => {
                        peerConnection.addIceCandidate(new RTCIceCandidate(candidate))
                    });
                    pendingCandidates.current.delete(sender);
                }

                if (localStream) {
                    localStream.getTracks().forEach(track => {
                        peerConnection.addTrack(track, localStream)
                    })
                }
            }

            await peerConnection.setRemoteDescription(
                new RTCSessionDescription(offer)
            );

            const answer = await peerConnection.createAnswer();
            await peerConnection.setLocalDescription(answer);

            emit('send-answer', {
                sessionId,
                sender: receiver,
                receiver: sender,
                answer
            });

        } catch (error) {
            console.log("Error receiving offer", error)
        }
    }

    const handleReceiveAnswer = async ({ sender, receiver, answer }) => {
        if (receiver !== user?.id) return;

        const peerConnection = peerConnections.current.get(sender);
        if (peerConnection) {
            await peerConnection.setRemoteDescription(new RTCSessionDescription(answer));
        }

    }

    const handleReceiveCandidate = async ({sender, receiver}) => {
        if(receiver !== user?.id) return;

        const peerConnection = peerConnections.current.get(sender);
        if(peerConnection) {
            peerConnection.addIceCandidate(new RTCIceCandidate(candidate));
        } else {
            if(!pendingCandidates.current.has(sender)) {
                pendingCandidates?.current?.set(sender, [])
            }
            pendingCandidates.current.get(sender).push(candidate);
        }
    }

    const handleParticipantLeft = async userId => {
        removeParticipant(userId);
        const pc = peerConnections.current.get(userId);
        if(pc) {
            pc.close(),
            peerConnections.current.delete(userId);
        }
    }

    const handleParticipantUpdate = updatedParticipant => {
        updateParticipant(updatedParticipant);
    }

    const toggleMic = () => {
        if(localStream) {
            localStream?.getAudioTracks().forEach(track => {
                micOn ? (track.enabled=false) : (track.enabled=true);
            })
        }

        toggle('mic');
        emit('toggle-mute', {
            sessionId,
            userId: user?.id,
        })
    }
    
    const toggleVideo = () => {
        if(localStream) {
            localStream?.getVideoTracks().forEach(track => {
                videoOn ? (track.enabled=false) : (track.enabled=true);
            })
        }

        toggle('video');
        emit('toggle-video', {
            sessionId,
            userId: user?.id,
        })
    }
    
    
    const switchCamera = () => {
        if(localStream) {
            localStream?.getVideoTracks().forEach(track => {
                track._switchCamera();
            })
        }
    }

    return {
        localStream,
        participants,
        toggleMic,
        toggleVideo,
        switchCamera,
    }
}