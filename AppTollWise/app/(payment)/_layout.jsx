import { StyleSheet, Text, View } from 'react-native'
import React, { Component } from 'react'
import { Stack } from 'expo-router'
import { StatusBar } from 'expo-status-bar';

const PaymentLayout = () => {
    return (
        <>
            <Stack>
                <Stack.Screen
                    name='payment-sheet'
                    options={{ headerShown: false }}
                />
            </Stack>
            <StatusBar backgroundColor='#161622' style='light' />
        </>
    )
}

export default PaymentLayout

const styles = StyleSheet.create({})