import { useState } from "react";
import { Link, useNavigation } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { View, Text, ScrollView, Dimensions, Alert, Image, ActivityIndicator } from "react-native";

import { images } from "../../constants";
import { icons } from "../../constants";
import CustomButton from '../../components/CustomButton';
import FormField from '../../components/FormField';
// import { useGlobalContext } from "../../context/GlobalProvider";
import axios from 'axios';
import { BASE_URL } from "@env"

const SignUp = () => {
    // const { setUser, setIsLogged } = useGlobalContext();
    const navigation = useNavigation();
    const [isSubmitting, setSubmitting] = useState(false);
    const [vehicleNumber, setVehicleNumber] = useState("");
    const [details, setDetails] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    const submit = async () => {
        try {
            setSubmitting(true);
            const response = await axios.post(`${BASE_URL}/user/vehicle`, {
                registrationNumber: vehicleNumber,
            });
            console.log(response.data);
            setVehicleNumber("");
            setDetails(response.data);
        } catch (error) {
            console.error("Error submitting data:", error);
            Alert.alert("Error", "Failed to submit data. Please try again.");
        } finally {
            setSubmitting(false);
        }

    };

    const confirm = async () => {
        try {
            setIsLoading(true);
            // Send a signal to the server to send OTP
            const response = await axios.post(`${BASE_URL}/user/send-otp`, {
                phoneNumber: details.PhoneNumber,
            });
            console.log("OTP sent successfully:", response.data);

            // Navigate to OTP page
            navigation.navigate('otp-page', { details });
        } catch (error) {
            console.error("Error sending OTP:", error);
            Alert.alert("Error", "Failed to send OTP. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <SafeAreaView className="bg-primary h-full">
            <ScrollView>
                <View
                    className="w-full flex justify-center min-h-[83vh] px-4 my-6"
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
                        Sign Up
                    </Text>

                    <FormField
                        title="Enter your vehicle number: "
                        value={vehicleNumber}
                        handleChangeText={(value) => setVehicleNumber(value)}
                        otherStyles="mt-7"
                    />

                    {details && <View className="w-full bg-gray-50 border-gray-400 mt-3 p-3 font-pregular">
                        {Object.entries(details).map(([key, value]) => (
                            <View key={key}>
                                <Text className="font-pregular text-md mt-2 text-gray-400">
                                    {key}:
                                </Text>
                                <Text className="font-pregular text-lg ">
                                    {value}
                                </Text>
                            </View>
                        ))}
                        <Text className="text-xs text-gray-400 mt-2">
                            <Image
                                source={icons.info}
                                resizeMode="contain"
                                className="w-[15px] h-[15px] opacity-40"
                            />
                            {' '}If the details are correct, click on Confirm to continue.</Text>
                    </View>

                    }

                    {isLoading &&
                        <ActivityIndicator size="large" color="#0000ff" style={{ marginTop: 20 }} />
                    }
                    {details ? <CustomButton
                        title="Confirm"
                        handlePress={confirm}
                        containerStyles="mt-7"
                        isLoading={isSubmitting}
                    /> :
                        <CustomButton
                            title="Continue"
                            handlePress={submit}
                            containerStyles="mt-7"
                            isLoading={isSubmitting}
                        />}

                    <View className="flex justify-center pt-5 flex-row gap-2">
                        <Text className="text-lg text-gray-100 font-pregular">
                            Have an account already?
                        </Text>
                        <Link
                            href="/sign-in"
                            className="text-lg font-psemibold text-secondary"
                        >
                            Login
                        </Link>
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

export default SignUp;