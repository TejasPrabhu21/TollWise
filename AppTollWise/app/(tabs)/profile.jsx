import { useState } from 'react';
import { ScrollView, Image, StyleSheet, Text, View } from 'react-native'
import { useVehicleContext } from '../contexts/VehicleContext';
import { SafeAreaView } from 'react-native-safe-area-context';
import Header from "../../components/Header"
import CustomButton from '../../components/CustomButton';
import { BASE_URL } from "@env"

const getInitials = (name) => {
    if (!name) {
        return "";
    }
    const words = name.split(" ");
    let inital = "";

    for (let i = 0; i < Math.min(words.length, 2); i++) {
        inital += words[i][0];
    }

    return inital.toUpperCase();
}

const profile = () => {
    const { userData, vehicleData } = useVehicleContext();

    const [isSubmitting, setIsSubmitting] = useState(false);

    const data = userData;
    console.log('User data: ', data);
    console.log('\n\nVehicle data:', vehicleData);

    return (
        <SafeAreaView className="flex-1 bg-white">
            <View className="px-4">
                <Header />
            </View>
            <ScrollView className="flex-1 p-4">
                <Text className="text-2xl font-bold mb-4 text-center">Profile</Text>
                {data && (
                    <View className="items-center">
                        <View className="items-center mb-4">
                            <View className="w-20 h-20 rounded-full bg-gray-300 justify-center items-center mb-2">
                                <Text className="text-3xl text-white">{getInitials(data.username)}</Text>
                            </View>
                            <Text className="text-xl font-bold">{data.username}</Text>
                        </View>
                        <View className="w-full p-4 bg-gray-100 rounded-lg mt-4">
                            <Text className="text-base text-gray-600">Phone Number:</Text>
                            <Text className="text-lg font-bold mb-4">{data.phoneNumber}</Text>
                            <Text className="text-base text-gray-600">Vehicle Number:</Text>
                            <Text className="text-lg font-bold mb-4">{data.vehicleNumber}</Text>
                        </View>
                        {vehicleData && (
                            <View className="w-full p-4 bg-gray-100 rounded-lg mt-4">
                                <Text className="text-base text-gray-600">Registration Number:</Text>
                                <Text className="text-lg font-bold mb-4">{vehicleData.RegistrationNumber}</Text>
                                <Text className="text-base text-gray-600">Registration Date:</Text>
                                <Text className="text-lg font-bold mb-4">{new Date(vehicleData.RegistrationDate).toLocaleDateString()}</Text>
                                <Text className="text-base text-gray-600">Chasis Number:</Text>
                                <Text className="text-lg font-bold mb-4">{vehicleData.ChasisNumber}</Text>
                                <Text className="text-base text-gray-600">Engine Number:</Text>
                                <Text className="text-lg font-bold mb-4">{vehicleData.EngineNumber}</Text>
                                <Text className="text-base text-gray-600">Vehicle Type:</Text>
                                <Text className="text-lg font-bold mb-4">{vehicleData.VehicleType}</Text>
                                <Text className="text-base text-gray-600">Owner Name:</Text>
                                <Text className="text-lg font-bold mb-4">{vehicleData.OwnerName}</Text>
                                <Text className="text-base text-gray-600">Phone Number:</Text>
                                <Text className="text-lg font-bold mb-4">{vehicleData.PhoneNumber}</Text>
                            </View>
                        )}
                        {/*<CustomButton
                            title="Recharge"
                            handlePress={rechargeRedirection}
                            containerStyles="mt-7"
                            isLoading={isSubmitting}
                    />*/}
                    </View>
                )}
            </ScrollView>
        </SafeAreaView>
    )
}

export default profile

const styles = StyleSheet.create({})