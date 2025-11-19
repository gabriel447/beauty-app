import { useState } from 'react'
import { View, Text, TextInput, TouchableOpacity } from 'react-native'
import { useLocalSearchParams } from 'expo-router'

export default function ReserveScreen() {
  const params = useLocalSearchParams() as any
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [email, setEmail] = useState('')
  const startLabel = params.start ? new Date(params.start).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }) : ''
  const endLabel = params.end ? new Date(params.end).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }) : ''
  return (
    <View style={{ flex: 1, backgroundColor: '#ffffff', padding: 16 }}>
      <Text style={{ fontSize: 18, fontWeight: '600', marginBottom: 8 }}>Reserva</Text>
      <Text style={{ color: '#6b7280', marginBottom: 12 }}>das {startLabel} às {endLabel}</Text>
      <View style={{ marginBottom: 8 }}>
        <Text>Nome</Text>
        <TextInput value={name} onChangeText={setName} style={{ height: 36, borderWidth: 1, borderColor: '#e5e7eb', borderRadius: 8, paddingHorizontal: 10 }} />
      </View>
      <View style={{ marginBottom: 8 }}>
        <Text>Telefone</Text>
        <TextInput value={phone} onChangeText={setPhone} keyboardType="phone-pad" style={{ height: 36, borderWidth: 1, borderColor: '#e5e7eb', borderRadius: 8, paddingHorizontal: 10 }} />
      </View>
      <View style={{ marginBottom: 8 }}>
        <Text>Email</Text>
        <TextInput value={email} onChangeText={setEmail} keyboardType="email-address" style={{ height: 36, borderWidth: 1, borderColor: '#e5e7eb', borderRadius: 8, paddingHorizontal: 10 }} />
      </View>
      <TouchableOpacity style={{ marginTop: 12, paddingHorizontal: 16, paddingVertical: 12, backgroundColor: '#ec4899', borderRadius: 10 }}>
        <Text style={{ color: '#ffffff', fontWeight: '600', textAlign: 'center' }}>Marcar</Text>
      </TouchableOpacity>
    </View>
  )
}