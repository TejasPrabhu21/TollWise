import { useState, useEffect } from "react";
import { StyleSheet, Text, View, TextInput, Image } from 'react-native'
import { SafeAreaView } from "react-native-safe-area-context";
import { useVehicleContext } from '../contexts/VehicleContext';
import CustomButton from '../../components/CustomButton';
import FormField from '../../components/FormField';
import { icons } from "../../constants";
import { images } from "../../constants";

const PaymentSheet = () => {
    const { userData } = useVehicleContext();
    const [walletBalance, setWalletBalance] = useState(0);
    const [amount, setAmount] = useState('');

    const getWalletBalance = () => {
        const balance = userData?.balance || 0;
        setWalletBalance(balance);

        if (balance < 0) {
            setAmount(Math.abs(balance) + 50); // If balance is negative, add the deficit + 50
        } else if (balance === 0) {
            setAmount(50); // If balance is 0, set amount to 50
        }
    };

    const handleChangeText = (value) => {
        setAmount(value);
    };

    const handleAddFunds = () => {

    };

    useEffect(() => {
        getWalletBalance();
    }, []);

    return (
        <SafeAreaView className="bg-primary h-full">
            <View className="flex flex-row justify-left pt-4 px-5">
                <View className="bg-black p-3 rounded-full"><Image
                    source={icons.profile}
                    resizeMode='contain'
                    className="w-6 h-6"
                /></View>
                <View>

                    <Text className="text-black text-2xl font-pmedium px-2 pt-2 justify-center">{userData.username}</Text>
                </View>
            </View>

            <View className="flex-1 justify-center items-center px-4">
                <Image
                    source={images.tollwiselogo}
                    resizeMode='contain'
                    className="w-10 h-10"
                />
                <Text className="text-xl mb-4">Payment</Text>
                <Text className="text-xl mb-4">Add funds to your E-Wallet</Text>
                <View className="w-full items-center">
                    <View className="w-60 px-4 border-gray-100 flex flex-row items-center justify-center">
                        <TextInput
                            className="flex-1 text-gray-700 font-pregular text-5xl border-b border-gray-300 text-center"
                            value={amount.toString()}
                            onChangeText={handleChangeText}
                            keyboardType="numeric"
                            placeholder="00"
                        />
                    </View>
                    <CustomButton
                        title="Add Funds"
                        handlePress={handleAddFunds}
                        containerStyles="mt-7 px-4"
                    />
                </View>
            </View>
        </SafeAreaView>

    )
}

export default PaymentSheet

const styles = StyleSheet.create({})