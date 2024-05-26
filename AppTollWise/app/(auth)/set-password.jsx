import { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Image, ScrollView, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useVehicleContext } from '../contexts/VehicleContext';
import CustomButton from '../../components/CustomButton';
import FormField from '../../components/FormField';
import Header from "../../components/Header";
import { images } from "../../constants";
import { router } from "expo-router";
import { BASE_URL } from "@env"

const SetPassword = () => {
    const { userData } = useVehicleContext();
    const vehicleNumber = userData.vehicleNumber;

    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [confirmPasswordError, setConfirmPasswordError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const validatePassword = (password) => {
        if (password.length < 6) {
            return "Password must be at least 6 characters long.";
        }
        return null;
    };

    const validateConfirmPassword = (password, confirmPassword) => {
        if (password !== confirmPassword) {
            return "Passwords do not match.";
        }
        return null;
    };

    const handlePasswordChange = (value) => {
        setPassword(value);
        const error = validatePassword(value);
        setPasswordError(error);
    };

    const handleConfirmPasswordChange = (value) => {
        setConfirmPassword(value);
        const error = validateConfirmPassword(password, value);
        setConfirmPasswordError(error);
    };

    const handleSubmit = async () => {
        const passwordValidationError = validatePassword(password);
        const confirmPasswordValidationError = validateConfirmPassword(password, confirmPassword);

        if (passwordValidationError || confirmPasswordValidationError) {
            setPasswordError(passwordValidationError);
            setConfirmPasswordError(confirmPasswordValidationError);
            return;
        }

        setIsSubmitting(true);

        try {
            const response = await fetch(`${BASE_URL}/user/updatepassword`, {
                method: "POST",
                body: JSON.stringify({ vehicleNumber, password }),
                headers: {
                    "Content-Type": "application/json",
                },
            });

            const data = await response.json();
            if (!response.ok) {
                setIsSubmitting(false);
                return Alert.alert("Error", data.message);
            }

            router.replace('/payment-sheet');
        } catch (err) {
            console.error(err);
            Alert.alert("Error", "Something went wrong, try again later!");
        }

        setIsSubmitting(false);
    };

    return (
        <SafeAreaView className="bg-primary h-full">
            <ScrollView>
                <View className="w-full flex  min-h-[83vh] px-4 my-6"
                    style={{
                        minHeight: Dimensions.get("window").height - 100,
                    }}>
                    <Header />
                    <Text className="text-4xl font-semibold text-black mt-10 font-psemibold ">
                        Set Password
                    </Text>
                    <View className="w-full mb-4">

                        <FormField
                            title="New Password"
                            value={password}
                            handleChangeText={handlePasswordChange}
                            otherStyles="mt-7"
                            placeholder="Password"
                            secureTextEntry={true}
                        />
                        {passwordError && <Text className="text-red-500">{passwordError}</Text>}
                    </View>
                    <View className="w-full mb-4">
                        <FormField
                            title="Confirm Password"
                            value={confirmPassword}
                            handleChangeText={handleConfirmPasswordChange}
                            otherStyles="mt-7"
                            placeholder="Confirm Password"
                            secureTextEntry={true}
                        />
                        {confirmPasswordError && <Text className="text-red-500">{confirmPasswordError}</Text>}
                    </View>
                    <CustomButton
                        title="Set Password"
                        handlePress={handleSubmit}
                        containerStyles="mt-7 w-full"
                        isLoading={isSubmitting}
                    />
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

export default SetPassword;

const styles = StyleSheet.create({});
