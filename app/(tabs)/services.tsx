import { useEffect, useState } from 'react'
import { View, Text, FlatList, TouchableOpacity } from 'react-native'
import { supabase } from '@/lib/supabase'
import { Service } from '@/types'
import AsyncStorage from '@react-native-async-storage/async-storage'

export default function ServicesTab() {
  const [allServices, setAllServices] = useState<Service[]>([])
  const [favorites, setFavorites] = useState<Set<string>>(new Set())
  useEffect(() => {
    const load = async () => {
      const { data } = await supabase.from('services').select('*')
      const rows = (data || []) as Service[]
      const pickIndex = (tag: string): number | null => {
        const idx = rows.findIndex((s) => Array.isArray(s.tags) && s.tags.includes(tag))
        return idx >= 0 ? idx : null
      }
      const ensureUniqueIndices = () => {
        const indices: number[] = []
        const pushIf = (n: number | null) => { if (n !== null && !indices.includes(n)) indices.push(n) }
        pushIf(pickIndex('popular'))
        pushIf(pickIndex('novo'))
        pushIf(pickIndex('promocao'))
        for (let i = 0; i < rows.length && indices.length < 3; i++) {
          if (!indices.includes(i)) indices.push(i)
        }
        const [popIdx, novoIdx, promoIdx] = [indices[0] ?? null, indices[1] ?? null, indices[2] ?? null]
        return { popIdx, novoIdx, promoIdx }
      }
      const { popIdx, novoIdx, promoIdx } = ensureUniqueIndices()
      const special = new Set(['popular', 'novo', 'promocao'])
      rows.forEach((s, i) => {
        const base = Array.isArray(s.tags) ? s.tags.filter((t) => !special.has(t)) : []
        const next: string[] = [...base]
        if (i === popIdx) next.push('popular')
        if (i === novoIdx) next.push('novo')
        if (i === promoIdx) next.push('promocao')
        s.tags = next
      })
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
  const base = allServices
  const popular = base.filter((s) => s.tags?.includes('popular')).slice(0, 2)
  const novo = base.filter((s) => s.tags?.includes('novo')).slice(0, 2)
  const others = base.filter((s) => !(s.tags?.includes('popular') || s.tags?.includes('novo'))).slice(0, Math.max(0, 8 - popular.length - novo.length))
  const services = [...popular, ...novo, ...others]
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
              {item.tags?.includes('popular') && (
                <View style={{ marginRight: 8, backgroundColor: '#fde7f3', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 9999 }}>
                  <Text style={{ color: '#ec4899', fontSize: 12 }}>🔥 Popular</Text>
                </View>
              )}
              {item.tags?.includes('novo') && (
                <View style={{ marginRight: 8, backgroundColor: '#fef3c7', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 9999 }}>
                  <Text style={{ color: '#f59e0b', fontSize: 12 }}>⭐️ Novidade</Text>
                </View>
              )}
              {item.tags?.includes('promocao') && (
                <View style={{ marginRight: 8, backgroundColor: '#dcfce7', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 9999 }}>
                  <Text style={{ color: '#16a34a', fontSize: 12 }}>💰 Promoção</Text>
                </View>
              )}
            </View>
          </View>
        )}
      />
    </View>
  )
}