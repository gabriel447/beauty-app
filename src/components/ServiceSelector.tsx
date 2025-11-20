import { useEffect, useState } from 'react'
import { View, Text, TouchableOpacity, FlatList, TextInput } from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { supabase } from '@/lib/supabase'
import { Service } from '@/types'

type Props = {
  value: Service | null
  onChange: (service: Service) => void
  showSearch?: boolean
  showFavoriteIcon?: boolean
  showPrice?: boolean
  fullWidth?: boolean
  allowedNames?: string[]
}

export default function ServiceSelector({ value, onChange, showSearch = true, showFavoriteIcon = true, showPrice = true, fullWidth = false, allowedNames }: Props) {
  const [services, setServices] = useState<Service[]>([])
  const [query, setQuery] = useState('')
  const [favorites, setFavorites] = useState<Set<string>>(new Set())
  const formatBRL = (cents: number) => {
    const value = cents / 100
    return `R$ ${value.toFixed(2).replace('.', ',')}`
  }
  useEffect(() => {
    const load = async () => {
      const { data } = await supabase.from('services').select('*').order('name')
      setServices(data || [])
    }
    load()
  }, [])
  useEffect(() => {
    const loadFavs = async () => {
      try {
        const raw = await AsyncStorage.getItem('favorites_services')
        const arr: string[] = raw ? JSON.parse(raw) : []
        setFavorites(new Set(arr.map(String)))
      } catch {}
    }
    loadFavs()
  }, [])
  const items = services
    .filter((s) => !allowedNames || allowedNames.includes(s.name))
    .filter((s) => s.name.toLowerCase().includes(query.toLowerCase()))
    .sort((a, b) => {
      const fa = favorites.has(String(a.id)) ? 0 : 1
      const fb = favorites.has(String(b.id)) ? 0 : 1
      if (fa !== fb) return fa - fb
      return a.name.localeCompare(b.name)
    })
  const containerWidth = fullWidth ? '100%' : '92%'
  return (
    <View style={{ alignItems: 'center' }}>
      {showSearch && (
        <View style={{ width: containerWidth, paddingTop: 8, paddingBottom: 8 }}>
          <TextInput
            value={query}
            onChangeText={setQuery}
            placeholder="Buscar"
            style={{ height: 36, paddingHorizontal: 12, borderWidth: 1, borderColor: '#e5e7eb', borderRadius: 8, backgroundColor: '#ffffff', fontSize: 14 }}
          />
        </View>
      )}
      <FlatList
        data={items}
        keyExtractor={(s) => String(s.id)}
        keyboardShouldPersistTaps="handled"
        style={{ width: containerWidth, maxHeight: 440 }}
        contentContainerStyle={{ paddingBottom: 28 }}
        showsVerticalScrollIndicator
        renderItem={({ item }) => (
          <TouchableOpacity
            style={{ paddingVertical: 16, paddingLeft: 12, paddingRight: 12, borderBottomWidth: 1, borderBottomColor: '#e5e7eb', backgroundColor: value?.id === item.id ? '#fde7f3' : '#ffffff' }}
            onPress={() => onChange(item)}
          >
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              {showFavoriteIcon && (
                <Text style={{ marginRight: 8, color: favorites.has(String(item.id)) ? '#f59e0b' : '#9ca3af' }}>★</Text>
              )}
              <Text
                style={{ fontSize: 15, fontWeight: '600', flex: 1, flexShrink: 1, marginRight: 8 }}
                numberOfLines={1}
                ellipsizeMode="tail"
              >
                {item.name}
              </Text>
              {showPrice && (
                <Text style={{ textAlign: 'right', fontSize: 15, fontWeight: '600', color: '#9ca3af' }}>{formatBRL(item.price_cents)}</Text>
              )}
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  )
}