import { Tabs } from 'expo-router'
import { View, Image } from 'react-native'

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerTitleAlign: 'left',
        headerStyle: { backgroundColor: '#ffffff', height: 52 },
        headerShadowVisible: true,
        headerTitleStyle: { fontSize: 20, fontWeight: '600', color: '#111827' },
        headerTitleContainerStyle: { paddingLeft: 16 },
        headerRightContainerStyle: { paddingRight: 16 },
        headerTintColor: '#111827',
        tabBarActiveTintColor: '#ec4899',
        tabBarInactiveTintColor: '#9ca3af',
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          headerShown: false,
          title: 'Início',
          headerTitleStyle: { fontSize: 18 },
          tabBarIcon: ({ focused }) => (
            <View style={{ width: 16, height: 16, borderRadius: 8, backgroundColor: focused ? '#f9a8d4' : '#fce7f3' }} />
          ),
        }}
      />
      <Tabs.Screen
        name="profiles"
        options={{
          headerShown: true,
          title: 'Profissionais',
          headerTitleStyle: { fontSize: 18 },
          tabBarIcon: ({ focused }) => (
            <View style={{ width: 16, height: 16, borderRadius: 8, backgroundColor: focused ? '#f9a8d4' : '#fce7f3' }} />
          ),
        }}
      />
      <Tabs.Screen
        name="services"
        options={{
          headerShown: true,
          title: 'Serviços',
          tabBarIcon: ({ focused }) => (
            <View style={{ width: 16, height: 16, borderRadius: 8, backgroundColor: focused ? '#f9a8d4' : '#fce7f3' }} />
          ),
        }}
      />
      <Tabs.Screen
        name="agenda"
        options={{
          headerShown: true,
          title: 'Agenda',
          tabBarIcon: ({ focused }) => (
            <View style={{ width: 16, height: 16, borderRadius: 8, backgroundColor: focused ? '#f9a8d4' : '#fce7f3' }} />
          ),
        }}
      />
    </Tabs>
  )
}