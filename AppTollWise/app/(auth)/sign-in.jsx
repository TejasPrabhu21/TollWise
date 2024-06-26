
import { useState } from "react";
import { Link, router } from "expo-router";
import { Alert, Image, ScrollView, StyleSheet, Text, View } from 'react-native'
import axios from 'axios';
import CustomButton from '../../components/CustomButton';
import FormField from '../../components/FormField';
import { SafeAreaView } from 'react-native-safe-area-context'
import { images } from '../../constants'
import { useVehicleContext } from "../contexts/VehicleContext";
import { BASE_URL } from "@env"

const SignIn = () => {
    const { setUser, setVehicle } = useVehicleContext();

    const [form, setForm] = useState({
        vehicleNumber: '',
        password: ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const submit = async () => {

        console.log("Form data:")
        if (form.vehicleNumber === '' || form.password === '') {
            Alert.alert("Error", "Please fill in all fields");
            return;
        }

        setIsSubmitting(true);
        try {
            const response = await axios.post(`${BASE_URL}/user/login`, form, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            if (!response) {
                console.error('Login error:', error);
            }
            const vehicleNumber = response.data.userDetails.vehicleNumber;

            const responseData = await axios.post(`${BASE_URL}/user/getUserData`, { vehicleNumber });
            console.log("Login response fetch", responseData);

            if (response.data && responseData.data.userDetails !== undefined && responseData.data.vehicleDetails !== undefined) {
                console.log('Login successful:', response.data.userDetails);
                setUser(responseData.data.userDetails);
                setVehicle(responseData.data.vehicleDetails)
                router.push('/home');
            } else {
                Alert.alert("Error", "Login failed. Please check your credentials or try again later.");

            }
        } catch (error) {
            console.error('Login error:', error);
            Alert.alert("Error", "Login failed. Please check your credentials or try again later.");
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <SafeAreaView className="bg-primary h-full">
            <ScrollView>
                <View className="w-full justify-center min-h-[82vh] px-4 my-6">
                    <Image
                        source={images.tollwiseiconSmall}
                        resizeMode="contain"
                        className="w-[80px] h-[74px]"
                    />

                    <Text className="text-4xl font-semibold text-black mt-10 font-psemibold">
                        Sign In
                    </Text>


                    <FormField
                        title="Vehicle Number"
                        value={form.vehicleNumber}
                        handleChangeText={(e) => setForm({ ...form, vehicleNumber: e })}
                        otherStyles="mt-7"
                        keyboardType="email-address"
                        secureTextEntry={false}
                    />
                    <FormField
                        title="Password"
                        value={form.password}
                        handleChangeText={(e) => setForm({ ...form, password: e })}
                        otherStyles="mt-7"
                        secureTextEntry={true}
                    />


                    <CustomButton
                        title="Sign In"
                        handlePress={submit}
                        containerStyles="mt-7"
                        isLoading={isSubmitting}
                    />

                    <View className="flex justify-center pt-5 flex-row gap-2">
                        <Text className="text-lg text-gray-100 font-pregular">
                            Don't have an account?
                        </Text>
                        <Link
                            href="/sign-up"
                            className="text-lg font-psemibold text-secondary"
                        >
                            Signup
                        </Link>
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    )
}

export default SignIn

const styles = StyleSheet.create({})