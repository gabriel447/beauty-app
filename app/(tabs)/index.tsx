import { Link } from 'expo-router'
import { View, Text, TouchableOpacity, Image } from 'react-native'

export default function Home() {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#ffffff', paddingHorizontal: 16 }}>
      <Image source={require('../../imgs/2149319785.jpg')} style={{ width: '100%', height: 220, borderRadius: 12, marginBottom: 16 }} />
      <Text style={{ fontSize: 24, fontWeight: '600' }}>Beauty App</Text>
      <Text style={{ color: '#4b5563', marginTop: 8, textAlign: 'center' }}>Agende serviços com facilidade</Text>
      <Link href={{ pathname: '/booking' }} asChild>
        <TouchableOpacity style={{ marginTop: 24, paddingHorizontal: 16, paddingVertical: 12, backgroundColor: '#ec4899', borderRadius: 12 }}>
          <Text style={{ color: '#ffffff' }}>Agendar agora</Text>
        </TouchableOpacity>
      </Link>
    </View>
  )
}