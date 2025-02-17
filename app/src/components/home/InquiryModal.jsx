import 'react-native-get-random-values'
import { Alert, Keyboard, KeyboardAvoidingView, Modal, Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useUserStore } from '../../service/userStore'
import { v4 as uuidv4 } from 'uuid'
import { inquiryStyles } from '../../styles/inquiryStyles'

const InquiryModal = ({ visible, onClose }) => {

    const { user, setUser } = useUserStore();
    const [name, setName] = useState('');
    const [profilePhotoUrl, setProfilePhotoUrl] = useState('');

    useEffect(() => {
        if (visible) {
            const storedName = user?.name;
            const storedProfilePhotoUrl = user?.photo;
            setName(storedName || "");
            setProfilePhotoUrl(storedProfilePhotoUrl || "");
        }
    }, [visible])

    const handleSave = () => {
        if (name && profilePhotoUrl) {
            setUser({
                id: uuidv4(),
                name,
                photo: profilePhotoUrl
            })
            onClose();
        } else {
            Alert.alert("Please fill in both details")
        }
    }

    return (
        <Modal
            visible={visible}
            animationType='slide'
            transparent={true}
            onRequestClose={onClose}
        >
            <TouchableWithoutFeedback onPress={Keyboard.dismiss()}>
                <View style={inquiryStyles.modalContainer}>
                    <KeyboardAvoidingView
                        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                        style={inquiryStyles.keyboardAvoidingView}
                    >
                        <ScrollView contentContainerStyle={inquiryStyles.scrollViewContent}>
                            <View style={inquiryStyles.modalContainer}>
                                <Text style={inquiryStyles.title} >Enter Your Details</Text>
                                <TextInput
                                    style={inquiryStyles.input}
                                    placeholder='Enter your name'
                                    value={name}
                                    placeholderTextColor={'#ccc'}
                                    onChangeText={setName}
                                />
                                <TextInput
                                    style={inquiryStyles.input}
                                    placeholder='Enter your profileUrl'
                                    value={profilePhotoUrl}
                                    placeholderTextColor={'#ccc'}
                                    onChangeText={setProfilePhotoUrl}
                                />

                                <View style={inquiryStyles.buttonContainer}>
                                    <TouchableOpacity style={inquiryStyles.button} onPress={handleSave}>
                                        <Text style={inquiryStyles.buttonText}>
                                            Save
                                        </Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity style={[inquiryStyles.button, inquiryStyles.cancelButton]} onPress={onClose}>
                                        <Text style={inquiryStyles.buttonText}>
                                            Cancel
                                        </Text>
                                    </TouchableOpacity>

                                </View>
                            </View>
                        </ScrollView>

                    </KeyboardAvoidingView>
                </View>
            </TouchableWithoutFeedback>

        </Modal>
    )
}

export default InquiryModal

const styles = StyleSheet.create({})