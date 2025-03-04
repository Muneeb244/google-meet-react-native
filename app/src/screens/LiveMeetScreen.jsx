import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { useContainerDimensions } from '../hooks/useContainerDimensions'
import { useWebRTC } from '../hooks/useWebRTC';
import UserView from '../components/meet/UserView';

const LiveMeetScreen = () => {

  const { containerDimensions, onContianerLayout } = useContainerDimensions();
  const { localStream, participants, switchCamera, toggleMic, toggleVideo } = useWebRTC();

  return (
    <View style={styles.Container}>
      <MeetHeader switchCamera={switchCamera} />

      <View style={styles.peopleContainer} onLayout={onContianerLayout}>
        {
          containerDimensions && localStream && (
            <UserView
              localStream={localStream}
              containerDimensions={containerDimensions}
            />
          )
        }
      </View>
    </View>
  )
}

export default LiveMeetScreen

const styles = StyleSheet.create({
  Container: {
    flex: 1,
    backgroundColor: '#121212'
  },
  peopleContainer: {
    flex: 1,
  }
})