import { useEffect, useState } from 'react'
import { View, Text, FlatList, TouchableOpacity } from 'react-native'
import { services as demoServices } from '@/lib/demoData'
import { Service } from '@/types'
import AsyncStorage from '@react-native-async-storage/async-storage'

export default function ServicesTab() {
  const [allServices, setAllServices] = useState<Service[]>([])
  const [favorites, setFavorites] = useState<Set<string>>(new Set())
  useEffect(() => {
    setAllServices(demoServices as any)
  }, [])

  useEffect(() => {
    const loadFav = async () => {
      try {
        const raw = await AsyncStorage.getItem('favorites_services')
        const arr: string[] = raw ? JSON.parse(raw) : []
        setFavorites(new Set(arr.map(String)))
      } catch {}
    }
    loadFav()
  }, [])

  const toggleFavorite = async (id: string | number) => {
    try {
      const raw = await AsyncStorage.getItem('favorites_services')
      const arr: string[] = raw ? JSON.parse(raw) : []
      const set = new Set(arr.map(String))
      const key = String(id)
      set.has(key) ? set.delete(key) : set.add(key)
      const next = Array.from(set)
      await AsyncStorage.setItem('favorites_services', JSON.stringify(next))
      setFavorites(new Set(next))
    } catch {}
  }
  const balloonTags = new Set(['popular', 'novo', 'promocao'])
  const services = [...allServices].sort((a, b) => {
    const balA = (a.tags || []).some((t) => balloonTags.has(t)) ? 0 : 1
    const balB = (b.tags || []).some((t) => balloonTags.has(t)) ? 0 : 1
    if (balA !== balB) return balA - balB
    return a.name.localeCompare(b.name)
  })
  const displayTagById: Record<string, 'popular' | 'novo' | 'promocao' | null> = {}
  services.forEach((s, i) => {
    const d = i === 0 ? 'popular' : i === 1 ? 'novo' : i === 2 ? 'promocao' : null
    displayTagById[String(s.id)] = d
  })
  return (
    <View style={{ flex: 1, backgroundColor: '#ffffff', padding: 16 }}>
      <FlatList
        data={services}
        keyExtractor={(s) => String(s.id)}
        renderItem={({ item }) => (
          <View style={{ paddingVertical: 12, paddingLeft: 12, paddingRight: 12, borderBottomWidth: 1, borderBottomColor: '#e5e7eb', flexDirection: 'row', alignItems: 'center' }}>
            <TouchableOpacity onPress={() => toggleFavorite(item.id)} style={{ marginRight: 8 }}>
              <View style={{ width: 20, height: 20, borderRadius: 10, alignItems: 'center', justifyContent: 'center', backgroundColor: favorites.has(String(item.id)) ? '#fef3c7' : '#f3f4f6' }}>
                <Text style={{ color: favorites.has(String(item.id)) ? '#f59e0b' : '#9ca3af', fontSize: 12 }}>★</Text>
              </View>
            </TouchableOpacity>
            <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1, flexWrap: 'nowrap' }}>
              <Text style={{ fontSize: 14, fontWeight: '500', flexShrink: 1, marginRight: 8, maxWidth: '55%' }} numberOfLines={1} ellipsizeMode="tail">{item.name}</Text>
              <View style={{ marginRight: 8, backgroundColor: '#f3f4f6', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 9999 }}>
                <Text style={{ color: '#6b7280', fontSize: 12 }}>{Math.round(item.duration_min)} min</Text>
              </View>
              {(() => {
                const display = displayTagById[String(item.id)]
                if (display === 'popular') {
                  return (
                    <View style={{ marginRight: 8, backgroundColor: '#fde7f3', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 9999 }}>
                      <Text style={{ color: '#ec4899', fontSize: 12 }}>🔥 Popular</Text>
                    </View>
                  )
                }
                if (display === 'novo') {
                  return (
                    <View style={{ marginRight: 8, backgroundColor: '#fef3c7', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 9999 }}>
                      <Text style={{ color: '#f59e0b', fontSize: 12 }}>⭐️ Novidade</Text>
                    </View>
                  )
                }
                if (display === 'promocao') {
                  return (
                    <View style={{ marginRight: 8, backgroundColor: '#dcfce7', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 9999 }}>
                      <Text style={{ color: '#16a34a', fontSize: 12 }}>💰 Promoção</Text>
                    </View>
                  )
                }
                return null
              })()}
            </View>
          </View>
        )}
      />
    </View>
  )
}