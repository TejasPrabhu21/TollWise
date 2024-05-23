import { StyleSheet, Text, View, Image } from 'react-native'
import { images } from "../constants";

const Header = () => {
    return (
        <View className="bg-white px-4 py-2 flex flex-row items-center">
            <Image
                source={images.tollwiselogo}
                resizeMode='contain'
                className="w-8 h-8"
            />
            <Text className="pt-2 text-[#161622] text-3xl font-psemibold ml-2">TollWise</Text>
        </View>
    )
}

export default Header

const styles = StyleSheet.create({})