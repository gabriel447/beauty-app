import { useEffect, useState } from 'react'
import { View, Text, FlatList } from 'react-native'
import { supabase } from '@/lib/supabase'
import { Service } from '@/types'

export default function ServicesTab() {
  const [services, setServices] = useState<Service[]>([])
  useEffect(() => {
    const load = async () => {
      const { data } = await supabase.from('services').select('*')
      const rows = (data || []) as Service[]
      rows.sort((a, b) => {
        const rank = (s: Service) => (s.tags?.includes('popular') ? 0 : s.tags?.includes('novo') ? 1 : 2)
        const ra = rank(a)
        const rb = rank(b)
        if (ra !== rb) return ra - rb
        return a.name.localeCompare(b.name)
      })
      const popular = rows.filter((s) => s.tags?.includes('popular')).slice(0, 2)
      const novo = rows.filter((s) => s.tags?.includes('novo')).slice(0, 2)
      const others = rows.filter((s) => !(s.tags?.includes('popular') || s.tags?.includes('novo'))).slice(0, Math.max(0, 8 - popular.length - novo.length))
      setServices([...popular, ...novo, ...others])
    }
    load()
  }, [])
  return (
    <View style={{ flex: 1, backgroundColor: '#ffffff', padding: 16 }}>
      <FlatList
        data={services}
        keyExtractor={(s) => String(s.id)}
        renderItem={({ item }) => (
          <View style={{ paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#e5e7eb', flexDirection: 'row', alignItems: 'center' }}>
            <View style={{ flex: 1 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Text style={{ fontSize: 16, fontWeight: '500' }}>{item.name}</Text>
                {item.tags?.includes('popular') && (
                  <View style={{ marginLeft: 8, backgroundColor: '#fde7f3', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 9999 }}>
                    <Text style={{ color: '#be185d' }}>🔥 Popular</Text>
                  </View>
                )}
                {item.tags?.includes('novo') && (
                  <View style={{ marginLeft: 8, backgroundColor: '#fef3c7', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 9999 }}>
                    <Text style={{ color: '#f59e0b' }}>★ Novidade</Text>
                  </View>
                )}
              </View>
              <Text style={{ color: '#6b7280' }}>{Math.round(item.duration_min)} min</Text>
            </View>
            <Text style={{ fontSize: 16 }}>R$ {(item.price_cents / 100).toFixed(0)}</Text>
          </View>
        )}
      />
    </View>
  )
}