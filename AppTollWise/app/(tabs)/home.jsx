import { useState, useCallback } from "react";
import { useFocusEffect } from '@react-navigation/native';
import { ScrollView, Text, View, RefreshControl, Image, TouchableOpacity, Modal, Button } from 'react-native'
import { useVehicleContext } from '../contexts/VehicleContext';
import { SafeAreaView } from 'react-native-safe-area-context';
import axios from 'axios';
import { icons, images } from "../../constants";
import Header from "../../components/Header"
import CustomButton from '../../components/CustomButton';


const Home = () => {
    const { userData } = useVehicleContext();
    const [transactions, setTransactions] = useState({});
    const [walletBalance, setWalletBalance] = useState(0);
    const [refreshing, setRefreshing] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedTransaction, setSelectedTransaction] = useState(null);
    const data = userData;

    const getTransactionLogs = async () => {
        try {
            const response = await axios.post('http://192.168.29.202:3030/user/getTransactionLogs', {
                vehicleNumber: data.vehicleNumber
            });
            console.log('Transaction logs: ', response.data);
            setTransactions(response.data.transactions);
        } catch (error) {
            console.error('Error fetching transaction logs:', error);
        }
    };

    const getBalance = async () => {
        try {
            const response = await axios.post('http://192.168.29.202:3030/user/getWallet', {
                vehicleNumber: data.vehicleNumber
            });
            setWalletBalance(response.data.balance);
        } catch (error) {
            console.error('Error fetching balance:', error);
        }
    };

    const fetchData = async () => {
        if (data && data.vehicleNumber) {
            await getTransactionLogs();
            await getBalance();
        }
    };

    useFocusEffect(
        useCallback(() => {
            fetchData();
        }, [data])
    );

    const onRefresh = useCallback(async () => {
        setRefreshing(true);
        await fetchData();
        setRefreshing(false);
    }, [data]);

    const openModal = (transaction) => {
        setSelectedTransaction(transaction);
        setModalVisible(true);
    };

    const closeModal = () => {
        setSelectedTransaction(null);
        setModalVisible(false);
    };

    function rechargeRedirection() {

    }

    return (
        <SafeAreaView className="flex-1">
            {/*<Header />*/}
            <View className="flex flex-row justify-left pt-4 px-5">
                <View className="bg-black p-3 rounded-full"><Image
                    source={icons.profile}
                    resizeMode='contain'
                    className="w-6 h-6"
                /></View>
                <View>
                    <Text className="text-black text-sm font-plight px-2">Welcome,</Text>
                    <Text className="text-black text-lg font-pmedium px-2">{data.username}</Text>
                </View>
            </View>
            {walletBalance > 0 && (
                <View className="bg-[#161622] border-gray-400 mt-3 mx-5 p-4 text-white rounded-xl">
                    <Text className="text-2xl text-white font-pmedium">Wallet Balance</Text>
                    <Text className="text-5xl pt-3 text-[#FFA001]">₹ {walletBalance}</Text>

                    <View className="my-2 border-t border-gray-400"></View>

                    <TouchableOpacity className="bg-[#FFA001] p-2 rounded-lg items-center">
                        <Text className="text-white text-lg font-psemibold">Add Funds</Text>
                    </TouchableOpacity>
                </View>

            )}
            <ScrollView
                contentContainerStyle={{ flexGrow: 1 }}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                    />
                }
            >
                {transactions.length > 0 && (
                    <View className="w-full bg-gray-50 border-gray-400 mt-3 p-3 text-gray-800 rounded-xl">
                        {transactions.map((transaction, index) => (
                            <TouchableOpacity key={index} onPress={() => openModal(transaction)} className="mb-4 p-4 bg-white rounded-lg shadow-md">
                                <Text className="text-lg">Toll Paid: ₹ {transaction.tollPaid}</Text>
                                <Text className="text-md text-gray-400">Entry Time: {new Date(transaction.entry.time).toLocaleString()}</Text>
                                <Text className="text-md text-gray-400">Exit Time: {new Date(transaction.exit.time).toLocaleString()}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                )}
            </ScrollView>
            {selectedTransaction && (
                <Modal
                    visible={modalVisible}
                    animationType="slide"
                    transparent={true}
                    onRequestClose={closeModal}
                >
                    <View className="flex-1 justify-center items-center bg-black bg-opacity-50">
                        <View className="bg-white p-6 rounded-xl w-4/5">
                            <Text className="text-lg font-bold">Transaction Details</Text>
                            <Text className="mt-2">Vehicle Number: {selectedTransaction.vehicleNumber}</Text>
                            <Text className="mt-2">Customer ID: {selectedTransaction.customerId}</Text>
                            <Text className="mt-2">Toll Paid: ₹ {selectedTransaction.tollPaid}</Text>
                            <Text className="mt-2">Entry Location: {selectedTransaction.entry.location.type}</Text>
                            <Text className="mt-2">Entry Coordinates: {selectedTransaction.entry.location.coordinates.join(', ')}</Text>
                            <Text className="mt-2">Entry Time: {new Date(selectedTransaction.entry.time).toLocaleString()}</Text>
                            <Text className="mt-2">Exit Location: {selectedTransaction.exit.location.type}</Text>
                            <Text className="mt-2">Exit Coordinates: {selectedTransaction.exit.location.coordinates.join(', ')}</Text>
                            <Text className="mt-2">Exit Time: {new Date(selectedTransaction.exit.time).toLocaleString()}</Text>
                            <Button title="Close" onPress={closeModal} />
                        </View>
                    </View>
                </Modal>
            )}
        </SafeAreaView>
    )
}

export default Home
