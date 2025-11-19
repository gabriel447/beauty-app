import { Link } from 'expo-router'
import { View, Text, Image, TouchableOpacity } from 'react-native'
import { useEffect, useState } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { Professional } from '@/types'

type Props = { professional: Professional, onPress?: () => void, showFavorite?: boolean }

export default function ProfessionalCard({ professional, onPress, showFavorite = true }: Props) {
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
    onPress ? (
      <TouchableOpacity onPress={onPress} style={{ flexDirection: 'row', alignItems: 'center', padding: 12, borderBottomWidth: 1, borderBottomColor: '#f3f4f6' }}>
        {showFavorite && (
          <TouchableOpacity onPress={toggleFavorite} style={{ marginRight: 10 }}>
            <View style={{ width: 20, height: 20, borderRadius: 10, alignItems: 'center', justifyContent: 'center', backgroundColor: favorite ? '#fef3c7' : '#f3f4f6' }}>
              <Text style={{ color: favorite ? '#f59e0b' : '#9ca3af', fontSize: 12 }}>★</Text>
            </View>
          </TouchableOpacity>
        )}
        {!showFavorite && (
          <Text style={{ marginRight: 10, color: favorite ? '#f59e0b' : '#9ca3af', fontSize: 12 }}>★</Text>
        )}
        {professional.avatar_url ? (
          <Image source={typeof professional.avatar_url === 'number' ? professional.avatar_url : { uri: professional.avatar_url }} style={{ width: 40, height: 40, borderRadius: 20, marginRight: 10 }} />
        ) : (
          <View style={{ width: 40, height: 40, borderRadius: 20, marginRight: 10, backgroundColor: '#e5e7eb' }} />
        )}
        <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>
          <Text style={{ fontSize: 14, fontWeight: '500' }} numberOfLines={1} ellipsizeMode="tail">{professional.name}</Text>
        </View>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <View style={{ paddingHorizontal: 6, paddingVertical: 2, backgroundColor: '#fde7f3', borderRadius: 6 }}>
            <Text style={{ color: '#ec4899', fontSize: 12 }}>★ {(professional.rating ?? 0)}</Text>
          </View>
          
          
        </View>
      </TouchableOpacity>
    ) : (
      <Link href={{ pathname: `/professionals/${professional.id}` }} asChild>
        <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center', padding: 12, borderBottomWidth: 1, borderBottomColor: '#f3f4f6' }}>
          {showFavorite && (
            <TouchableOpacity onPress={toggleFavorite} style={{ marginRight: 10 }}>
              <View style={{ width: 20, height: 20, borderRadius: 10, alignItems: 'center', justifyContent: 'center', backgroundColor: favorite ? '#fef3c7' : '#f3f4f6' }}>
                <Text style={{ color: favorite ? '#f59e0b' : '#9ca3af', fontSize: 12 }}>★</Text>
              </View>
            </TouchableOpacity>
          )}
          {!showFavorite && (
            <Text style={{ marginRight: 10, color: favorite ? '#f59e0b' : '#9ca3af', fontSize: 12 }}>★</Text>
          )}
          {professional.avatar_url ? (
            <Image source={typeof professional.avatar_url === 'number' ? professional.avatar_url : { uri: professional.avatar_url }} style={{ width: 40, height: 40, borderRadius: 20, marginRight: 10 }} />
          ) : (
            <View style={{ width: 40, height: 40, borderRadius: 20, marginRight: 10, backgroundColor: '#e5e7eb' }} />
          )}
          <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>
            <Text style={{ fontSize: 14, fontWeight: '500' }} numberOfLines={1} ellipsizeMode="tail">{professional.name}</Text>
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <View style={{ paddingHorizontal: 6, paddingVertical: 2, backgroundColor: '#fde7f3', borderRadius: 6 }}>
              <Text style={{ color: '#ec4899', fontSize: 12 }}>★ {(professional.rating ?? 0)}</Text>
            </View>
            
            
          </View>
        </TouchableOpacity>
      </Link>
    )
  )
}