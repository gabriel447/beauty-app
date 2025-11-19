import { Tabs, Stack } from 'expo-router'
import { useEffect } from 'react'
import { SafeAreaView } from 'react-native'

export default function RootLayout() {
  useEffect(() => {}, [])
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Stack screenOptions={{ headerTitleAlign: 'left' }}>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="professionals/[id]" options={{ title: 'Profissional' }} />
        <Stack.Screen name="reserve/index" options={{ title: 'Reserva' }} />
      </Stack>
    </SafeAreaView>
  )
}