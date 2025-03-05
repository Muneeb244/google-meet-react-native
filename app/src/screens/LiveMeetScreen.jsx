import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { useContainerDimensions } from '../hooks/useContainerDimensions'
import { useWebRTC } from '../hooks/useWebRTC';
import UserView from '../components/meet/UserView';
import People from '../components/meet/People';
import NoUserInvite from '../components/meet/NoUserInvite';
import MeetFooter from '../components/meet/MeetFooter';
import MeetHeader from '../components/meet/MeetHeader';
import { peopleData } from '../utils/dummyData';

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
          )}

        {
          peopleData?.length > 0 ? (
            <People
              people={peopleData}
              containerDimensions={containerDimensions}
            />
          ) : (
            <NoUserInvite />
          )
        }
        
      </View>
      <MeetFooter toggleMic={toggleMic} toggleVideo={toggleVideo} />
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