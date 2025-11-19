import { useEffect, useState } from 'react'
import { View, Text, FlatList, TextInput, TouchableOpacity } from 'react-native'
import { supabase } from '@/lib/supabase'
import { Service } from '@/types'
import AsyncStorage from '@react-native-async-storage/async-storage'

export default function ServicesTab() {
  const [allServices, setAllServices] = useState<Service[]>([])
  const [query, setQuery] = useState('')
  const [favorites, setFavorites] = useState<Set<string>>(new Set())
  useEffect(() => {
    const load = async () => {
      const { data } = await supabase.from('services').select('*')
      const rows = (data || []) as Service[]
      const hasPopular = rows.some((s) => s.tags?.includes('popular'))
      const hasNovo = rows.some((s) => s.tags?.includes('novo'))
      const hasPromocao = rows.some((s) => s.tags?.includes('promocao'))
      const ensureTag = (index: number, tag: string) => {
        const s = rows[index]
        if (!s) return
        s.tags = Array.isArray(s.tags) ? s.tags : []
        if (!s.tags.includes(tag)) s.tags.push(tag)
      }
      if (!hasPopular) ensureTag(0, 'popular')
      if (!hasNovo) ensureTag(rows.length > 1 ? 1 : 0, 'novo')
      if (!hasPromocao) ensureTag(rows.length > 2 ? 2 : rows.length > 1 ? 1 : 0, 'promocao')
      rows.sort((a, b) => {
        const rank = (s: Service) => (s.tags?.includes('popular') ? 0 : s.tags?.includes('novo') ? 1 : 2)
        const ra = rank(a)
        const rb = rank(b)
        if (ra !== rb) return ra - rb
        return a.name.localeCompare(b.name)
      })
      setAllServices(rows)
    }
    load()
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
  const lower = query.toLowerCase()
  const base = allServices.filter((s) => s.name.toLowerCase().includes(lower))
  const popular = base.filter((s) => s.tags?.includes('popular')).slice(0, 2)
  const novo = base.filter((s) => s.tags?.includes('novo')).slice(0, 2)
  const others = base.filter((s) => !(s.tags?.includes('popular') || s.tags?.includes('novo'))).slice(0, Math.max(0, 8 - popular.length - novo.length))
  const services = [...popular, ...novo, ...others]
  return (
    <View style={{ flex: 1, backgroundColor: '#ffffff', padding: 16 }}>
      <View style={{ marginBottom: 12 }}>
        <TextInput
          value={query}
          onChangeText={setQuery}
          placeholder="Buscar serviços"
          style={{ height: 36, paddingHorizontal: 12, borderWidth: 1, borderColor: '#e5e7eb', borderRadius: 8, backgroundColor: '#ffffff' }}
        />
      </View>
      <FlatList
        data={services}
        keyExtractor={(s) => String(s.id)}
        renderItem={({ item }) => (
          <View style={{ paddingVertical: 16, paddingLeft: 12, paddingRight: 12, borderBottomWidth: 1, borderBottomColor: '#e5e7eb', flexDirection: 'row', alignItems: 'center' }}>
            <TouchableOpacity onPress={() => toggleFavorite(item.id)} style={{ marginRight: 8 }}>
              <View style={{ width: 24, height: 24, borderRadius: 12, alignItems: 'center', justifyContent: 'center', backgroundColor: favorites.has(String(item.id)) ? '#fef3c7' : '#f3f4f6' }}>
                <Text style={{ color: favorites.has(String(item.id)) ? '#f59e0b' : '#9ca3af' }}>★</Text>
              </View>
            </TouchableOpacity>
            <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1, flexWrap: 'nowrap' }}>
              <Text style={{ fontSize: 16, fontWeight: '500', flexShrink: 1, marginRight: 8, maxWidth: '55%' }} numberOfLines={1} ellipsizeMode="tail">{item.name}</Text>
              <View style={{ marginRight: 8, backgroundColor: '#f3f4f6', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 9999 }}>
                <Text style={{ color: '#6b7280' }}>{Math.round(item.duration_min)} min</Text>
              </View>
              {item.tags?.includes('popular') && (
                <View style={{ marginRight: 8, backgroundColor: '#fde7f3', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 9999 }}>
                  <Text style={{ color: '#be185d' }}>🔥 Popular</Text>
                </View>
              )}
              {item.tags?.includes('novo') && (
                <View style={{ marginRight: 8, backgroundColor: '#fef3c7', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 9999 }}>
                  <Text style={{ color: '#f59e0b' }}>⭐️ Novidade</Text>
                </View>
              )}
              {item.tags?.includes('promocao') && (
                <View style={{ marginRight: 8, backgroundColor: '#dcfce7', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 9999 }}>
                  <Text style={{ color: '#16a34a' }}>💰 Promoção</Text>
                </View>
              )}
            </View>
          </View>
        )}
      />
    </View>
  )
}