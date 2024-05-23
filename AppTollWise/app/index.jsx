import { StatusBar } from 'expo-status-bar';
import { ScrollView, Text, View, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';

import { images } from '../constants';
import CustomButton from '../components/CustomButton';

export default function App() {
    return (
        <SafeAreaView className="bg-primary h-full">
            <ScrollView
                contentContainerStyle={{
                    height: "100%",
                }}
            >
                <View className="w-full flex justify-center items-center min-h-[85vh] px-4">
                    <Image
                        source={images.tollwiseicon}
                        className="max-w-[380px] w-full h-[298px]"
                        resizeMode="contain"
                    />

                    <View className="relative mt-5">
                        <Text className="text-3xl text-black font-bold text-center">
                            Welcome to {"\n"}
                            GPS-Based Toll Collection App{" "}
                            <Text className="text-secondary-200">Tollwise</Text>
                        </Text>

                        <Image
                            source={images.path}
                            className="w-[136px] h-[15px] absolute -bottom-2 right-12"
                            resizeMode="contain"
                        />
                    </View>

                    <Text className="text-sm font-pregular text-black-200 mt-7 text-center">
                        Travel hassle-free with seamless toll payments. Say goodbye to queues and delays at toll booths. Let's get started!"
                    </Text>

                    <CustomButton
                        title="Get Started"
                        handlePress={() => router.push("/sign-in")}
                        containerStyles="w-full mt-7"
                    />
                </View>
            </ScrollView>

            <StatusBar backgroundColor='#161622' style='light' />
        </SafeAreaView>
    );
}

