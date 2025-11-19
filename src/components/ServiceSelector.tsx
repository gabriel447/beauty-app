import { useEffect, useState } from 'react'
import { View, Text, TouchableOpacity, FlatList, TextInput } from 'react-native'
import { supabase } from '@/lib/supabase'
import { Service } from '@/types'

type Props = {
  value: Service | null
  onChange: (service: Service) => void
}

export default function ServiceSelector({ value, onChange }: Props) {
  const [services, setServices] = useState<Service[]>([])
  const [query, setQuery] = useState('')
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
  const items = services
    .filter((s) => s.name.toLowerCase().includes(query.toLowerCase()))
  return (
    <View style={{ alignItems: 'center' }}>
      <View style={{ width: '92%', paddingTop: 8, paddingBottom: 12 }}>
        <TextInput
          value={query}
          onChangeText={setQuery}
          placeholder="Buscar"
          style={{ height: 36, paddingHorizontal: 12, borderWidth: 1, borderColor: '#e5e7eb', borderRadius: 8, backgroundColor: '#ffffff', fontSize: 14 }}
        />
      </View>
      <FlatList
        data={items}
        keyExtractor={(s) => String(s.id)}
        keyboardShouldPersistTaps="handled"
        style={{ width: '92%', maxHeight: 420 }}
        contentContainerStyle={{ paddingBottom: 24 }}
        showsVerticalScrollIndicator
        renderItem={({ item }) => (
          <TouchableOpacity
            style={{ paddingVertical: 14, paddingLeft: 0, paddingRight: 20, borderBottomWidth: 1, borderBottomColor: '#e5e7eb', backgroundColor: value?.id === item.id ? '#fff1f5' : '#ffffff' }}
            onPress={() => onChange(item)}
          >
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Text
                style={{ fontSize: 15, fontWeight: '600', maxWidth: '60%' }}
                numberOfLines={1}
                ellipsizeMode="tail"
              >
                {item.name}
              </Text>
              <Text style={{ marginLeft: 'auto', fontSize: 15, fontWeight: '600', color: '#9ca3af' }}>{formatBRL(item.price_cents)}</Text>
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  )
}