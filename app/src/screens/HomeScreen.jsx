import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { homeStyles } from '../styles/homeStyles'
import HomeHeader from '../components/home/HomeHeader'

const HomeScreen = () => {
  return (
    <View style={homeStyles.container}>
      <HomeHeader />
    </View>
  )
}

export default HomeScreen

const styles = StyleSheet.create({})