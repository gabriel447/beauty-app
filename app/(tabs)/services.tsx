import { useEffect, useState } from 'react'
import { View, Text, FlatList, TextInput } from 'react-native'
import { supabase } from '@/lib/supabase'
import { Service } from '@/types'

export default function ServicesTab() {
  const [allServices, setAllServices] = useState<Service[]>([])
  const [query, setQuery] = useState('')
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
          <View style={{ paddingVertical: 14, paddingHorizontal: 20, borderBottomWidth: 1, borderBottomColor: '#e5e7eb', flexDirection: 'row', alignItems: 'center' }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
              <Text style={{ fontSize: 16, fontWeight: '500', maxWidth: '60%' }} numberOfLines={1} ellipsizeMode="tail">{item.name}</Text>
              {item.tags?.includes('popular') && (
                <View style={{ marginLeft: 8, backgroundColor: '#fde7f3', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 9999 }}>
                  <Text style={{ color: '#be185d' }}>🔥 Popular</Text>
                </View>
              )}
              {item.tags?.includes('novo') && (
                <View style={{ marginLeft: 8, backgroundColor: '#fef3c7', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 9999 }}>
                  <Text style={{ color: '#f59e0b' }}>⭐️ Novidade</Text>
                </View>
              )}
              {item.tags?.includes('promocao') && (
                <View style={{ marginLeft: 8, backgroundColor: '#dcfce7', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 9999 }}>
                  <Text style={{ color: '#16a34a' }}>💰 Promoção</Text>
                </View>
              )}
              <View style={{ marginLeft: 8, backgroundColor: '#f3f4f6', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 9999 }}>
                <Text style={{ color: '#6b7280' }}>{Math.round(item.duration_min)} min</Text>
              </View>
            </View>
          </View>
        )}
      />
    </View>
  )
}