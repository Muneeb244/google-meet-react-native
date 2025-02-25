import { SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useUserStore } from '../../service/userStore';
import { headerStyles } from '../../styles/headerStyles';
import { RFValue } from 'react-native-responsive-fontsize';
import { Colors } from '../../utils/Constants';
import { CircleUser, Menu } from 'lucide-react-native'
import { navigate } from '../../utils/NavigationUtils';
import InquiryModal from './InquiryModal';

const HomeHeader = () => {

  const [visible, setVisible] = useState(false);
  const { user } = useUserStore();

  useEffect(() => {
    const checkUserName = () => {
      const storedName = user?.name;
      if (!storedName) {
        setVisible(true);
      }
    }

    checkUserName();
  }, [])

  const handleNavigation = () => {
    const storedName = user?.name;
    if (!storedName) {
      return setVisible(true);
    }
    navigate('JoinMeetScreen')
  }

  return (
    <>
      <SafeAreaView />
      <View style={headerStyles.container}>
        <Menu size={RFValue(20)} color={Colors.text} />
        <TouchableOpacity style={headerStyles.textContainer} onPress={handleNavigation}>
          <Text style={headerStyles.placeholderText}>
            Enter a meeting code
          </Text>
        </TouchableOpacity>
        <CircleUser
          onPress={() => setVisible(true)}
          size={RFValue(20)}
          color={Colors.primary}
        />
      </View>


      <InquiryModal visible={visible} onClose={() => setVisible(false)} />
    </>
  )
}

export default HomeHeader