import { Alert } from "react-native"
import { BASE_URL } from "../config"
import axios from 'axios';

export const createSession = async () => {
    try {
        const res = await axios.post(`${BASE_URL}/create-session`);
        return res?.data?.sessionId;
    } catch (error) {
        console.log("SESSION CREATE ERROR", error)
        Alert.alert('There was an error')
        return null
    }
}

export const checkSession = async (id) => {
    try {
        const res = await axios.get(`${BASE_URL}/is-alive?sessionId=${id}`);
        return res?.data?.isAlive
    } catch (error) {
        console.log("SESSION GET ERROR", error)
        Alert.alert('There was an error')
        return false
    }
}