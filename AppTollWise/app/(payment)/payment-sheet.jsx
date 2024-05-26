import { StripeProvider } from "@stripe/stripe-react-native";
import { useState, useEffect } from "react";
import { StyleSheet, Text, View, TextInput, Image, Alert } from 'react-native';
import { SafeAreaView } from "react-native-safe-area-context";
import { useStripe } from "@stripe/stripe-react-native";
import { useVehicleContext } from '../contexts/VehicleContext';
import CustomButton from '../../components/CustomButton';
import { icons, images } from "../../constants";
import { router } from "expo-router";
import { BASE_URL } from "@env"

const PaymentSheet = () => {
    const { userData } = useVehicleContext();
    const [walletBalance, setWalletBalance] = useState(0);
    const [amount, setAmount] = useState('');
    const stripe = useStripe();
    const vehicleNumber = userData.vehicleNumber;
    const [buttonPressed, setButtonPressed] = useState(false);

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
        console.log(value);
    };

    const handleAddFunds = async () => {
        try {
            console.log(amount);
            const response = await fetch(`${BASE_URL}/pay`, {
                method: "POST",
                body: JSON.stringify({ vehicleNumber, amount }),
                headers: {
                    "Content-Type": "application/json",
                },
            });
            console.log(amount);
            try {
                const response = await fetch(`${BASE_URL}/user/getBalance`, {
                    method: "POST",
                    body: JSON.stringify({ vehicleNumber, amount }),
                    headers: {
                        "Content-Type": "application/json",
                    },
                });
            } catch (err) {
                console.log(err);
            }

            const data = await response.json();
            if (!response.ok) return Alert.alert(data.message);
            console.log(data);
            const clientSecret = data.clientSecret;

            const initSheet = await stripe.initPaymentSheet({
                paymentIntentClientSecret: clientSecret,
                merchantDisplayName: 'Tejas',
            });
            console.log(initSheet);

            if (initSheet.error) return Alert.alert(initSheet.error.message);
            const presentSheet = await stripe.presentPaymentSheet({
                clientSecret,
            });
            if (presentSheet.error) return Alert.alert(presentSheet.error.message);
            Alert.alert("Payment complete, thank you!");
            router.replace('/home');
        } catch (err) {
            console.error(err);
            Alert.alert("Something went wrong, try again later!");
        }
    };

    useEffect(() => {
        getWalletBalance();
    }, []);

    useEffect(() => {
        if (buttonPressed) {
            handleAddFunds();
            setButtonPressed(false);
        }
    }, [buttonPressed]);

    return (
        <StripeProvider publishableKey="pk_test_51PJA8XSHMRG0ECv4nZN5KwwYE1ENXIOOw2S4OAR8T8NorSAAEhZRJijMDbxQVn5YxRFELkY1Nhqh3P4JPxddiuEX00BUclJ9G5">
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
                            handlePress={() => setButtonPressed(true)}
                            containerStyles="mt-7 px-4"
                        />
                    </View>
                </View>
            </SafeAreaView>
        </StripeProvider>
    );
}

export default PaymentSheet;

const styles = StyleSheet.create({});
