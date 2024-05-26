import { useState } from "react";
import { Link, useNavigation, router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { View, Text, ScrollView, Dimensions, Alert, Image, ActivityIndicator } from "react-native";

import { images } from "../../constants";
import { icons } from "../../constants";
import CustomButton from '../../components/CustomButton';
import FormField from '../../components/FormField';
import { useVehicleContext } from "../contexts/VehicleContext";
import { useRoute } from '@react-navigation/native';
import axios from 'axios';
import { StripeProvider } from "@stripe/stripe-react-native";
import { BASE_URL } from "@env"

const OTP = () => {
    const route = useRoute();
    const { details } = route.params;
    const navigation = useNavigation();
    const { setUser, setVehicle } = useVehicleContext();
    const [OTP, setOTP] = useState("");
    const [isSubmitting, setSubmitting] = useState(false);

    const confirm = async () => {
        try {
            setSubmitting(true);
            const response = await axios.post(`${BASE_URL}/user/verify-otp`, {
                otp: OTP,
                phoneNumber: details.PhoneNumber,
            });
            const responseData = await axios.post(`${BASE_URL}/user/getUserData`, { vehicleNumber: details.RegistrationNumber });
            console.log('\n\nResponse Data:', response.data);
            if (response.data.success) {
                // Add vehicle data to global context or create a session
                console.log('\n\nRouter params:', route.params);
                // setVehicle(route.params.details);
                setUser(responseData.data.userDetails);
                setVehicle(responseData.data.vehicleDetails)
                router.replace('/set-password');
            } else {
                Alert.alert("Error", "Failed to verify OTP. Please try again.");
            }
        } catch (error) {
            console.error("Error verifying OTP:", error);
            Alert.alert("Error", "Failed to verify OTP. Please try again.");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <SafeAreaView className="bg-primary h-full">
            <ScrollView>
                <View
                    className="w-full flex  min-h-[83vh] px-4 my-6"
                    style={{
                        minHeight: Dimensions.get("window").height - 100,
                    }}
                >
                    <Image
                        source={images.tollwiseiconSmall}
                        resizeMode="contain"
                        className="w-[80px] h-[74px]"
                    />

                    <Text className="text-4xl font-semibold text-black mt-10 font-psemibold">
                        Verify OTP
                    </Text>

                    <FormField
                        title="OTP has been sent to your registered phone number: "
                        value={OTP}
                        handleChangeText={(value) => setOTP(value)}
                        otherStyles="mt-7"
                        keyboardType="numeric"
                        secureTextEntry={false}
                    />

                    <CustomButton
                        title="Confirm"
                        handlePress={confirm}
                        containerStyles="mt-7"
                        isLoading={isSubmitting}
                    />
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

export default OTP
