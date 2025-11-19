import { Link } from 'expo-router'
import { View, Text, Image, TouchableOpacity } from 'react-native'
import { useEffect, useState } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { Professional } from '@/types'

type Props = { professional: Professional }

export default function ProfessionalCard({ professional }: Props) {
  const [favorite, setFavorite] = useState<boolean>(false)

  useEffect(() => {
    const load = async () => {
      try {
        const raw = await AsyncStorage.getItem('favorites_professionals')
        const arr: string[] = raw ? JSON.parse(raw) : []
        setFavorite(arr.includes(String(professional.id)))
      } catch {}
    }
    load()
  }, [professional.id])

  const toggleFavorite = async () => {
    try {
      const raw = await AsyncStorage.getItem('favorites_professionals')
      const arr: string[] = raw ? JSON.parse(raw) : []
      const set = new Set(arr)
      const id = String(professional.id)
      set.has(id) ? set.delete(id) : set.add(id)
      await AsyncStorage.setItem('favorites_professionals', JSON.stringify(Array.from(set)))
      setFavorite((v) => !v)
    } catch {}
  }
  return (
    <Link href={{ pathname: `/professionals/${professional.id}` }} asChild>
      <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center', padding: 16, borderBottomWidth: 1, borderBottomColor: '#f3f4f6' }}>
        {professional.avatar_url ? (
          <Image source={typeof professional.avatar_url === 'number' ? professional.avatar_url : { uri: professional.avatar_url }} style={{ width: 48, height: 48, borderRadius: 24, marginRight: 12 }} />
        ) : (
          <View style={{ width: 48, height: 48, borderRadius: 24, marginRight: 12, backgroundColor: '#e5e7eb' }} />
        )}
        <View style={{ flex: 1 }}>
          <Text style={{ fontSize: 16, fontWeight: '500' }}>{professional.name}</Text>
        </View>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <View style={{ paddingHorizontal: 8, paddingVertical: 4, backgroundColor: '#fde7f3', borderRadius: 6 }}>
            <Text style={{ color: '#be185d' }}>{professional.rating ?? 0}★</Text>
          </View>
          <TouchableOpacity onPress={toggleFavorite} style={{ marginLeft: 8 }}>
            <View style={{ width: 24, height: 24, borderRadius: 12, alignItems: 'center', justifyContent: 'center', backgroundColor: favorite ? '#fef3c7' : '#f3f4f6' }}>
              <Text style={{ color: favorite ? '#f59e0b' : '#9ca3af' }}>★</Text>
            </View>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    </Link>
  )
}