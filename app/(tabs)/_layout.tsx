import { Tabs } from 'expo-router'
import { View, Text } from 'react-native'

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerTitleAlign: 'left',
        tabBarActiveTintColor: '#ec4899',
        tabBarInactiveTintColor: '#9ca3af',
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Início',
          tabBarIcon: ({ focused }) => (
            <View style={{ width: 16, height: 16, borderRadius: 8, backgroundColor: focused ? '#f9a8d4' : '#fce7f3' }} />
          ),
        }}
      />
      <Tabs.Screen
        name="profiles"
        options={{
          title: 'Profissionais',
          tabBarIcon: ({ focused }) => (
            <View style={{ width: 16, height: 16, borderRadius: 8, backgroundColor: focused ? '#f9a8d4' : '#fce7f3' }} />
          ),
        }}
      />
      <Tabs.Screen
        name="services"
        options={{
          title: 'Serviços',
          tabBarIcon: ({ focused }) => (
            <View style={{ width: 16, height: 16, borderRadius: 8, backgroundColor: focused ? '#f9a8d4' : '#fce7f3' }} />
          ),
        }}
      />
      <Tabs.Screen
        name="agenda"
        options={{
          title: 'Agenda',
          tabBarIcon: ({ focused }) => (
            <View style={{ width: 16, height: 16, borderRadius: 8, backgroundColor: focused ? '#f9a8d4' : '#fce7f3' }} />
          ),
        }}
      />
    </Tabs>
  )
}